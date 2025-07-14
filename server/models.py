from sqlalchemy import Column, Integer, String, Float, Date, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from geoalchemy2 import Geometry

Base = declarative_base()


class NDVITimeSeries(Base):
    __tablename__ = 'ndvi_timeseries'
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, index=True)
    ndvi = Column(Float, nullable=False)


class Weather(Base):
    __tablename__ = 'weather'
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, index=True)
    rain = Column(Float, nullable=False)
    temp = Column(Float, nullable=False)
    pet = Column(Float, nullable=False)


class RiverFlow(Base):
    __tablename__ = 'river_flow'
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False)
    flow = Column(Float, nullable=False)


class RiskTimeSeries(Base):
    __tablename__ = 'risk_timeseries'
    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    ecorisk = Column(Float, nullable=False)


class Region(Base):
    __tablename__ = 'regions'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    geom = Column(Geometry('POLYGON'), nullable=False)


class Subscription(Base):
    __tablename__ = 'subscriptions'
    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False)
