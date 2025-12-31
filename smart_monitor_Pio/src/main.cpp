#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_INA219.h>
#include <DHT.h>

// ==========================================
// 1. WI-FI & SERVER SETTINGS
// ==========================================
const char* ssid = "Usama Tahir";         // <--- CHECK THIS
const char* password = "rubyonrails2025"; // <--- CHECK THIS
String serverName = "http://192.168.1.9:8000/readings/"; // <--- CONFIRM IP

// ==========================================
// 2. SENSOR CONFIG
// ==========================================
#define DHTPIN 18     
#define DHTTYPE DHT11 

Adafruit_INA219 ina219;
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);

  // Explicitly set I2C pins just to be safe (SDA=21, SCL=22)
  Wire.begin(21, 22);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());

  if (!ina219.begin()) {
    Serial.println("Failed to find INA219 chip");
  }
  dht.begin();
}

void loop() {
  if(WiFi.status() == WL_CONNECTED) {
    
    // 1. READ DATA
    float busVoltage = ina219.getBusVoltage_V();
    float current_mA = ina219.getCurrent_mA();
    float power_mW = ina219.getPower_mW();
    float tempC = dht.readTemperature();
    float humid = dht.readHumidity();

    // Sanitize bad sensor reads
    if (isnan(tempC)) tempC = 0.0;
    if (isnan(humid)) humid = 0.0;

    // 2. BUILD JSON (Matches Python Schema EXACTLY)
    String jsonData = "{";
    jsonData += "\"voltage\":" + String(busVoltage) + ",";
    jsonData += "\"current\":" + String(current_mA) + ","; 
    jsonData += "\"power\":" + String(power_mW) + ",";
    jsonData += "\"temperature\":" + String(tempC) + ",";
    jsonData += "\"humidity\":" + String(humid) + ",";
    jsonData += "\"light_level\":0,";        // Dummy value
    jsonData += "\"fan_status\":\"ON\",";    // Fixed: Now a String "ON"
    jsonData += "\"led_status\":\"OFF\",";   // Fixed: Added missing field
    jsonData += "\"source\":\"ESP32\"";      // Fixed: Added missing field
    jsonData += "}";

    // 3. SEND POST REQUEST
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Server Response: " + String(httpResponseCode));
    } else {
      Serial.println("Error on sending POST: " + String(httpResponseCode));
    }
    
    http.end();
  }

  delay(2000); 
}