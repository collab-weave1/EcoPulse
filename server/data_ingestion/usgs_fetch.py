import os
from dotenv import load_dotenv
import pandas as pd
import requests
from sqlalchemy import create_engine
load_dotenv()
DB_URL = os.getenv('DB_URL')
engine = create_engine(DB_URL)


def fetch_usgs(site):
    url = f'https://waterservices.usgs.gov/nwis/iv/?format=json&sites={site}&parameterCd=00060'
    r = requests.get(url).json()
    ts = r['value']['timeSeries'][0]['values'][0]['value']
    df = pd.DataFrame(ts)
    df.columns = ['date', 'flow']
    df.to_sql('river_flow', engine, if_exists='append', index=False)
