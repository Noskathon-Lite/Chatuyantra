import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Screens
import LoginPage from "./screens/LoginPage";
import SignUpPage from "./screens/SignUpPage";
import VerifyOtp from "./screens/VerifyOtp";
import Dashboard from "./screens/Dashboard";
import TrafficLocation from "./screens/TrafficLocation";
import Chatbox from "./screens/Chatbox";
import Profile from "./screens/Profile";

// Context
import { UserProvider } from './userContext'; // Import the UserProvider

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  // Tab Navigator
  const RenderTabNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Traffic Location") {
            iconName = "location";
          } else if (route.name === "Dashboard") {
            iconName = "home";
          } else if (route.name === "Chatbox") {
            iconName = "chatbubble";
          } else if (route.name === "Profile") {
            iconName = "person";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <Tab.Screen name="Traffic Location" component={TrafficLocation} options={{ headerShown: false }} />
      <Tab.Screen name="Chatbox" component={Chatbox} options={{ headerShown: false }} />
      {/* <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} /> */}
      <Tab.Screen 
      name="Profile" 
      children={() => <Profile setIsLoggedIn={setIsLoggedIn} />} // Pass setIsLoggedIn as a prop
      options={{ headerShown: false }} 
    />
    </Tab.Navigator>
  );

  return (
    <UserProvider>
      <NavigationContainer>
        
        <Stack.Navigator>
        {isLoggedIn ? (
          <>
           {/* Main App (Tab Navigator) */}
           <Stack.Screen
            name="Main"
            component={RenderTabNavigator}
            options={{ headerShown: false }}
          />
          </>
          ) : (
            <>
          {/* Login Screen */}
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {(props) => <LoginPage {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>

          {/* Sign-Up Screen */}
          <Stack.Screen
            name="SignUp"
            component={SignUpPage}
            options={{ headerShown: true, title: "Sign Up" }}
          />

          {/* Verify OTP Screen */}
          <Stack.Screen
            name="VerifyOtp"
            component={VerifyOtp}
            options={{ headerShown: true, title: "Verify OTP" }}
          />
          
          </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}