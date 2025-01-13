#include <TinyGPS++.h>
// Create a TinyGPS++ object
TinyGPSPlus gps;

void setup() {
  Serial.begin(9600);   // Initialize Serial Monitor
  Serial1.begin(9600);  // Initialize default TX/RX for GPS communication
  Serial.println("GPS Module Test - Using Default TX/RX Pins");
}

void loop() {
  // Read data from GPS module
  while (Serial1.available() > 0) {
    char c = Serial1.read(); // Read a character from GPS
    if (gps.encode(c)) {     // Parse the data
      displayGPSInfo();
      
    }
  }
}

// Function to display GPS information
void displayGPSInfo() {
  if (gps.location.isValid()) {
    Serial.print("Latitude: ");
    Serial.println(gps.location.lat(), 6); // Print latitude with 6 decimal places

    Serial.print("Longitude: ");
    Serial.println(gps.location.lng(), 6); // Print longitude with 6 decimal places

    //Serial.print("Altitude: ");
    //Serial.print(gps.altitude.
    //         meters());
    //Serial.println(" meters");

    Serial.print("Satellites: ");
    Serial.println(gps.satellites.value());
  } else {
    Serial.println("Waiting for GPS signal...");
  }
}