import os
import traceback
from fastapi import FastAPI, HTTPException, Query, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session

from geoalchemy2.shape import to_shape
from shapely.geometry import mapping

from dotenv import load_dotenv

from models import Base, RiskTimeSeries, Subscription, NDVITimeSeries, Weather, RiverFlow, Region
from notifications import send_alerts
from data_ingestion.usgs_fetch import fetch_usgs
from data_ingestion.weather_fetch import fetch_weather
from data_ingestion.ndvi_fetch import fetch_ndvi
from analytics.compute_risk import run_compute_risk


load_dotenv()
DB_URL = os.getenv('DB_URL')
if not DB_URL:
    raise RuntimeError('DB_URL not set in environment')

OWM_LAT = os.getenv('OWM_LAT', '12.97')
OWM_LON = os.getenv('OWM_LON', '77.59')
AOI_COORDS = os.getenv('AOI_COORDS', '[[[77.5,12.9],[77.6,12.9],[77.6,13.0],[77.5,13.0]]]')

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Create tables and insert data
def init_db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        # Create Region data first (THIS IS MISSING!)
        count_regions = session.execute(text("SELECT COUNT(*) FROM regions")).scalar()
        if count_regions == 0:
            from geoalchemy2 import WKTElement
            # Create a sample region with geometry
            region_wkt = 'POLYGON((77.5 12.9, 77.6 12.9, 77.6 13.0, 77.5 13.0, 77.5 12.9))'
            region = Region(
                id=1,
                name="Bangalore Rural",
                geom=WKTElement(region_wkt, srid=4326)
            )
            session.add(region)
            print("Added sample region")

        # Risk timeseries data
        count1 = session.execute(text("SELECT COUNT(*) FROM risk_timeseries")).scalar()
        if count1 == 0:
            session.add_all([
                RiskTimeSeries(region_id=1, date='2025-07-01', ecorisk=25.0),
                RiskTimeSeries(region_id=1, date='2025-07-02', ecorisk=30.5),
                RiskTimeSeries(region_id=1, date='2025-07-03', ecorisk=45.2)
            ])
            print("Added risk timeseries data")

        # NDVI values
        count2 = session.execute(text("SELECT COUNT(*) FROM ndvi_timeseries")).scalar()
        if count2 == 0:
            session.add_all([
                NDVITimeSeries(date='2025-07-01', ndvi=0.5),
                NDVITimeSeries(date='2025-07-02', ndvi=0.48),
                NDVITimeSeries(date='2025-07-03', ndvi=0.45)
            ])
            print("Added NDVI data")

        # Weather data
        count3 = session.execute(text("SELECT COUNT(*) FROM weather")).scalar()
        if count3 == 0:
            session.add_all([
                Weather(date='2025-07-01', rain=10.0, temp=30.0, pet=15.0),
                Weather(date='2025-07-02', rain=5.0, temp=31.0, pet=15.5),
                Weather(date='2025-07-03', rain=0.0, temp=33.0, pet=16.5)
            ])
            print("Added weather data")

        # River flow data
        count4 = session.execute(text("SELECT COUNT(*) FROM river_flow")).scalar()
        if count4 == 0:
            from datetime import datetime
            session.add_all([
                RiverFlow(date=datetime(2025, 7, 1, 10), flow=200.0),
                RiverFlow(date=datetime(2025, 7, 2, 10), flow=150.0),
                RiverFlow(date=datetime(2025, 7, 3, 10), flow=120.0)
            ])
            print("Added river flow data")

        session.commit()
        print("Database initialization complete")

    except Exception as e:
        session.rollback()
        print(f"Error initializing database: {e}")
        raise
    finally:
        session.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv('FRONTEND_URL', 'http://localhost:5173')],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.on_event('startup')
def on_startup():
    init_db()


@app.get('/ping')
def ping():
    return {'message': 'pong'}


# to be scheduled later to a cron with maybe InfluxDB
@app.post('/ingest/{data_type}')
def ingest_data(data_type: str, background_tasks: BackgroundTasks):
    try:
        if data_type == 'weather':
            background_tasks.add_task(fetch_weather, float(OWM_LAT), float(OWM_LON), '2025-06-01', '2025-07-01')
        elif data_type == 'usgs':
            background_tasks.add_task(fetch_usgs, '00060')
        elif data_type == 'ndvi':
            aoi = eval(AOI_COORDS)
            background_tasks.add_task(fetch_ndvi, aoi, '2025-06-01', '2025-07-01')
        else:
            raise HTTPException(400, 'Unknown data_type')
        return {'msg': f'{data_type} ingestion scheduled'}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, str(e))


@app.post('/compute')
def compute(background_tasks: BackgroundTasks):
    try:
        background_tasks.add_task(run_compute_risk)
        return {'msg': 'Risk computation scheduled'}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, str(e))


# Also add better error handling to your region endpoint:

@app.get("/regions/{region_id}/geojson")
def region_geojson(region_id: int, db: Session = Depends(get_db)):
    try:
        print(f"Fetching region {region_id}")

        # Fetch region geometry
        region = db.query(Region).filter(Region.id == region_id).first()
        if not region:
            print(f"Region {region_id} not found")
            raise HTTPException(404, f"Region {region_id} not found")

        # Fetch latest EcoRisk
        risk = (
            db.query(RiskTimeSeries)
                .filter(RiskTimeSeries.region_id == region_id)
                .order_by(RiskTimeSeries.date.desc())
                .first()
        )
        if not risk:
            print(f"No EcoRisk data for region {region_id}")
            raise HTTPException(404, f"No EcoRisk data for region {region_id}")

        # Convert geometry to GeoJSON
        shapely_geom = to_shape(region.geom)
        geojson = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": mapping(shapely_geom),
                    "properties": {
                        "region_id": region_id,
                        "name": region.name,
                        "ecorisk": risk.ecorisk
                    }
                }
            ]
        }
        print(f"Returning GeoJSON for region {region_id}")
        return JSONResponse(content=geojson)

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in region_geojson: {e}")
        traceback.print_exc()
        raise HTTPException(500, str(e))


@app.get("/stations/water")
def get_water_stations(region: int = Query(..., description="Region ID")):
    print(f"Fetching water stations for region {region}")
    dummy = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [77.55, 12.95]},
                "properties": {"station": "USGS #001", "region_id": region}
            }
        ]
    }
    return JSONResponse(content=dummy)


@app.get("/zones/drought")
def get_drought_zones(region: int = Query(..., description="Region ID")):
    print(f"Fetching drought zones for region {region}")
    dummy_drought = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[77.5, 12.9], [77.6, 12.9], [77.6, 13.0], [77.5, 13.0], [77.5, 12.9]]]
                },
                "properties": {
                    "severity": "moderate",
                    "region_id": region
                }
            }
        ]
    }
    return JSONResponse(content=dummy_drought)


# Add this to your main.py init_db() function

def init_db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        # Create Region data first (THIS IS MISSING!)
        count_regions = session.execute(text("SELECT COUNT(*) FROM regions")).scalar()
        if count_regions == 0:
            from geoalchemy2 import WKTElement
            # Create a sample region with geometry
            region_wkt = 'POLYGON((77.5 12.9, 77.6 12.9, 77.6 13.0, 77.5 13.0, 77.5 12.9))'
            region = Region(
                id=1,
                name="Bangalore Rural",
                geom=WKTElement(region_wkt, srid=4326)
            )
            session.add(region)
            print("Added sample region")

        # Risk timeseries data
        count1 = session.execute(text("SELECT COUNT(*) FROM risk_timeseries")).scalar()
        if count1 == 0:
            session.add_all([
                RiskTimeSeries(region_id=1, date='2025-07-01', ecorisk=25.0),
                RiskTimeSeries(region_id=1, date='2025-07-02', ecorisk=30.5),
                RiskTimeSeries(region_id=1, date='2025-07-03', ecorisk=45.2)
            ])
            print("Added risk timeseries data")

        # NDVI values
        count2 = session.execute(text("SELECT COUNT(*) FROM ndvi_timeseries")).scalar()
        if count2 == 0:
            session.add_all([
                NDVITimeSeries(date='2025-07-01', ndvi=0.5),
                NDVITimeSeries(date='2025-07-02', ndvi=0.48),
                NDVITimeSeries(date='2025-07-03', ndvi=0.45)
            ])
            print("Added NDVI data")

        # Weather data
        count3 = session.execute(text("SELECT COUNT(*) FROM weather")).scalar()
        if count3 == 0:
            session.add_all([
                Weather(date='2025-07-01', rain=10.0, temp=30.0, pet=15.0),
                Weather(date='2025-07-02', rain=5.0, temp=31.0, pet=15.5),
                Weather(date='2025-07-03', rain=0.0, temp=33.0, pet=16.5)
            ])
            print("Added weather data")

        # River flow data
        count4 = session.execute(text("SELECT COUNT(*) FROM river_flow")).scalar()
        if count4 == 0:
            from datetime import datetime
            session.add_all([
                RiverFlow(date=datetime(2025, 7, 1, 10), flow=200.0),
                RiverFlow(date=datetime(2025, 7, 2, 10), flow=150.0),
                RiverFlow(date=datetime(2025, 7, 3, 10), flow=120.0)
            ])
            print("Added river flow data")

        session.commit()
        print("Database initialization complete")

    except Exception as e:
        session.rollback()
        print(f"Error initializing database: {e}")
        raise
    finally:
        session.close()


# Also add better error handling to your region endpoint:

@app.get("/regions/{region_id}/geojson")
def region_geojson(region_id: int, db: Session = Depends(get_db)):
    try:
        print(f"Fetching region {region_id}")

        # Fetch region geometry
        region = db.query(Region).filter(Region.id == region_id).first()
        if not region:
            print(f"Region {region_id} not found")
            raise HTTPException(404, f"Region {region_id} not found")

        # Fetch latest EcoRisk
        risk = (
            db.query(RiskTimeSeries)
                .filter(RiskTimeSeries.region_id == region_id)
                .order_by(RiskTimeSeries.date.desc())
                .first()
        )
        if not risk:
            print(f"No EcoRisk data for region {region_id}")
            raise HTTPException(404, f"No EcoRisk data for region {region_id}")

        # Convert geometry to GeoJSON
        shapely_geom = to_shape(region.geom)
        geojson = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": mapping(shapely_geom),
                    "properties": {
                        "region_id": region_id,
                        "name": region.name,
                        "ecorisk": risk.ecorisk
                    }
                }
            ]
        }
        print(f"Returning GeoJSON for region {region_id}")
        return JSONResponse(content=geojson)

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in region_geojson: {e}")
        traceback.print_exc()
        raise HTTPException(500, str(e))


@app.get("/stations/water")
def get_water_stations(region: int = Query(..., description="Region ID")):
    print(f"Fetching water stations for region {region}")
    dummy = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [77.55, 12.95]},
                "properties": {"station": "USGS #001", "region_id": region}
            }
        ]
    }
    return JSONResponse(content=dummy)


@app.get("/zones/drought")
def get_drought_zones(region: int = Query(..., description="Region ID")):
    print(f"Fetching drought zones for region {region}")
    dummy_drought = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[77.5, 12.9], [77.6, 12.9], [77.6, 13.0], [77.5, 13.0], [77.5, 12.9]]]
                },
                "properties": {
                    "severity": "moderate",
                    "region_id": region
                }
            }
        ]
    }
    return JSONResponse(content=dummy_drought)


@app.get("/events/calamity")
def get_calamity_events(region: int = Query(..., description="Region ID")):
    print(f"Fetching calamity events for region {region}")
    dummy_calamity = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [77.58, 12.97]
                },
                "properties": {
                    "event_type": "wildfire",
                    "severity": "high",
                    "date": "2025-07-10",
                    "region_id": region
                }
            }
        ]
    }
    return JSONResponse(content=dummy_calamity)


# @app.get("/stations/water")
# def get_water_stations(region: int):
#     dummy = {
#         "type": "FeatureCollection",
#         "features": [
#             {
#                 "type": "Feature",
#                 "geometry": {"type": "Point", "coordinates": [77.55, 12.95]},
#                 "properties": {"station": "USGS #001"}
#             }
#         ]
#     }
#     return JSONResponse(content=dummy)


@app.get('/regions/{region_id}/risk')
def get_risk(
    region_id: int,
    limit: int = Query(30, ge=1, le=100),
    db: Session = Depends(get_db)
):
    try:
        results = (
            db.query(RiskTimeSeries.date, RiskTimeSeries.ecorisk)
              .filter(RiskTimeSeries.region_id == region_id)
              .order_by(RiskTimeSeries.date.desc())
              .limit(limit)
              .all()
        )
        if not results:
            raise HTTPException(404, 'No data found for this region.')
        return [{'date': r.date.isoformat(), 'ecorisk': r.ecorisk} for r in results]
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, str(e))


@app.post('/subscriptions/')
def create_subscription(
    region_id: int,
    email: str,
    db: Session = Depends(get_db)
):
    try:
        sub = Subscription(region_id=region_id, email=email)
        db.add(sub)
        db.commit()
        db.refresh(sub)
        return {'id': sub.id, 'region_id': sub.region_id, 'email': sub.email}
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(500, str(e))


@app.post('/alerts/check')
def check_alerts(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    try:
        latest = db.query(RiskTimeSeries.ecorisk).order_by(RiskTimeSeries.date.desc()).first()
        if latest and latest[0] > 50:
            background_tasks.add_task(send_alerts, latest[0])
        return {'checked': True}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, str(e))


# To run locally:
# uvicorn main:app --host 0.0.0.0 --port 8001 --reload --log-level debug
