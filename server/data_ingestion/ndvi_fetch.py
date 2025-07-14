import os
from dotenv import load_dotenv
import pandas as pd
from sqlalchemy import create_engine

def fetch_ndvi(aoi_coords, start, end):
    try:
        import ee
    except ImportError:
        raise RuntimeError('Earth Engine library not available')

    load_dotenv()
    DB_URL = os.getenv('DB_URL')
    if not DB_URL:
        raise RuntimeError('DB_URL not set in environment')
    engine = create_engine(DB_URL)

    ee.Initialize()
    aoi = ee.Geometry.Polygon(aoi_coords)
    col = (
        ee.ImageCollection('MODIS/006/MOD13Q1')
          .filterDate(start, end)
          .select('NDVI')
          .filterBounds(aoi)
    )
    def get_mean(img):
        stats = img.reduceRegion(
            reducer=ee.Reducer.mean(), geometry=aoi, scale=250
        )
        return ee.Feature(None, {
            'date': img.date().format('YYYY-MM-dd'),
            'ndvi': stats.get('NDVI')
        })
    feats = col.map(get_mean).getInfo().get('features', [])
    rows = [(f['properties']['date'], f['properties']['ndvi']) for f in feats]
    df = pd.DataFrame(rows, columns=['date', 'ndvi'])
    df.to_sql('ndvi_timeseries', engine, if_exists='append', index=False)