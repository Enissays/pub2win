import React, { useEffect, useState } from 'react';
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
  Linking,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSignUp, useAuth } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerRequest, registerSuccess, registerFailure } from '../../store/slices/authSlice';
import { useApi } from '../../hooks/useApi'; // Import useApi hook
// import { EXPO_PUBLIC_INSTAGRAM_APP_ID, EXPO_PUBLIC_INSTAGRAM_REDIRECT_URI } from '@env';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  RegisterInfluencer:undefined;
  InfluencerPlacement:undefined;
};

type RegisterInfluencerNavigationProp = StackNavigationProp<RootStackParamList, 'RegisterInfluencer'>;

interface RegisterScreenProps {
  navigation: RegisterInfluencerNavigationProp;
}

const RegisterInfluencer: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [identifier, setIdentifier] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [showVerification, setShowVerification] = useState<boolean>(false);
  
  const [clerkReady, setClerkReady] = useState<boolean>(false);
  const { isLoaded: authLoaded } = useAuth();

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const { isLoaded, signUp, setActive } = useSignUp();
  const api = useApi();
  
  useEffect(() => {
    if (!authLoaded) {
      console.log('Clerk authentication is still loading...');
      setClerkReady(false);
    } else {
      console.log('Clerk authentication is ready');
      setClerkReady(true);
    }
  }, [authLoaded]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!clerkReady && isLoaded) {
        setClerkReady(true);
      }
    }, 2000); // 2 second delay
    
    return () => clearTimeout(timer);
  }, [clerkReady, isLoaded]);
  
  const handleSignUp = async () => {
    if (!authLoaded || !signUp) {
      Alert.alert('Error', 'Authentication system is initializing');
      return;
    }
  
    if (!firstName || !lastName || !email || !password || !acceptTerms) {
      Alert.alert('Error', 'Please fill all required fields and accept terms');
      return;
    }
  
    try {
      dispatch(registerRequest());
      
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        username: identifier,
      });
  
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      setShowVerification(true);
      
    } catch (err: any) {
      console.error("Sign up error:", err);
      dispatch(registerFailure(err.errors?.[0]?.message || "Registration failed"));
    }
  };

  const handleLogin = (): void => {
    navigation.navigate('Login');
  };

  const handleAddSocialMedia = () => {
    // Get the Instagram authentication URL
    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.EXPO_PUBLIC_INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(process.env.EXPO_PUBLIC_INSTAGRAM_REDIRECT_URI)}&scope=user_profile,user_media&response_type=code&state=${identifier}`;
    
    // Open the Instagram authentication URL in a web browser
    Linking.openURL(instagramAuthUrl)
      .catch(err => {
        console.error('Error opening Instagram auth URL:', err);
        Alert.alert('Error', 'Unable to open Instagram authentication page');
      });
  };

  const handleVerification = async () => {
    if (!isLoaded || !signUp || !verificationCode) {
      Alert.alert('Error', 'Please enter verification code');
      return;
    }
  
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
  
      if (completeSignUp.status !== "complete") {
        throw new Error("Verification failed");
      }
  
      await setActive({ session: completeSignUp.createdSessionId });
      
      const clerkUserId = completeSignUp.createdUserId;
      if (!clerkUserId) throw new Error('No user ID returned');
      
      try {
        await api.post('/user/register', {
          clerkUserId,
          firstName,
          lastName,
          email,
          username: identifier,
          phoneNumber,
          role: 'INFLUENCER', 
          isInfluencer: true
        });
        
        dispatch(registerSuccess({
          id: clerkUserId,
          name: `${firstName} ${lastName}`,
          email,
          role: 'INFLUENCER',
          isLoggedIn: true
        }));
        
        navigation.navigate('InfluencerPlacement');
        
      } catch (apiError) {
        console.error("Backend registration error:", apiError);
        Alert.alert(
          "Warning", 
          "Account created but profile setup incomplete. Please complete your profile.",
          [{ text: "OK", onPress: () => navigation.navigate('InfluencerPlacement') }]
        );
      }
      
    } catch (err: any) {
      console.error("Verification error:", err);
      dispatch(registerFailure(err.message || "Verification failed"));
    }
  };

  // Add verification UI rendering
  if (showVerification) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/logo2.png')}
                style={styles.logo}
                resizeMode='contain'
              />
            </View>
            
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Vérifiez votre email</Text>
              <Text style={styles.headerSubtitle}>
                Nous avons envoyé un code de vérification à {email}. Veuillez entrer ce code ci-dessous.
              </Text>
            </View>
            
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Code de vérification"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                  editable={!loading}
                />
              </View>
              
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
              
              <TouchableOpacity 
                style={styles.registerButton}
                onPress={handleVerification}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.registerButtonText}>Vérifier</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo2.png')}
              style={styles.logo}
              resizeMode='contain'
            />
          </View>
          
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Rejoignez Notre Communauté Exclusive !</Text>
          </View>
          
          {/* Form */}
          <View style={styles.formContainer}>
            {/* First Name */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Prénom*"
                value={firstName}
                onChangeText={setFirstName}
                editable={!loading}
              />
            </View>
            
            {/* Last Name */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nom*"
                value={lastName}
                onChangeText={setLastName}
                editable={!loading}
              />
            </View>
            
            {/* Identifier */}
            <View style={styles.inputContainer}>
              <Feather name="user" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Identifiant*"
                value={identifier}
                onChangeText={setIdentifier}
                editable={!loading}
              />
            </View>
            
            {/* Email */}
            <View style={styles.inputContainer}>
              <Feather name="mail" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Email*"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
            
            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <Feather name="phone" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Numéro de téléphone*"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>
            
            {/* Password */}
            <View style={styles.inputContainer}>
              <Feather name="lock" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>
            
            {/* Social Media Links */}
            <TouchableOpacity 
              style={styles.socialMediaButton}
              onPress={handleAddSocialMedia}
            >
              <Text style={styles.socialMediaButtonText}>
                Ajoutez les liens vers vos réseaux sociaux
              </Text>
              <Feather name="plus-circle" size={20} color="#00BCD4" />
            </TouchableOpacity>
            
            {/* Error message */}
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <TouchableOpacity 
                style={[
                  styles.checkbox, 
                  acceptTerms ? styles.checkboxChecked : {}
                ]}
                onPress={() => setAcceptTerms(!acceptTerms)}
                disabled={loading}
              >
                {acceptTerms && <Feather name="check" size={14} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                J'accepte les <Text style={styles.termsLink}>politiques</Text> et <Text style={styles.termsLink}>conditions d'utilisations</Text>
              </Text>
            </View>
            
            {/* Register Button */}
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>S'inscrire</Text>
              )}
            </TouchableOpacity>
            
            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Avez-vous déjà un compte ? {' '}
              </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Veuillez se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 120,
    height: 60,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Montserrat',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Montserrat',
  },
  formContainer: {
    // backgroundColor: '#FFFFFF',
    // borderRadius: 10,
    // padding: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 2,
  },
  inputContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  inputIcon: {
    marginLeft: 15,
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  socialMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  socialMediaButtonText: {
    color: '#00BCD4',
    fontSize: 14,
    marginRight: 10,
    fontFamily: 'Montserrat',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'Montserrat',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00BCD4',
    borderColor: '#00BCD4',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  termsLink: {
    color: '#00BCD4',
    textDecorationLine: 'underline',
  },
  registerButton: {
    backgroundColor: '#0D3B56',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    // marginBottom: 20,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#333333',
    fontSize: 14,
    fontFamily: 'Montserrat',
  },
  loginLink: {
    color: '#00BCD4',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});

export default RegisterInfluencer;