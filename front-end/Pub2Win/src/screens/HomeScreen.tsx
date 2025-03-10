import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchInfluencers } from '../store/slices/influencerSlice';
// import { useAuth } from '@clerk/clerk-expo';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

// Define the navigation prop type
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Define the component props
interface HomeScreenProps {
  navigation?: HomeScreenNavigationProp;
}

// Define the pricing tier type
interface PricingTier {
  id: string;
  name: string;
  color: string;
}

const pricingTiers: PricingTier[] = [
  { id: '1', name: 'Omega\npremium', color: '#E0F7FA' },
  { id: '2', name: 'Alpha\npremium', color: '#B2EBF2' },
  { id: '3', name: 'Beta\npremium', color: '#80DEEA' },
  { id: '4', name: 'Delta\npremium', color: '#4DD0E1' },
];

// Sample partner logos
const partnerLogos = [
  { id: '1', name: 'King Marcel', uri: 'https://i.imgur.com/placeholder1.png' },
  { id: '2', name: 'Olim', uri: 'https://i.imgur.com/placeholder2.png' },
  { id: '3', name: 'Hippopotamus', uri: 'https://i.imgur.com/placeholder3.png' },
  { id: '4', name: 'Aya', uri: 'https://i.imgur.com/placeholder4.png' },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items: influencers, loading, error } = useAppSelector(state => state.influencer);
  const { user } = useAppSelector(state => state.auth);
  // const { isSignedIn } = useAuth();

  useEffect(() => {
    // Fetch influencers when component mounts
    dispatch(fetchInfluencers());
  }, [dispatch]);

  const handleLogin = () => {
    navigation?.navigate('Login');
  };

  const handleDiscover = () => {
    navigation?.navigate('Register')
    console.log('Discover pressed');
  };

  // Rest of the component remains the same
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={() => dispatch(fetchInfluencers())}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get the first influencer from the list
  const topInfluencer = influencers.length > 0 ? influencers[0] : {
    name: 'Martin Legrand',
    imageUrl: 'https://i.imgur.com/placeholder.png',
    followers: 100000,
    description: 'Lorem ipsum dolor sit amet consectetur. Quam nisi tincidunt iaculis id amet et tristique et. Volutpat auctor et etiam elementum pulvinar. Curabitur egestas nec proin faucibus elementum sit tortor.'
  };

  return (
    <View style={styles.mainContainer}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#F0F0F0', '#F9F9F9']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.backgroundGradient}
      />
      
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <Text style={styles.headerText}>
            Top 5 influenceurs partenaires
          </Text>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            {/* Outer Circle with Cyan Border */}
            <View style={styles.profileCircleContainer}>
              <View style={styles.profileCircleOuter}>
                <View style={styles.profileCircleInner}>
                  <Image
                    source={{ uri: topInfluencer.imageUrl }}
                    style={styles.profileImage}
                  />
                </View>
              </View>
              
              {/* Instagram Icon */}
              <View style={styles.instagramIconContainer}>
                <FontAwesome name="instagram" size={24} color="white" style={styles.instagramIcon} />
              </View>
              
              {/* Followers Badge */}
              <View style={styles.followersBadge}>
                <Text style={styles.followersBadgeText}>+100k</Text>
                <Text style={styles.followersBadgeSubtext}>Abonnés</Text>
              </View>
              
              {/* Arrow Indicator */}
              <View style={styles.arrowIndicator}>
                <Text style={styles.arrowText}>artiste</Text>
                <Feather name="arrow-down-right" size={24} color="#00BCD4" />
              </View>
            </View>

            {/* Profile Name */}
            <Text style={styles.profileName}>{topInfluencer.name}</Text>
            
            {/* Profile Description */}
            {/* <Text style={styles.profileDescription}>
              {topInfluencer.description}
            </Text> */}
          </View>

          {/* Partners Section */}
          <View style={styles.partnersSection}>
            <Text style={styles.partnersTitle}>
              Plus de 100 commerçants nous fais confiance
            </Text>
            <View style={styles.partnersLogos}>
              {/* {partnerLogos.map(logo => (
                <Image
                  key={logo.id}
                  source={{ uri:"../../assets/images/partners/partner1.png"}}
                  style={styles.partnerLogo}
                />
              ))} */}
            </View>
          </View>

          {/* Business Info Section */}
          <View style={styles.businessInfoSection}>
            <View style={styles.infoIconContainer}>
              <Feather name="info" size={20} color="white" />
            </View>
            <Text style={styles.businessInfoText}>
              Faites Exploser le chiffre d'affaire de votre entreprise avec nos abonnement <Text style={styles.premiumText}>premium</Text> vous permettant de bénéficier d'une visibilité mensuelle et ce à un prix imbattable
            </Text>
          </View>
          {/* Pricing Tiers */}
          <View style={styles.pricingSection}>
            <View style={styles.pricingTiers}>
              {pricingTiers.map((tier) => (
                <View
                  key={tier.id}
                  style={[styles.pricingTier, { backgroundColor: tier.color }]}
                >
                  <Text style={styles.pricingTierText}>{tier.name}</Text>
                </View>
              ))}
            </View>
          </View>


          {/* Discover Button */}
          <TouchableOpacity
            style={styles.discoverButton}
            onPress={handleDiscover}
          >
            <Text style={styles.discoverButtonText}>Découvrir</Text>
            <Feather name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Login Section */}
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>
              Avez-vous déjà un compte? {' '}
            </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Veuillez se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// Updated styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
    fontFamily:'Montserrat',
  },
  backgroundGradient: {
    position: 'absolute',
    width: width,
    height: height,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontFamily:'Montserrat',
    fontSize: 16,
    marginBottom: 10,
  },
  retryText: {
    color: '#00BCD4',
    fontSize: 16,
    // fontWeight: 'bold',
    fontFamily:'Montserrat-Bold'
  },
  headerText: {
    fontSize: 21,
    fontFamily:'Montserrat-Bold',
    // fontWeight: 'bold',
    // marginBottom: 30,
    textAlign: 'center',
    color: '#0D3B56',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileCircleContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileCircleOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileCircleInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  instagramIconContainer: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    backgroundColor: '#0D3B56',
    borderRadius: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instagramIcon: {
    textAlign: 'center',
  },
  followersBadge: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: '#00BCD4',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  followersBadgeText: {
    color: '#fff',
    // fontWeight: 'bold',
    fontFamily:'Montserrat-Bold',
    fontSize: 14,
  },
  followersBadgeSubtext: {
    color: '#fff',
    fontSize: 12,
  },
  arrowIndicator: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowText: {
    color: '#00BCD4',
    fontSize: 16,
    fontStyle: 'italic',
    marginRight: 5,
  },
  profileName: {
    fontSize: 22,
    fontFamily:'Montserrat-Bold',
    // fontWeight: 'bold',
    // marginTop: 15,
    marginBottom: 10,
    color: '#0D3B56',
  },
  profileDescription: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  partnersSection: {
    // marginVertical: 30,
  },
  partnersTitle: {
    fontSize: 16,
    textAlign:'center',
    fontFamily:'Montserrat-Bold',
    // marginBottom: 15,
    color: '#0D3B56',
  },
  partnersLogos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partnerLogo: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  businessInfoSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIconContainer: {
    backgroundColor: '#0D3B56',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  businessInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  premiumText: {
    color: '#00BCD4',
    // fontWeight: 'bold',
    fontFamily:'Montserrat-Bold'
  },
  pricingSection: {
    marginBottom: 30,
  },
  pricingTiers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pricingTier: {
    width: (width - 60) / 4,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  pricingTierText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#0D3B56',
    fontWeight: '600',
  },
  discoverButton: {
    backgroundColor: '#0D3B56',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  discoverButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#00BCD4',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;