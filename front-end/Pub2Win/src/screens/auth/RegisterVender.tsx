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
import { StackNavigationProp } from '@react-navigation/stack';
import { useSignUp, useAuth } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerRequest, registerSuccess, registerFailure } from '../../store/slices/authSlice';
import { useApi } from '../../hooks/useApi'; // Add this import

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  RegisterVender:undefined;
  VendorPlacement:undefined;
};

type RegisterInfluencerNavigationProp = StackNavigationProp<RootStackParamList, 'RegisterVender'>;

interface RegisterScreenProps {
  navigation: RegisterInfluencerNavigationProp;
}

const RegisterVender: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [identifier, setIdentifier] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  
  // Add these state variables for verification if they don't exist
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [showVerification, setShowVerification] = useState<boolean>(false);
  
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const { isLoaded, signUp, setActive } = useSignUp();
  const api = useApi(); // Add this line to use the API hook
  
  const handleSignUp = async () => {
    if (!isLoaded || !signUp) {
      Alert.alert('Error', 'Authentication system is not ready. Please try again.');
      return;
    }

    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'You must accept the terms and conditions');
      return;
    }

    try {
      dispatch(registerRequest());
      
      // Start the sign up process
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        username: identifier || undefined,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      // Show verification UI instead of navigating immediately
      setShowVerification(true);
      
    } catch (err: any) {
      console.error("Error signing up:", err);
      dispatch(registerFailure(err.errors?.[0]?.message || "An error occurred during sign up"));
    }
  };

  const handleVerification = async () => {
    if (!isLoaded || !signUp) {
      Alert.alert('Error', 'Authentication system is not ready. Please try again.');
      return;
    }

    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    try {
      dispatch(registerRequest());
      
      // Attempt to verify the email
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status !== "complete") {
        // Handle verification error
        throw new Error("Email verification failed");
      }

      // Set the user as active - add null check before calling setActive
      if (setActive) {
        await setActive({ session: completeSignUp.createdSessionId });
      } else {
        console.error("setActive is undefined");
        throw new Error("Authentication error: Unable to set active session");
      }
      
      // Update Redux store with user info
      if (completeSignUp.createdUserId) {
        dispatch(registerSuccess({
          id: completeSignUp.createdUserId,
          name: `${firstName} ${lastName}`,
          email: email,
          isLoggedIn: true,
        }));
        
        // Register the user in your backend using the API hook
        try {
          await api.post('/user/register', {
            userId: completeSignUp.createdUserId,
            firstName,
            lastName,
            email,
            username: identifier || undefined,
            phoneNumber: phoneNumber || undefined,
            userType: 'vendor'
          });
          
          // Navigate to vendor placement screen
          navigation.navigate('VendorPlacement');
        } catch (apiError: any) {
          console.error("Error registering with backend:", apiError);
          Alert.alert(
            "Registration Warning",
            "Your account was created but we couldn't complete your profile setup. Some features may be limited.",
            [
              { text: "OK", onPress: () => navigation.navigate('VendorPlacement') }
            ]
          );
        }
      } else {
        // Navigate to vendor placement screen as fallback
        navigation.navigate('VendorPlacement');
      }
    } catch (err: any) {
      console.error("Error verifying email:", err);
      dispatch(registerFailure(err.message || "Verification failed. Please try again."));
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

  const handleLogin = (): void => {
    navigation.navigate('Login');
  };

  const handleAddSocialMedia = () => {
    // Handle adding social media links
    console.log('Add social media links');
  };

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
            <Text style={styles.headerSubtitle}>
              Faites Exploser le chiffre d'affaire de votre entreprise avec nos abonnement premium.
            </Text>
          </View>
          
          {/* Form */}
          <View style={styles.formContainer}>
            {!showVerification ? (
              <>
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
              </>
            ) : (
              <>
                {/* Verification Code Input */}
                <Text style={styles.verificationText}>
                  Veuillez entrer le code de vérification envoyé à votre email
                </Text>
                <View style={styles.inputContainer}>
                  <Feather name="key" size={18} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputWithIcon}
                    placeholder="Code de vérification"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    editable={!loading}
                  />
                </View>
                
                {/* Verify Button */}
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
              </>
            )}
            
            {/* Error message */}
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
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
    fontFamily:"Montserrat"
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    // paddingTop: 20,
    paddingBottom: 30,
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
    // fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
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
  verificationText: {
      fontSize: 16,
      color: '#333',
      textAlign: 'center',
      marginBottom: 20,
      fontFamily: 'Montserrat',
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 15,
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

export default RegisterVender;