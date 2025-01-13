import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Text } from "react-native-paper"; // Text component for labels
import axios from "axios"; // Import axios for making API calls

const SignUpPage = ({ navigation, setIsLoggedIn }) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      // Step 1: Sign up the user
      const response = await axios.post(
        "https://723a-110-44-118-28.ngrok-free.app/api/auth/signup",
        { fullName, phone, email, password }
      );

      if (response.status === 201 && response.data.success) {
        Alert.alert("Success", `Sign-up successful for: ${email}`);

        // Step 2: Send OTP request after successful sign-up using PATCH request
        const otpResponse = await axios.patch(
          "https://cf48-2405-acc0-1307-2b25-00-5.ngrok-free.app/api/auth/send-otp",
          { email }
        );

        if (otpResponse.status === 200) {
          // Redirect to VerifyOtp page after successful OTP request
          console.log("Navigating with email:", email);
          navigation.navigate("VerifyOtp", { email });
        } else {
          Alert.alert("Error", "Failed to send OTP.");
        }
      } else {
        Alert.alert("Error", response.data.message || "An error occurred.");
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        Alert.alert("Error", error.response.data.message || "An error occurred. Please try again.");
      } else {
        Alert.alert("Error", "An error occurred. Please try again.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Sign Up</Text>

        {/* Full Name Label and Input */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Phone Number Label and Input */}
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Email Label and Input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Label and Input */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Confirm Password Label and Input */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} activeOpacity={0.8}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Link to Login */}
        <Text style={styles.switchText} onPress={() => navigation.navigate("Login")}>
          Already have an account? Login
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  signUpButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  signUpButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchText: {
    marginTop: 10,
    color: "blue",
    textAlign: "center",
  },
});

export default SignUpPage;
