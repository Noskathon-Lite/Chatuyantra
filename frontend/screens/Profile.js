import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUser } from '../userContext'; // Import the useUser hook

const Profile = ({ setIsLoggedIn }) => {
  const { user,logout } = useUser(); // Access user data from the context
  const navigation = useNavigation(); // Navigation hook

  const handleLogout = async () => {
    try {
      // Handle logout functionality here

      // Navigate to the Login screen
      // navigation.replace('Login');
      logout(); 
      setIsLoggedIn(false); // Log out the user
      // navigation.navigate('Login');
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.detailValue}>User data not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Information Title */}
      <Text style={styles.profileTitle}>Profile Information</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailLabel}>Name:</Text>
        <Text style={styles.detailValue}>{user.name} </Text>

        <Text style={styles.detailLabel}>Email:</Text>
        <Text style={styles.detailValue}>{user.email}</Text>

        <Text style={styles.detailLabel}>Phone:</Text>
        <Text style={styles.detailValue}>{user.phone}</Text>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    padding: 20,
    marginTop: 45,
  },
  profileTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10, // Space between title and details section
    textAlign: 'center', // Center align the title
  },
  detailsContainer: {
    backgroundColor: "#2c2c2c",
    borderRadius: 10,
    padding: 20,
    marginTop: 50,
  },
  detailLabel: {
    fontSize: 16,
    color: "#888",
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: "#FF5C5C", // Red background
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
