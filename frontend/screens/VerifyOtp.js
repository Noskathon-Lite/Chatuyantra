import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const VerifyOtp = ({ navigation, route }) => {
  const [otp, setOtp] = useState('');

  useEffect(() => {
    // Log the route params to ensure email is passed correctly
    console.log('Route params:', route);
  }, [route]);

  // Safely access email from route.params
  const email = route?.params?.email; 

  if (!email) {
    Alert.alert('Error', 'No email found. Please navigate correctly.');
    return null; // Prevent further execution if no email is found
  }

  const handleOtpSubmit = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
      // Sending the OTP and email to the backend
      const response = await axios.patch(
        'https://723a-110-44-118-28.ngrok-free.app/auth/verify-otp',
        {
          email, // Send the email
          providedCode: otp, // OTP is sent as 'providedCode'
        },
      );

      if (response.status === 200 && response.data.success) {
        console.log(response.data);
        Alert.alert('Success', 'OTP verified successfully');

        // Redirect to Login page upon successful OTP verification
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', 'Invalid OTP');
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'An error occurred. Please try again.');
      } else {
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      {/* OTP Label and Input */}
      <Text style={styles.label}>OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6} // Assuming OTP is 6 digits
      />

      {/* Verify OTP Button */}
      <TouchableOpacity style={styles.button} onPress={handleOtpSubmit} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerifyOtp;
