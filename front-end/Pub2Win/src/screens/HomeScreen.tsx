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
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchInfluencers } from '../store/slices/influencerSlice';
import { useAuth } from '@clerk/clerk-expo';

// Get screen dimensions
const { width } = Dimensions.get('window');

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
  { id: '1', name: 'DEBUT\npremium', color: '#E0F7FA' },
  { id: '2', name: 'AVANCE\npremium', color: '#B2EBF2' },
  { id: '3', name: 'STAR\npremium', color: '#80DEEA' },
  { id: '4', name: 'PLUS\npremium', color: '#4DD0E1' },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items: influencers, loading, error } = useAppSelector(state => state.influencer);
  const { user } = useAppSelector(state => state.auth);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // Fetch influencers when component mounts
    dispatch(fetchInfluencers());
  }, [dispatch]);

  const handleLogin = () => {
    navigation?.navigate('Login');
  };

  const handleDiscover = () => {
    // Handle discover action
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
  const topInfluencer = influencers.length > 0 ? influencers[0] : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <Text style={styles.headerText}>
          Top 5 influenceurs partenaires
        </Text>

        {/* Profile Section */}
        {topInfluencer && (
          <View style={styles.profileSection}>
            <View style={styles.profileCircleOuter}>
              <View style={styles.profileCircleInner}>
                <Image
                  source={{ uri: topInfluencer.imageUrl }}
                  style={styles.profileImage}
                />
                <View style={styles.instagramIcon}>
                  <Feather name="instagram" size={20} color="#fff" />
                </View>
              </View>
            </View>
            
            {/* Followers Badge */}
            <View style={styles.followersBadge}>
              <Text style={styles.followersBadgeText}>{topInfluencer.followers / 1000}k</Text>
              <Text style={styles.followersBadgeSubtext}>abonnés</Text>
            </View>

            {/* Profile Name */}
            <Text style={styles.profileName}>{topInfluencer.name}</Text>
            
            {/* Profile Description */}
            <Text style={styles.profileDescription}>
              {topInfluencer.description}
            </Text>
          </View>
        )}

        {/* Partners Section */}
        <View style={styles.partnersSection}>
          <Text style={styles.partnersTitle}>
            Plus de 100 commerçants nous fais confiance
          </Text>
          <View style={styles.partnersLogos}>
            {/* Add your partner logos here */}
            {/* Example: */}
            <Image
              source={{ uri: 'https://i.imgur.com/placeholder.png' }}
              style={styles.partnerLogo}
            />
            {/* Repeat for other logos */}
          </View>
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

        {/* Login Section - only show if not signed in */}
        {!isSignedIn && !user && (
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>
              Avez-vous déjà un compte? {' '}
            </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Veuillez se connecter</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  // ... (same styles as before)
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
    fontSize: 16,
    marginBottom: 10,
  },
  retryText: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileCircleOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
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
    position: 'relative',
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  instagramIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#00BCD4',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followersBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#00BCD4',
    borderRadius: 15,
    padding: 8,
    alignItems: 'center',
  },
  followersBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  followersBadgeSubtext: {
    color: '#fff',
    fontSize: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  profileDescription: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  partnersSection: {
    marginVertical: 30,
  },
  partnersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  partnersLogos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partnerLogo: {
    width: 60,
    height: 30,
    resizeMode: 'contain',
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
    height: 80,
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