import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { ClerkProvider } from '@clerk/clerk-expo';
import { store } from './src/store/index';
import HomeScreen from './src/screens/HomeScreen';
import AuthLoadingScreen from './src/screens/auth/AuthLoadingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import SplashScreen from './src/screens/SplashScreen';
import * as Font from 'expo-font';

// Define your Clerk publishable key
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 'your_publishable_key_here';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  AuthLoading: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Montserrat': require('./src/assets/fonts/Montserrat/static/Montserrat-Regular.ttf'),
        'Montserrat-Bold': require('./src/assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
        'Montserrat-Medium': require('./src/assets/fonts/Montserrat/static/Montserrat-Medium.ttf'),
        'Montserrat-Italic':require('./src/assets/fonts/Montserrat/static/Montserrat-Italic.ttf')
        // Add other font weights as needed
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Home" 
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </ClerkProvider>
  );
};

export default App;