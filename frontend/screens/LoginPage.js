import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import axios from "axios";
import { useUser } from '../userContext'; // Import the useUser hook

const LoginPage = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const { setUser } = useUser(); // Access setUser from the context

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(
        "https://723a-110-44-118-28.ngrok-free.app/api/auth/login",
        { email, password }
      );

      if (response.status === 200 && response.data.success) {
        const userData = response.data.user; // Extract user object
        console.log(userData);
        if (userData) {
          // Store user data in the global context
          setUser(userData);

          // Log the user data to the console
          console.log("User Information:", userData);

          Alert.alert("Success", "Login successful!");
        
          // Navigate to TabNavigator and reset the stack
          // navigation.navigate("Main");

          setIsLoggedIn(true); // Set logged-in status
        } else {
          console.error("User data not found in response:", response.data);
        }
      } else {
        Alert.alert("Error", response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to connect to the server. Please try again later.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Login</Text>

        {/* Email Input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.signUpButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Link to SignUp */}
        <Text style={styles.switchText} onPress={() => navigation.navigate("SignUp")}>
          Don't have an account? Sign Up.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
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

export default LoginPage;
