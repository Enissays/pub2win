import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  InfluencerDashboard: undefined;
  Search: undefined;
  Chat: undefined;
  Wallet: undefined;
};

type BottomNavigationProps = {
  activeScreen: 'home' | 'search' | 'chat' | 'wallet';
};

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeScreen }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleNavigation = (screen: string) => {
    switch(screen) {
      case 'home':
        navigation.navigate('InfluencerDashboard');
        break;
      case 'search':
        navigation.navigate('Search');
        break;
      case 'chat':
        navigation.navigate('Chat');
        break;
      case 'wallet':
        navigation.navigate('Wallet');
        break;
    }
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNavigation('home')}
      >
        <Feather 
          name="home" 
          size={24} 
          color={activeScreen === 'home' ? '#003049' : '#AAAAAA'} 
        />
        <Text style={[
          styles.navText, 
          activeScreen === 'home' && styles.navTextActive
        ]}>
          Accueil
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => handleNavigation('search')}
      >
        <Feather 
          name="search" 
          size={24} 
          color={activeScreen === 'search' ? '#003049' : '#AAAAAA'} 
        />
        <Text style={[
          styles.navText, 
          activeScreen === 'search' && styles.navTextActive
        ]}>
          Recherche
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNavigation('chat')}
      >
        <Feather 
          name="message-square" 
          size={24} 
          color={activeScreen === 'chat' ? '#003049' : '#AAAAAA'} 
        />
        <Text style={[
          styles.navText, 
          activeScreen === 'chat' && styles.navTextActive
        ]}>
          Chat
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNavigation('wallet')}
      >
        <Feather 
          name="credit-card" 
          size={24} 
          color={activeScreen === 'wallet' ? '#003049' : '#AAAAAA'} 
        />
        <Text style={[
          styles.navText, 
          activeScreen === 'wallet' && styles.navTextActive
        ]}>
          Mon solde
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
  },
  navTextActive: {
    color: '#003049',
    fontFamily: 'Montserrat-Medium',
  },
});

export default BottomNavigation;