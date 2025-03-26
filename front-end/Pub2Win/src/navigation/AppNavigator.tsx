import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';

// Import your screens here
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import VendorDashboard from '../screens/vendor/VendorDashboard';
import VendorProfile from '../screens/vendor/VendorProfile';
import VendorPlace from '../screens/vendor/VendorPlace';
// import VendorSettings from '../screens/vendor/VendorSettings';
// import VendorNotifications from '../screens/vendor/VendorNotifications';
// import VendorHelp from '../screens/vendor/VendorHelp';
import Chat from '../screens/vendor/Chat';
// import CreateEndroit from '../screens/vendor/CreateEndroit';
// import BankingSetup from '../screens/vendor/BankingSetup';
import RegisterInfluencer from '../screens/auth/RegisterInfluencer';
import RegisterVender from '../screens/auth/RegisterVender';
import VendorPlacementScreen from '../screens/auth/VendorPlacementScreen';
import Search from '../screens/influencer/Search';
import Wallet from '../screens/influencer/Wallet';
import PartnerDetails from '../screens/influencer/PartnerDetails';
import InfluencerDashboard from '../screens/influencer/InfluencerDashboard';
import InfluencerPlacementScreen from '../screens/auth/InfluencerPlacementScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  RegisterInfluencer: undefined;
  RegisterVender: undefined;
  InfluencerPlacement: undefined;
  VendorPlacement: undefined;
  Home: undefined;
  VendorDashboard: undefined;
  VendorProfile: undefined;
  VendorPlace: undefined;
  VendorSettings: undefined;
  VendorNotifications: undefined;
  VendorHelp: undefined;
  Chat: undefined;
  CreateEndroit: undefined;
  BankingSetup: undefined;
  Search: undefined;
  Wallet: undefined;
  PartnerDetails: { partnerId: string };
  InfluencerDashboard: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { token, userType } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        {!token ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="RegisterInfluencer" component={RegisterInfluencer} />
            <Stack.Screen name="RegisterVender" component={RegisterVender} />
            <Stack.Screen name="VendorPlacement" component={VendorPlacementScreen} />
            <Stack.Screen name="InfluencerPlacement" component={InfluencerPlacementScreen} />
          </>
        ) : (
          // App Stack - Conditionally render based on user type
          <>
            {userType === 'vendor' ? (
              // Vendor Screens
              <>
                <Stack.Screen name="VendorDashboard" component={VendorDashboard} />
                <Stack.Screen name="VendorProfile" component={VendorProfile} />
                <Stack.Screen name="VendorPlace" component={VendorPlace} />
                <Stack.Screen name="Chat" component={Chat}/>
                {/* <Stack.Screen name="VendorSettings" component={VendorSettings} />
                <Stack.Screen name="VendorNotifications" component={VendorNotifications} />
                <Stack.Screen name="VendorHelp" component={VendorHelp} />
                <Stack.Screen name="CreateEndroit" component={CreateEndroit} />
                <Stack.Screen name="BankingSetup" component={BankingSetup} /> */}
              </>
            ) : (
              // Influencer Screens
              <>
                <Stack.Screen name="InfluencerDashboard" component={InfluencerDashboard} />
                <Stack.Screen name="Search" component={Search} />
                <Stack.Screen name="Wallet" component={Wallet} />
                <Stack.Screen name="PartnerDetails" component={PartnerDetails} />
              </>
            )}
            {/* Common screens for both user types */}
            <Stack.Screen name="Chat" component={Chat} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;