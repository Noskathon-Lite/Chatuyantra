import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

// Function to calculate direction based on coordinates
const calculateDirection = (deviceLocation, ambulanceLocation) => {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const toDegrees = (rad) => (rad * 180) / Math.PI;

  const { latitude: lat1, longitude: lon1 } = deviceLocation;
  const { latitude: lat2, longitude: lon2 } = ambulanceLocation;

  const dLon = toRadians(lon2 - lon1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

  let bearing = toDegrees(Math.atan2(y, x));
  bearing = (bearing + 360) % 360; // Normalize to 0-360 degrees

  if ((bearing >= 315 && bearing <= 360) || (bearing >= 0 && bearing < 45)) {
    return "north";
  } else if (bearing >= 45 && bearing < 135) {
    return "east";
  } else if (bearing >= 135 && bearing < 225) {
    return "south";
  } else if (bearing >= 225 && bearing < 315) {
    return "west";
  }
};

export default function TrafficLocation() {
  const [ambulanceDirection, setAmbulanceDirection] = useState(""); // Direction of ambulance
  const [lights, setLights] = useState({
    north: "red",
    south: "red",
    east: "red",
    west: "red",
  });
  const deviceLocation = { latitude: 27.7172, longitude: 85.3240 }; // Your device's coordinates

  useEffect(() => {
    const fetchAmbulanceLocation = async () => {
      try {
        // Fetch the ambulance's coordinates from Firebase API
        const response = await fetch("https://ncithack-default-rtdb.asia-southeast1.firebasedatabase.app/test.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwZDg4ZGQ1NWQxYjAwZDg0ZWU4MWQwYjk2M2RlNGNkOGM0ZmFjM2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbmNpdGhhY2siLCJhdWQiOiJuY2l0aGFjayIsImF1dGhfdGltZSI6MTczNjcwNDQ4OCwidXNlcl9pZCI6IlVObUR5RjBIT1hWYUxURWNYSnpUaW1zYmp6RjMiLCJzdWIiOiJVTm1EeUYwSE9YVmFMVEVjWEp6VGltc2JqekYzIiwiaWF0IjoxNzM2NzA0NDg4LCJleHAiOjE3MzY3MDgwODgsImVtYWlsIjoicG91ZGVsbWFuaXNoMzIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJwb3VkZWxtYW5pc2gzMjFAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.QdLgaklriW_HJliHeJgiOy9VI9C2nJAM-r8vyuc0Y42mCdEMmEiRiYUVb8mSra9oniRQAXw4eMFgFBLB3TawwbHGEdHejo7XvZzMA9SRtfOJMhMKYRExMIzo-hpftVUnTLc955mx2W9v4ixZsweAr-H3KU5A5euvTQdcRokN6ASyItyxxYefn3lRYfVkPQeycrjKLX4B-3WfFRMcUnqKrDmEsiPDjM8RKEW7diC2wxNyMkiViZCVBAqVT0dbPjhEWusEGUChDsIkvjyvGACfI9rKts0O_SSI8Q9UEiIgsvj6oMcbaptar9SwdzapTAYFF4C55VSpVrfnaH7R9enQXg");
        const ambulanceLocation = await response.json();

        // Calculate the direction
        const direction = calculateDirection(deviceLocation, ambulanceLocation);
        setAmbulanceDirection(direction);

        // Show notification
        Alert.alert("Notification", `Ambulance detected from ${direction.toUpperCase()}`);
        handleTrafficLights(direction);
      } catch (error) {
        console.error("Error fetching ambulance location:", error);
      }
    };

    // Poll the API every 5 seconds
    const interval = setInterval(fetchAmbulanceLocation, 100000000);
    return () => clearInterval(interval);
  }, []);

  const handleTrafficLights = (direction) => {
    // Turn all lights red, then make the ambulance's direction green
    setLights({
      north: "red",
      south: "red",
      east: "red",
      west: "red",
      [direction]: "green",
    });
  };

  return (
    <View style={styles.container}>
      {/* Compass */}
      <View style={styles.compassContainer}>
        <Text style={styles.compassText}>
          Ambulance Coming from: {ambulanceDirection.toUpperCase() || "N/A"}
        </Text>
      </View>

      {/* Roads */}
      <View style={styles.roadContainer}>
        <View style={styles.roadRow}>
          <TrafficLight color={lights.north} />
        </View>

        <View style={styles.roadRow}>
          <TrafficLight color={lights.west} />
          <View style={styles.compass}>
            <Text style={styles.compassTitle}>🚔 Compass</Text>
          </View>
          <TrafficLight color={lights.east} />
        </View>

        <View style={styles.roadRow}>
          <TrafficLight color={lights.south} />
        </View>
      </View>
    </View>
  );
}

// TrafficLight Component
const TrafficLight = ({ color }) => {
  return (
    <View style={styles.trafficLight}>
      <View style={[styles.light, { backgroundColor: color === "red" ? "red" : "gray" }]} />
      <View style={[styles.light, { backgroundColor: color === "yellow" ? "yellow" : "gray" }]} />
      <View style={[styles.light, { backgroundColor: color === "green" ? "green" : "gray" }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  compassContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  compassText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  roadContainer: {
    width: "80%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  roadRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  compass: {
    width: 100,
    height: 100,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    margin: 10,
  },
  compassTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trafficLight: {
    width: 30,
    height: 80,
    backgroundColor: "#222",
    borderRadius: 5,
    padding: 2,
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10,
  },
  light: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
