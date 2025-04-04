import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch } from '../../store/hooks';
import { loginSuccess } from '../../store/slices/authSlice';
import { useApi } from '../../hooks/useApi';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  AuthLoading: undefined;
};

type AuthLoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AuthLoading'>;

interface AuthLoadingScreenProps {
  navigation: AuthLoadingScreenNavigationProp;
}

const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({ navigation }) => {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const dispatch = useAppDispatch();
  const api = useApi();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoaded || !isUserLoaded) return;

      if (isSignedIn && userId && user) {
        try {
          // Verify connection to backend
          await api.get('/'); // or any endpoint that verifies the token
          
          // Update Redux store with user info
          dispatch(loginSuccess({
            id: userId,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.primaryEmailAddress?.emailAddress || '',
            isLoggedIn: true,
          }));
          navigation.replace('Home');
        } catch (error) {
          console.error("Backend connection error:", error);
          // Handle backend connection error
          Alert.alert(
            "Connection Error",
            "Could not connect to the server. Please try again later."
          );
        }
      } else {
        navigation.replace('Login');
      }
    };

    checkAuth();
  }, [isLoaded, isUserLoaded, isSignedIn, userId, user, navigation, dispatch]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00BCD4" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default AuthLoadingScreen;