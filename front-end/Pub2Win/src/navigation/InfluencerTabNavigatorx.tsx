import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

// Import your screen components
import InfluencerDashboard from '../screens/influencer/InfluencerDashboard';
import SearchScreen from '../screens/influencer/Search';
import ChatScreen from '../screens/vendor/Chat';
import WalletScreen from '../screens/influencer/Wallet';

// Create a type for your Tab Navigator
type RootTabParamList = {
  InfluencerDashboard: undefined;
  Search: undefined;
  Chat: undefined;
  Wallet: undefined;
};

// Create the Tab Navigator
const Tab = createBottomTabNavigator<RootTabParamList>();

const InfluencerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';

          switch (route.name) {
            case 'InfluencerDashboard':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Chat':
              iconName = 'message-square';
              break;
            case 'Wallet':
              iconName = 'credit-card';
              break;
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#003049',
        tabBarInactiveTintColor: '#AAAAAA',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
        },
        tabBarLabelStyle: {
          fontFamily: 'Montserrat',
          fontSize: 12,
        },
        headerShown: false, // Hide the default header
      })}
    >
      <Tab.Screen 
        name="InfluencerDashboard" 
        component={InfluencerDashboard} 
        options={{ 
          title: 'Accueil',
        }} 
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ 
          title: 'Recherche',
        }} 
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ 
          title: 'Chat',
          tabBarStyle: { display: 'none' }, // Hide bottom tab for Chat screen
        }} 
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen} 
        options={{ 
          title: 'Mon solde',
        }} 
      />
    </Tab.Navigator>
  );
};

export default InfluencerTabNavigator;