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

// Function to get the arrow symbol for a direction
const getArrow = (direction) => {
  switch (direction) {
    case "north":
      return "↓";
    case "east":
      return "←";
    case "south":
      return "↑";
    case "west":
      return "→";
    default:
      return "N/A";
  }
};

// Function to update Firebase with the ambulance direction values
const updateDirectionToFirebase = async (direction) => {
  try {
    // Create the data object based on the direction
    const data = {
      re: direction === 'east' ? 1 : 0,
      gn: direction === 'north' ? 1 : 0,
      ge: direction === 'south' ? 1 : 0,
      rn: direction === 'west' ? 1 : 0,
    };

    // Send the data to Firebase Realtime Database (or Firestore)
    await fetch(
      "https://ncithack-default-rtdb.asia-southeast1.firebasedatabase.app/test3.json", // Replace with your Firebase endpoint
      {
        method: "PATCH", // Use PATCH to update the specific fields
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    console.log("Direction updated successfully:", data);
  } catch (error) {
    console.error("Error sending direction to Firebase:", error);
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
  const [usn, setUsn] = useState(""); // Store 'usn' value
  const [use, setUse] = useState(""); // Store 'use' value
  const deviceLocation = { latitude: 27.7172, longitude: 85.3240 }; // Your device's coordinates

  // Fetching ambulance location and usn/use at regular intervals
  useEffect(() => {
    const fetchAmbulanceLocation = async () => {
      try {
        const response = await fetch(
          "https://ncithack-default-rtdb.asia-southeast1.firebasedatabase.app/test.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwZDg4ZGQ1NWQxYjAwZDg0ZWU4MWQwYjk2M2RlNGNkOGM0ZmFjM2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbmNpdGhhY2siLCJhdWQiOiJuY2l0aGFjayIsImF1dGhfdGltZSI6MTczNjcwNDQ4OCwidXNlcl9pZCI6IlVObUR5RjBIT1hWYUxURWNYSnpUaW1zYmp6RjMiLCJzdWIiOiJVTm1EeUYwSE9YVmFMVEVjWEp6VGltc2JqekYzIiwiaWF0IjoxNzM2NzA0NDg4LCJleHAiOjE3MzY3MDgwODgsImVtYWlsIjoicG91ZGVsbWFuaXNoMzIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJwb3VkZWxtYW5pc2gzMjFAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.QdLgaklriW_HJliHeJgiOy9VI9C2nJAM-r8vyuc0Y42mCdEMmEiRiYUVb8mSra9oniRQAXw4eMFgFBLB3TawwbHGEdHejo7XvZzMA9SRtfOJMhMKYRExMIzo-hpftVUnTLc955mx2W9v4ixZsweAr-H3KU5A5euvTQdcRokN6ASyItyxxYefn3lRYfVkPQeycrjKLX4B-3WfFRMcUnqKrDmEsiPDjM8RKEW7diC2wxNyMkiViZCVBAqVT0dbPjhEWusEGUChDsIkvjyvGACfI9rKts0O_SSI8Q9UEiIgsvj6oMcbaptar9SwdzapTAYFF4C55VSpVrfnaH7R9enQXg"
        );
        const ambulanceLocation = await response.json();
        const direction = calculateDirection(deviceLocation, ambulanceLocation);
        setAmbulanceDirection(direction);
        Alert.alert("Notification", `Ambulance detected from ${direction.toUpperCase()}`);
        handleTrafficLights(direction);

        // Send the direction to Firebase
        updateDirectionToFirebase(direction);
      } catch (error) {
        console.error("Error fetching ambulance location:", error);
      }
    };

    const fetchUsnAnduse = async () => {
      try {
        const response = await fetch(
          "https://ncithack-default-rtdb.asia-southeast1.firebasedatabase.app/test2.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwZDg4ZGQ1NWQxYjAwZDg0ZWU4MWQwYjk2M2RlNGNkOGM0ZmFjM2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbmNpdGhhY2siLCJhdWQiOiJuY2l0aGFjayIsImF1dGhfdGltZSI6MTczNjcwNDQ4OCwidXNlcl9pZCI6IlVObUR5RjBIT1hWYUxURWNYSnpUaW1zYmp6RjMiLCJzdWIiOiJVTm1EeUYwSE9YVmFMVEVjWEp6VGltc2JqekYzIiwiaWF0IjoxNzM2NzA0NDg4LCJleHAiOjE3MzY3MDgwODgsImVtYWlsIjoicG91ZGVsbWFuaXNoMzIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJwb3VkZWxtYW5pc2gzMjFAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.QdLgaklriW_HJliHeJgiOy9VI9C2nJAM-r8vyuc0Y42mCdEMmEiRiYUVb8mSra9oniRQAXw4eMFgFBLB3TawwbHGEdHejo7XvZzMA9SRtfOJMhMKYRExMIzo-hpftVUnTLc955mx2W9v4ixZsweAr-H3KU5A5euvTQdcRokN6ASyItyxxYefn3lRYfVkPQeycrjKLX4B-3WfFRMcUnqKrDmEsiPDjM8RKEW7diC2wxNyMkiViZCVBAqVT0dbPjhEWusEGUChDsIkvjyvGACfI9rKts0O_SSI8Q9UEiIgsvj6oMcbaptar9SwdzapTAYFF4C55VSpVrfnaH7R9enQXg"
        );
        const data = await response.json();
        setUsn(data.usn);
        setUse(data.use);
        console.log(data.usn);
        console.log(data.use);
      } catch (error) {
        console.error("Error fetching USN/use values:", error);
      }
    };

    // Fetch data when component mounts
    fetchAmbulanceLocation();
    fetchUsnAnduse();

    // Poll data at regular intervals
    const interval = setInterval(() => {
      fetchAmbulanceLocation();
      fetchUsnAnduse();
    }, 500000); // Poll every 5 seconds
 
    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs only once

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
          Ambulance Coming from: {ambulanceDirection ? ambulanceDirection.toUpperCase() : "N/A"}
        </Text>
        <Text style={styles.arrowText}>{getArrow(ambulanceDirection)}</Text>
      </View>

      {/* Display usn and use */}
      <View style={styles.dataContainer}>
        <Text style={styles.dataText}>USN: {usn || "N/A"}</Text>
        <Text style={styles.dataText}>USE: {use || "N/A"}</Text>
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
    alignItems: "center",
  },
  compassText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  arrowText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  dataContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    alignItems: "center",
  },
  dataText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
