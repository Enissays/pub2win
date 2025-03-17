import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/store';
import ClerkAuthProvider from './src/utils/ClerkProvider';
import ErrorBoundary from './src/utils/ErrorBoundary';
import { StatusBar } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
// Import your screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import SplashScreen from './src/screens/SplashScreen';
import * as Font from 'expo-font';
import RegisterInfluencer from './src/screens/auth/RegisterInfluencer';
import RegisterVender from './src/screens/auth/RegisterVender';
import VendorPlacementScreen from './src/screens/auth/VendorPlacementScreen';
import InfluencerPlacementScreen from './src/screens/auth/InfluencerPlacementScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Montserrat': require('./src/assets/fonts/Montserrat/static/Montserrat-Regular.ttf'),
        'Montserrat-Bold': require('./src/assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
        'Montserrat-Medium': require('./src/assets/fonts/Montserrat/static/Montserrat-Medium.ttf'),
        'Montserrat-Italic':require('./src/assets/fonts/Montserrat/static/Montserrat-Italic.ttf')
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);
  return (
    <Provider store={store}>
      <ErrorBoundary>
      <ClerkAuthProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterInfluencer" component={RegisterInfluencer} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterVender" component={RegisterVender} options={{ headerShown: false }} />
            <Stack.Screen name="InfluencerPlacement" component={InfluencerPlacementScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ClerkAuthProvider>
      </ErrorBoundary>
    </Provider>
  );
}