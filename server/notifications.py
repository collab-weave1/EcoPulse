import os
from dotenv import load_dotenv
import smtplib
from email.message import EmailMessage
import pandas as pd
from sqlalchemy import create_engine
load_dotenv()
DB_URL = os.getenv('DB_URL')
engine = create_engine(DB_URL)

def send_alerts(risk):
    subs = pd.read_sql('SELECT DISTINCT email FROM subscriptions', engine)
    for email in subs.email:
        msg = EmailMessage()
        msg['Subject'] = f'EcoPulse Alert: {risk:.1f}'
        msg.set_content(f'EcoRisk={risk:.1f}')
        with smtplib.SMTP(os.getenv('SMTP_HOST')) as s:
            s.login(os.getenv('SMTP_USER'), os.getenv('SMTP_PASS'))
            s.send_message(msg)
