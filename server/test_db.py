# to check the cloud db connection

from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv("DB_URL"))

with engine.connect() as conn:
    result = conn.execute(text("SELECT 1"))
    df = conn.execute(text('SELECT * FROM risk_timeseries'))
    print(df)
    print("✅ DB is working:", result.scalar())
