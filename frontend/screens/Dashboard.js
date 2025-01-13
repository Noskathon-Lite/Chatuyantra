import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../userContext'; // Import the useUser hook

const Dashboard = () => {
  const [ambulanceLocation, setAmbulanceLocation] = useState({
    latitude: 27.7172,
    longitude: 85.3240,
  });
  const { user } = useUser(); // Access user from the context
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ncithack-default-rtdb.asia-southeast1.firebasedatabase.app/test.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwZDg4ZGQ1NWQxYjAwZDg0ZWU4MWQwYjk2M2RlNGNkOGM0ZmFjM2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbmNpdGhhY2siLCJhdWQiOiJuY2l0aGFjayIsImF1dGhfdGltZSI6MTczNjcwNDQ4OCwidXNlcl9pZCI6IlVObUR5RjBIT1hWYUxURWNYSnpUaW1zYmp6RjMiLCJzdWIiOiJVTm1EeUYwSE9YVmFMVEVjWEp6VGltc2JqekYzIiwiaWF0IjoxNzM2NzA0NDg4LCJleHAiOjE3MzY3MDgwODgsImVtYWlsIjoicG91ZGVsbWFuaXNoMzIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJwb3VkZWxtYW5pc2gzMjFAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.QdLgaklriW_HJliHeJgiOy9VI9C2nJAM-r8vyuc0Y42mCdEMmEiRiYUVb8mSra9oniRQAXw4eMFgFBLB3TawwbHGEdHejo7XvZzMA9SRtfOJMhMKYRExMIzo-hpftVUnTLc955mx2W9v4ixZsweAr-H3KU5A5euvTQdcRokN6ASyItyxxYefn3lRYfVkPQeycrjKLX4B-3WfFRMcUnqKrDmEsiPDjM8RKEW7diC2wxNyMkiViZCVBAqVT0dbPjhEWusEGUChDsIkvjyvGACfI9rKts0O_SSI8Q9UEiIgsvj6oMcbaptar9SwdzapTAYFF4C55VSpVrfnaH7R9enQXg'); // Replace with your Firebase URL
        const data = await response.json();

        if (data.latitude && data.longitude) {
          setAmbulanceLocation({
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    const interval = setInterval(fetchLocation, 2000); // Fetch every 2 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <>
          <Image 
            source={{ uri: 'https://www.w3schools.com/w3images/avatar2.png' }}
            style={styles.profileImage}
          />
          <Text style={styles.hi}>Hi</Text>
          <Text style={styles.navbarText}>{user.name}</Text>
        </>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: ambulanceLocation.latitude,
          longitude: ambulanceLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={ambulanceLocation}
          title="Ambulance"
          description="Real-time tracking of the ambulance"
        >
          <Image source={require('../assets/ambulance.png')} style={styles.markerImage} />
        </Marker>
      </MapView>

      <TouchableOpacity style={styles.button} onPress={navigateToProfile}>
        <Image source={require('../assets/favicon.png')} style={styles.buttonImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 35,
  },
  navbarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
    marginLeft: 0,
    padding: 5,
  },
  hi: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 5,
    padding: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 15,
  },
  map: { flex: 1 },
  markerImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  buttonImage: { width: 40, height: 40 },
});

export default Dashboard;
