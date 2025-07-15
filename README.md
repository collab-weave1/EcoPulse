# EcoPulse

EcoPulse is a real-time environmental risk monitoring platform. It enables region-specific insights by aggregating data from multiple sources (satellite, weather, water flow) and visualizing eco-risk metrics, NDVI trends, and drought zones.

---

## Tech Stack

### Frontend

* **Framework:** React + Vite
* **Maps:** Mapbox GL JS
* **Styling:** Tailwind CSS
* **Hosting:** [Netlify](https://www.netlify.com/)

### Backend

* **Framework:** FastAPI (Python)
* **API Endpoints:** RESTful APIs for NDVI, river flow, weather, risk timeseries, subscriptions, alerts
* **Hosting:** [Render](https://render.com)

### Database

* **Engine:** PostgreSQL with PostGIS extension
* **Hosting:** [Aiven](https://aiven.io)
---

## Deployed App

**Live URL:** [https://ecopulse-risk-monitoring.netlify.app](https://ecopulse-risk-monitoring.netlify.app)

---

## Features

* Interactive environmental risk graph per region
* NDVI trends and drought zone visualization
* Infographic layers over Mapbox GL map
* Email-based alert subscription system
* FastAPI backend with CORS support for Netlify
* Data ingestion endpoints for NDVI, weather, USGS flow

---

## Local Setup

### Prerequisites:

* Python 3.10+
* Node.js 18+
* PostgreSQL with PostGIS extension

### Backend Setup

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### PostgreSQL Setup (Local Only)

If you're running the DB locally, enable PostGIS and seed region data:

```sql
CREATE EXTENSION postgis;
SELECT postgis_full_version();

INSERT INTO regions (id, name, geom)
VALUES (
  1,
  'Bangalore Area',
  ST_GeomFromText('POLYGON((77.5 12.9, 77.6 12.9, 77.6 13.0, 77.5 13.0, 77.5 12.9))', 4326)
);
```

---

## Notes for Render Deployment

* Free tier services may spin down with inactivity
* Initial requests may experience a delay (\~50s)

---

## Deployment

### Render (Backend)

1. Dockerfile at project root or configured from `/server`
2. Expose correct port
3. Set environment variables: `DB_URL`, `PORT`

### Netlify (Frontend)

* Place `_redirects` file inside `client/public/`:

  ```
  /*    /index.html   200
  ```
* Set `VITE_API_URL` and `VITE_MAPBOX_TOKEN` in Netlify environment variables

---

> *Developed with ❤️ to empower eco-conscious decision-making.*
