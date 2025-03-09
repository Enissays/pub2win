import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import store from './src/store/index';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import { tokenCache } from './src/store/clerk/clerk';
import AuthLoadingScreen from './src/screens/auth/AuthLoadingScreen';
import SplashScreen from './src/screens/SplashScreen';

type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  AuthLoading: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Replace with your actual Clerk publishable key
const CLERK_PUBLISHABLE_KEY = 'pk_test_YWN0aXZlLWNvbGxpZS0zNi5jbGVyay5hY2NvdW50cy5kZXYk'; // Replace with your actual key

// OAuth callback
WebBrowser.maybeCompleteAuthSession();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ClerkProvider 
        publishableKey={CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Splash" 
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ClerkProvider>
    </Provider>
  );
};

export default App;