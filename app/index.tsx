import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from './Screen/HomeScreen';
import LoginScreen from './Screen/LoginScreen';
import MainScreen from './Screen/MainScreen';
import JoinScreen from './Screen/SignUpScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
       <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: '로그인' ,
         headerStyle : {
          backgroundColor : '#3E63AC'
         } , 
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={JoinScreen}
        options={{ title: '회원가입' , 
          headerStyle : {
            backgroundColor : '#3E63AC'
           } , 
        }}
      />
       <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
    </Stack.Navigator>
  );
}
