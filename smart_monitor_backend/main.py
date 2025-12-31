from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# 1. Load Environment Variables
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# 2. Connect to Supabase
if not url or not key:
    print("Error: Supabase keys not found in .env file!")
    # Create a fake client for local dev if keys missing (prevents crash)
    class FakeSupabase:
        def table(self, name): return self
        def insert(self, data): return self
        def select(self, cols): return self
        def order(self, col, desc): return self
        def limit(self, num): return self
        def execute(self): 
            class Response: data = []
            return Response()
    supabase = FakeSupabase()
else:
    supabase: Client = create_client(url, key)

# 3. Initialize FastAPI
app = FastAPI()

# 4. CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Define Data Models
class ReadingSchema(BaseModel):
    voltage: float
    current: float
    power: float
    temperature: float
    humidity: float
    light_level: int       
    fan_status: str        
    led_status: str        
    source: str

# NEW: Schemas for Control Actions
class FanControlSchema(BaseModel):
    speed: str
    user_id: str | None = None

class LedControlSchema(BaseModel):
    state: bool
    user_id: str | None = None

# 6. Routes

@app.get("/")
def home():
    return {"message": "VoltSense API is Online"}

@app.post("/readings/")
def create_reading(reading: ReadingSchema):
    data = {
        "voltage": reading.voltage,
        "current": reading.current,
        "power": reading.power,
        "temperature": reading.temperature,
        "humidity": reading.humidity,
        "light_level": reading.light_level,
        "fan_status": reading.fan_status,
        "led_status": reading.led_status,
        "source": reading.source
    }
    
    try:
        if isinstance(supabase, Client): # Only try real insert if valid client
            response = supabase.table("sensor_readings").insert(data).execute()
            return {"status": "success", "data": response.data}
        else:
            print("Mock Data Inserted:", data)
            return {"status": "mock_success", "data": data}
    except Exception as e:
        print(f"Database Error: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/readings/")
def get_readings():
    try:
        response = supabase.table("sensor_readings").select("*").order("id", desc=True).limit(10).execute()
        return response.data
    except Exception as e:
        print(f"Fetch Error: {e}")
        return []

# --- NEW CONTROL ENDPOINTS (Synchronized with App.jsx) ---

@app.post("/control/fan")
def control_fan(command: FanControlSchema):
    print(f"COMMAND RECEIVED: Set Fan to {command.speed} (User: {command.user_id})")
    # In a real system, you might send MQTT message here
    return {"status": "success", "speed": command.speed}

@app.post("/control/led")
def control_led(command: LedControlSchema):
    state_str = "ON" if command.state else "OFF"
    print(f"COMMAND RECEIVED: Set LED to {state_str} (User: {command.user_id})")
    # In a real system, you might send MQTT message here
    return {"status": "success", "state": command.state}