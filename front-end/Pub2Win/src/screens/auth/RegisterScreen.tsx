import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the navigation stack param list
type RootStackParamList = {
  Login: undefined;
  Register:undefined;
  RegisterInfluencer: undefined;
  RegisterVender: undefined;
};

// Define the navigation prop type
type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

// Define the component props
interface RegisterScreenProps {
  navigation?: RegisterScreenNavigationProp;
}

// Define the option type
type OptionType = 'RegisterInfluencer' | 'RegisterVender' | null;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState<OptionType>(null);

  // const handleOptionSelect = (option: OptionType): void => {
  //   navigation?.navigate(option);
  // };

  const handleRegisterInf = ():void=>{
    if (navigation) {
      navigation.navigate('RegisterInfluencer');
    } else {
      console.log('Navigate to Register Influencer');
    }
  }
  const handleRegisterVender = ():void=>{
    if (navigation) {
      navigation.navigate('RegisterVender');
    } else {
      console.log('Navigate to Register Influencer');
    }
  }
  const handleConnect = (): void => {
    if (navigation) {
      navigation.navigate('Login');
    } else {
      console.log('Navigate to login screen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Info icon */}
      <TouchableOpacity style={styles.infoButton}>
        <Feather name="info" size={24} color="#333" />
      </TouchableOpacity>
      
      {/* Header */}
      <Text style={styles.headerText}>
        Comment souhaitez-vous nous intégrer ?
      </Text>
      
      {/* Options */}
      <View style={styles.optionsContainer}>
        {/* Influencer Option */}
        <TouchableOpacity
          style={[
            styles.optionButton,
            styles.influencerButton,
            selectedOption === 'RegisterInfluencer' && styles.selectedOption,
          ]}
          onPress={handleRegisterInf}
        >
          <Text style={styles.optionText}>INFLUENCEUR</Text>
          <Feather name="send" size={20} color="#fff" style={styles.optionIcon} />
        </TouchableOpacity>
        
        {/* Merchant Option */}
        <TouchableOpacity
          style={[
            styles.optionButton,
            styles.merchantButton,
            selectedOption === 'RegisterVender' && styles.selectedOption,
          ]}
          onPress={handleRegisterVender}
        >
          <Text style={styles.optionText}>COMMERÇANT</Text>
        </TouchableOpacity>
      </View>
      
      {/* Decorative elements */}
      <View style={styles.decorLeft}>
        <Image
          source={{ uri: 'https://i.imgur.com/placeholder.png' }}
          style={styles.decorImage}
        />
      </View>
      
      <View style={styles.decorRight}>
        <Image
          source={{ uri: 'https://i.imgur.com/placeholder.png' }}
          style={styles.decorImage}
        />
      </View>
      
      {/* Instagram info */}
      <View style={styles.infoContainer}>
        <Feather name="instagram" size={24} color="#888" style={styles.infoIcon} />
        <Text style={styles.infoText}>
          Pour créer un compte d'influenceur, vous devrez obligatoirement connecter votre compte Instagram.
        </Text>
      </View>
      
      {/* Login link */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          Avez-vous déjà un compte? {' '}
        </Text>
        <TouchableOpacity onPress={handleConnect}>
          <Text style={styles.loginLink}>Veuillez se connecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  headerText: {
    fontSize: 24,
    // fontWeight: 'bold',
    fontFamily:'Montserrat-Bold',
    textAlign: 'left',
    marginTop: 60,
    marginBottom: 40,
  },
  optionsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
    height: 300,
  },
  optionButton: {
    width: 170,
    height: 170,
    // borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  influencerButton: {
    backgroundColor: '#0D3B56',
    zIndex:2,
    borderTopLeftRadius: 80,
    borderBottomRightRadius: 80,
    top: 0,
    left: 40,
  },
  merchantButton: {
    backgroundColor: '#00BCD4',
    borderTopRightRadius: 80,
    borderBottomLeftRadius: 80,
    bottom: 0,
    right: 40,
  },
  selectedOption: {
    borderWidth: 3,
    borderColor: '#333',
  },
  optionText: {
    color: '#FFFFFF',
    fontFamily:'Montserrat',
    // fontWeight: 'bold',
    fontSize: 14,
  },
  optionIcon: {
    position: 'absolute',
    right: 30,
    bottom: 30,
  },
  decorLeft: {
    position: 'absolute',
    left: 0,
    top: '40%',
  },
  decorRight: {
    position: 'absolute',
    right: 0,
    bottom: '25%',
  },
  decorImage: {
    width: 30,
    height: 30,
  },
  infoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    // marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 30,
    marginTop: 30,
  },
  infoIcon: {
    marginRight: 10,
    alignSelf:'center'
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontFamily:'Montserrat',
    textAlign: 'center',
    flexShrink: 1,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 13,
    fontFamily:'Montserrat',
    color: '#333',
  },
  loginLink: {
    fontSize: 14,
    fontFamily:'Montserrat-Bold',
    color: '#00BCD4',
  },
});

export default RegisterScreen;