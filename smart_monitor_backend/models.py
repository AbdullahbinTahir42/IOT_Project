from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.sql import func
from database import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Sensor Data
    voltage = Column(Float)       # From INA219
    current = Column(Float)       # From INA219
    power = Column(Float)         # Calculated
    temperature = Column(Float)   # From DHT22
    humidity = Column(Float)      # From DHT22
    
    # Logic Tags
    source = Column(String)       # "Fan", "LED", "Total"