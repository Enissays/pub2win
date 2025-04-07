// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RegisterInfluencer from '../screens/auth/RegisterInfluencer';
import RegisterVender from '../screens/auth/RegisterVender';
import VendorPlacementScreen from '../screens/auth/VendorPlacementScreen';
import InfluencerPlacementScreen from '../screens/auth/InfluencerPlacementScreen';
import PartnerDetails from '../screens/influencer/PartnerDetails';

// Import tab navigators
import InfluencerTabNavigator from '../navigation/InfluencerTabNavigatorx';
import VendorTabNavigator from '../navigation/VendorTabNavigator'; // You'll need to create this
import AuthLoadingScreen from '../screens/auth/AuthLoadingScreen';
import InfluencerDashboard from '../screens/influencer/InfluencerDashboard';
import InfluencerNotifications from '../screens/influencer/InfluencerNotifications';
import InfluencerHelp from '../screens/influencer/InfluencerHelp';
import InfluencerSettings from '../screens/influencer/InfluencerSettings';
import CreateEndroit from '../screens/vendor/CreateEndroit';
import EditEndroit from '../screens/vendor/EditEndroit';

// Add to your RootStackParamList
type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  AuthLoading: undefined;
  InfluencerApp: undefined;
  VendorApp: undefined;
  PartnerDetails: { partnerId: string };
  InfluencerDashboard:undefined;
  InfluencerNotifications:undefined;
  InfluencerHelp:undefined;
  InfluencerSettings:undefined;
  CreateEndroit:undefined;
  EditEndroit:undefined;
};

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  RegisterInfluencer: undefined;
  RegisterVender: undefined;
  VendorPlacement: undefined;
  InfluencerPlacement: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

// Auth navigator component
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="RegisterInfluencer" component={RegisterInfluencer} />
      <AuthStack.Screen name="RegisterVender" component={RegisterVender} />
      <AuthStack.Screen name="VendorPlacement" component={VendorPlacementScreen} />
      <AuthStack.Screen name="InfluencerPlacement" component={InfluencerPlacementScreen} />
    </AuthStack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  // Comment out or remove the useSelector line since we won't use auth state
  // const { token, userType } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Directly show the influencer app for development */}
        <RootStack.Screen name="InfluencerApp" component={InfluencerTabNavigator} />
        <RootStack.Screen name="PartnerDetails" component={PartnerDetails} />
        <RootStack.Screen name="InfluencerNotifications" component={InfluencerNotifications} />
        <RootStack.Screen name="InfluencerHelp" component={InfluencerHelp} />
        <RootStack.Screen name="InfluencerSettings" component={InfluencerSettings} />
        <RootStack.Screen name="CreateEndroit" component={CreateEndroit} />
        <RootStack.Screen name="EditEndroit" component={EditEndroit} />
        
        {/* Keep other screens commented out for now */}
        {/* 
        {!token ? (
          // Unauthenticated flow
          <>
            <RootStack.Screen name="Auth" component={AuthNavigator} />
            <RootStack.Screen name="AuthLoading" component={AuthLoadingScreen}/>
          </>
        ) : (
          // Authenticated flow
          <>
            {userType === 'vendor' ? (
              <RootStack.Screen name="VendorApp" component={VendorTabNavigator} />
            ) : (
              <RootStack.Screen name="InfluencerApp" component={InfluencerTabNavigator} />
            )}
            <RootStack.Screen name="PartnerDetails" component={PartnerDetails} />
          </>
        )}
        */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
