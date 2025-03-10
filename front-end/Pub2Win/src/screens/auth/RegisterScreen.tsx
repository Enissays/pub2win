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
  Register: undefined;
};

// Define the navigation prop type
type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

// Define the component props
interface RegisterScreenProps {
  navigation?: RegisterScreenNavigationProp;
}

// Define the option type
type OptionType = 'influencer' | 'merchant' | null;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState<OptionType>(null);

  const handleOptionSelect = (option: OptionType): void => {
    setSelectedOption(option);
  };

  const handleConnect = (): void => {
    // Navigate to login screen
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
            selectedOption === 'influencer' && styles.selectedOption,
          ]}
          onPress={() => handleOptionSelect('influencer')}
        >
          <Text style={styles.optionText}>INFLUENCEUR</Text>
          <Feather name="send" size={20} color="#fff" style={styles.optionIcon} />
        </TouchableOpacity>
        
        {/* Merchant Option */}
        <TouchableOpacity
          style={[
            styles.optionButton,
            styles.merchantButton,
            selectedOption === 'merchant' && styles.selectedOption,
          ]}
          onPress={() => handleOptionSelect('merchant')}
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
    fontWeight: 'bold',
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
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  influencerButton: {
    backgroundColor: '#0D3B56',
    top: 0,
    left: 0,
  },
  merchantButton: {
    backgroundColor: '#00BCD4',
    bottom: 0,
    right: 0,
  },
  selectedOption: {
    borderWidth: 3,
    borderColor: '#333',
  },
  optionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: 40,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
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
    fontSize: 14,
    color: '#333',
  },
  loginLink: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;