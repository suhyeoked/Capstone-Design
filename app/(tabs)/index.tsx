import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Screen/LoginScreen';
import JoinScreen from './Screen/JoinScreen';
import HomeScreen from './Screen/HomeScreen'

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={JoinScreen}
        options={{ title: '회원가입' }}
      />
       <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
    </Stack.Navigator>
  );
}
