import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  AuthLoading: undefined;
};

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AuthLoading'>;

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    // Navigate to the main screen after a delay
    const timer = setTimeout(() => {
      navigation.replace('AuthLoading');
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>P2</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    borderRadius: Platform.OS === 'ios' ? 20 : 0,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  background: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    top: '-50%',
    left: '-50%',
    backgroundColor: '#F9F9F9',
    transform: [{ rotate: '89.912deg' }],
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#0D3B56',
    fontStyle: 'italic',
  },
});

export default SplashScreen;