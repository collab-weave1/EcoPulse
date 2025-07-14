import os
from dotenv import load_dotenv
import pandas as pd
from sqlalchemy import create_engine
from climate_indices import indices, compute
load_dotenv()
DB_URL = os.getenv('DB_URL')
engine = create_engine(DB_URL)


def run_compute_risk():
    ndvi = pd.read_sql('SELECT date, ndvi FROM ndvi_timeseries', engine, parse_dates=['date'])
    weather = pd.read_sql('SELECT date, rain, pet FROM weather', engine, parse_dates=['date'])
    spei_vals = indices.spei(
        precip=weather['rain'].values,
        pet=weather['pet'].values,
        scale=30,
        distribution=indices.Distribution.gamma,
        periodicity=compute.Periodicity.monthly,
        data_start_year=int(weather.date.dt.year.min()),
        calibration_year_initial=int(weather.date.dt.year.min()),
        calibration_year_final=int(weather.date.dt.year.max())
    )
    weather['spei_30'] = spei_vals
    merged = ndvi.merge(weather[['date','spei_30']], on='date').dropna()
    merged['ndvi_z'] = (merged.ndvi - merged.ndvi.mean())/merged.ndvi.std()
    merged['ecorisk'] = 0.6 * (-merged.ndvi_z.clip(upper=0)) + 0.4 * (-merged.spei_30.clip(upper=0))
    merged[['date','ecorisk']].to_sql('risk_timeseries', engine, if_exists='replace', index=False)
