import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSignIn, useAuth, useOAuth, useUser } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginRequest, loginSuccess, loginFailure } from '../../store/slices/authSlice';

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

// Define the navigation prop type
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

// Define the component props
interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [stayConnected, setStayConnected] = useState<boolean>(false);
  
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });

  // Handle email/password sign in
  const handleEmailSignIn = async () => {
    if (!isLoaded) {
      return;
    }

    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      dispatch(loginRequest());
      
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // Set the user as active
        await setActive({ session: result.createdSessionId });
        
        // Update Redux store with user info
        // We need to wait for the user object to be available after sign-in
        if (userId && user) {
          dispatch(loginSuccess({
            id: userId,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.primaryEmailAddress?.emailAddress || '',
            isLoggedIn: true,
          }));
        }
        
        // Navigate to home
        navigation.replace('Home');
      } else {
        // Handle 2FA or other verification steps if needed
        console.log("Additional verification needed:", result);
        Alert.alert(
          "Verification Required",
          "Please complete the additional verification steps."
        );
      }
    } catch (err: any) {
      console.error("Error signing in:", err);
      dispatch(loginFailure(err.errors?.[0]?.message || "An error occurred during sign in"));
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      dispatch(loginRequest());
      
      const result = await googleAuth();
      
      if (result?.createdSessionId && result?.setActive) {
        await result.setActive({ session: result.createdSessionId });
        navigation.replace('Home');
      } else {
        throw new Error('Apple sign in failed - missing session data');
      }
    } catch (err: any) {
      console.error("Error with Apple sign in:", err);
      dispatch(loginFailure("Apple sign in failed"));
    }
  };

  // Handle Apple sign in
  const handleAppleSignIn = async () => {
    try {
      dispatch(loginRequest());
      
      const result = await appleAuth();
      
      if (result?.createdSessionId && result?.setActive) {
        await result.setActive({ session: result.createdSessionId });
        navigation.replace('Home');
      } else {
        throw new Error('Apple sign in failed - missing session data');
      }
    } catch (err: any) {
      console.error("Error with Apple sign in:", err);
      dispatch(loginFailure("Apple sign in failed"));
    }
  };

  const handleRegister = (): void => {
    navigation.navigate('Register');
  };

  // Rest of the component remains the same
  return (
    // ... existing JSX
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Top curved section with background */}
          <View style={styles.topSection}>
            <Text style={styles.greeting}>Salut !</Text>
            <Text style={styles.welcomeBack}>Bon retour</Text>
            
            {/* Person image */}
            <Image
              source={{ uri: 'https://i.imgur.com/placeholder.png' }}
              style={styles.personImage}
              resizeMode="contain"
            />
            
            {/* P2 Logo */}
            <Text style={styles.logo}>P2W</Text>
          </View>
          
          {/* Login form section */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>
              Connectez-vous pour bénéficier de nouveaux offres
            </Text>
            
            {/* Email input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Identifiant/email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
            
            {/* Password input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>
            
            {/* Error message */}
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            {/* Stay connected checkbox */}
            {/* <View style={styles.checkboxContainer}>
              <CheckBox
                value={stayConnected}
                onValueChange={setStayConnected}
                tintColors={{ true: '#0D3B56', false: '#CCCCCC' }}
                style={styles.checkbox}
                disabled={loading}
              />
              <Text style={styles.checkboxLabel}>Restez connecté</Text>
            </View> */}
            
            {/* Login button */}
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleEmailSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Se connecter</Text>
              )}
            </TouchableOpacity>
            
            {/* Social login options */}
            <View style={styles.socialLoginContainer}>
              <Text style={styles.socialLoginText}>Ou connectez-vous avec</Text>
              
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={handleGoogleSignIn}
                  disabled={loading}
                >
                  <Feather name="user" size={20} color="#0D3B56" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={handleAppleSignIn}
                  disabled={loading}
                >
                  <Feather name="user" size={20} color="#0D3B56" />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Forgot password */}
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
            
            {/* Sign up */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Voulez-vous créer un nouveau compte ?{' '}
              </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.signupLink}>S'inscrire</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  // ... (same styles as before)
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    fontFamily:'Montserrat'
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topSection: {
    height: 280,
    backgroundColor: '#0D3B56',
    borderBottomRightRadius: 100,
    paddingTop: 20,
    paddingLeft: 20,
    position: 'relative',
  },
  greeting: {
    color: '#FFFFFF',
    fontFamily:'Montserrat',
    fontSize: 18,
    fontWeight: '400',
  },
  welcomeBack: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily:'Montserrat-Bold',
    marginTop: 5,
  },
  personImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 200,
    height: 200,
  },
  logo: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  formTitle: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#666666',
  },
  loginButton: {
    backgroundColor: '#0D3B56',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  socialLoginContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  socialLoginText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#666666',
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signupText: {
    color: '#333333',
    fontSize: 14,
  },
  signupLink: {
    color: '#0D3B56',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;