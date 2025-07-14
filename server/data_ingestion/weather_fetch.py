import os
from dotenv import load_dotenv
import pandas as pd
import requests
from sqlalchemy import create_engine
load_dotenv()
DB_URL = os.getenv('DB_URL')
engine = create_engine(DB_URL)

def fetch_weather(lat, lon, start, end):
    key = os.getenv('OWM_KEY')
    url = 'https://api.openweathermap.org/data/2.5/onecall/timemachine'
    records = []
    for ts in pd.date_range(start,end):
        d = requests.get(url, params={'lat':lat,'lon':lon,'dt':int(ts.timestamp()),'appid':key}).json()
        records.append({'date': ts.strftime('%Y-%m-%d'), 'rain': d.get('current',{}).get('rain',{}).get('1h',0), 'temp': d['current']['temp'], 'pet': d['current']['temp']*0.5})
    df = pd.DataFrame(records)
    df.to_sql('weather', engine, if_exists='append', index=False)
