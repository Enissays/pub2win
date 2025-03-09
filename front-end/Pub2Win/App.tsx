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

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  AuthLoading: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Replace with your actual Clerk publishable key
const CLERK_PUBLISHABLE_KEY = 'your_clerk_publishable_key';

// OAuth callback
WebBrowser.maybeCompleteAuthSession();

const AuthenticatedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
);

const UnauthenticatedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ClerkProvider 
        publishableKey={CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="AuthLoading" 
            screenOptions={{ headerShown: false }}
          >
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