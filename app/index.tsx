import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Provider } from 'react-redux';
import CalendarsScreen from './Screen/CalendarsScreen';
import GoalSetupWizard from './Screen/GoalSetupWizard';
import LoginScreen from './Screen/LoginScreen';
import MainScreen from './Screen/MainScreen';
import JoinScreen from './Screen/SignUpScreen';
import store from './src/store';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Provider store={store}>
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
            component={CalendarsScreen}
            options={{ headerShown: false }}
          />
        <Stack.Screen
            name="GoalSetupWizard"
            component={GoalSetupWizard}
            options={{ headerShown: false }}
          />
      </Stack.Navigator>

    </Provider>
  );
}
