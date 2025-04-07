import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

// Import your screen components
import VendorDashboard from '../screens/vendor/VendorDashboard';
import VendorProfile from '../screens/vendor/VendorProfile';
import VendorPlace from '../screens/vendor/VendorPlace';
import Chat from '../screens/vendor/Chat';

// Create a type for your Tab Navigator
type VendorTabParamList = {
  VendorDashboard: undefined;
  VendorProfile: undefined;
  Chat: undefined;
  VendorPlace: undefined;
};

// Create the Tab Navigator
const Tab = createBottomTabNavigator<VendorTabParamList>();

const VendorTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';

          switch (route.name) {
            case 'VendorDashboard':
              iconName = 'home';
              break;
            case 'VendorProfile':
              iconName = 'user';
              break;
            case 'VendorPlace':
              iconName = 'map-pin';
              break;
            case 'Chat':
              iconName = 'message-square';
              break;
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#003049',
        tabBarInactiveTintColor: '#AAAAAA',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          paddingBottom: 12,
          borderTopColor: '#EEEEEE',
        },
        tabBarLabelStyle: {
          fontFamily: 'Montserrat-Bold',
          fontSize: 10,
          paddingBottom:12,
          // margin:12,
          // borderBottomWidth: 2,
        },
      })}
    >
      <Tab.Screen 
        name="VendorDashboard" 
        component={VendorDashboard} 
        options={{ 
          title: 'Accueil',
        }} 
      />
      <Tab.Screen 
        name="Chat" 
        component={Chat} 
        options={{ 
          title: 'Chat',
        }} 
      />
      <Tab.Screen 
        name="VendorPlace" 
        component={VendorPlace} 
        options={{ 
          title: 'My place',
        }} 
      />
      <Tab.Screen 
        name="VendorProfile" 
        component={VendorProfile} 
        options={{ 
          title: 'Profile',
        }} 
      />
    </Tab.Navigator>
  );
};

export default VendorTabNavigator;
