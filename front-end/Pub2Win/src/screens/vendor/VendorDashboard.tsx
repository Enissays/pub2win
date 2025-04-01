import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '@clerk/clerk-expo';

const { width } = Dimensions.get('window');

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  discount?: number;
  features: Array<{
    text: string;
    active: boolean;
  }>;
}

interface VendorStats {
  servicesCount: number;
  servicesGrowth: number;
  status: string;
  subscription?: {
    type: string;
    expiresAt: string;
  };
}

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  VendorPlace: undefined;
  VendorProfile: undefined;
  VendorSettings: undefined;
  VendorNotifications: undefined;
  VendorHelp: undefined;
  SubscriptionDetails: { planId: string };
  CreateEndroit: undefined;
  BankingSetup: undefined;
};

type VendorDashboardNavigationProp = StackNavigationProp<RootStackParamList>;

const VendorDashboard: React.FC = () => {
  const navigation = useNavigation<VendorDashboardNavigationProp>();
  const api = useApi();
  const { userId } = useAuth();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [vendorData, setVendorData] = useState<any>(null);
  const [vendorStats, setVendorStats] = useState<VendorStats>({
    servicesCount: 0,
    servicesGrowth: 0,
    status: 'pending' 
  });
  
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'omega',
      name: 'Omega Premium',
      price: 49.99,
      discount: 20,
      features: [
        { 
          text: "Jusqu'à 6 de nos influenceurs qui vous font pétiller les yeux", 
          active: true 
        },
        { 
          text: "Accès à des statistiques détaillées sur vos campagnes", 
          active: true 
        },
        { 
          text: "Support prioritaire 24/7", 
          active: false 
        },
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 29.99,
      features: [
        { 
          text: "Jusqu'à 3 influenceurs pour vos campagnes", 
          active: true 
        },
        { 
          text: "Statistiques de base sur vos campagnes", 
          active: true 
        },
        { 
          text: "Support pendant les heures de bureau", 
          active: true 
        },
      ]
    }
  ];

  // Fetch vendor data on component mount
  useEffect(() => {
    const fetchVendorData = async () => {
      if (!userId) return;
      
      try {
        // setLoading(true);
        const response = await api.get(`/vendor/profile?userId=${userId}`);
        
        if (response.data && response.data.success) {
          setVendorData(response.data.vendor);
          
          // Update stats based on vendor data
          setVendorStats({
            servicesCount: response.data.stats?.servicesCount || 0,
            servicesGrowth: response.data.stats?.servicesGrowth || 0,
            status: response.data.vendor?.status || 'pending',
            subscription: response.data.subscription
          });
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        Alert.alert('Error', 'Failed to load your profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendorData();
  }, [userId]);

  const handleSettings = () => {
    navigation.navigate('VendorSettings');
  };

  const handleNotifications = () => {
    navigation.navigate('VendorNotifications');
  };

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await api.post('/vendor/subscribe', {
        planId,
        userId
      });
      
      if (response.data && response.data.success) {
        Alert.alert('Success', 'Subscription successful!');
        // Refresh vendor data
        const updatedData = await api.get(`/vendor/profile?userId=${userId}`);
        if (updatedData.data && updatedData.data.success) {
          setVendorData(updatedData.data.vendor);
          setVendorStats(prev => ({
            ...prev,
            subscription: updatedData.data.subscription
          }));
        }
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      Alert.alert('Error', 'Failed to process your subscription');
    }
  };

  const handleExternalLink = (planId: string) => {
    // Open external link logic
    console.log(`Open external link for ${planId}`);
  };

  const handleHelp = () => {
    navigation.navigate('VendorHelp');
  };

  const handleNavigation = (screen: string) => {
    switch(screen) {
      case 'home':
        // Already on home
        break;
      case 'chat':
        navigation.navigate('Chat');
        break;
      case 'place':
        navigation.navigate('VendorPlace');
        break;
      case 'profile':
        navigation.navigate('VendorProfile');
        break;
    }
  };

  const handleCreateEndroit = () => {
    navigation.navigate('CreateEndroit');
  };

  const handleSetupBanking = () => {
    navigation.navigate('BankingSetup');
  };

  // if (loading) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size="large" color="#003049" />
  //         <Text style={styles.loadingText}>Loading your dashboard...</Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSettings}>
          <Feather name="settings" size={24} color="#003049" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNotifications}>
          <Feather name="bell" size={24} color="#003049" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <Text style={styles.welcomeText}>
          Bienvenue,{'\n'}
          <Text style={styles.userName}>{vendorData?.prenom || 'Commerçant'}</Text>
        </Text>

        {/* Account Status */}
        {vendorStats.status !== 'validated' && (
          <View style={styles.statusCard}>
            <Feather name="alert-circle" size={20} color="#FFA500" />
            <Text style={styles.statusText}>
              Votre compte est en attente de validation. Certaines fonctionnalités peuvent être limitées.
            </Text>
          </View>
        )}

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsTextContainer}>
            <Text style={styles.statsTitle}>Nombre de prestations</Text>
            <Text style={styles.statsSubtitle}>{new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</Text>
          </View>
          
          <View style={styles.statsValueContainer}>
            {/* Simple bar chart visualization */}
            <View style={styles.chartContainer}>
              {[...Array(8)].map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.chartBar, 
                    { height: 10 + Math.random() * 20 }
                  ]} 
                />
              ))}
            </View>
            
            <View style={styles.statsNumberContainer}>
              <Text style={styles.statsNumber}>{vendorStats.servicesCount}</Text>
              <Text style={styles.statsGrowth}>+{vendorStats.servicesGrowth}%</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleCreateEndroit}
          >
            <Feather name="map-pin" size={24} color="#003049" />
            <Text style={styles.quickActionText}>Ajouter un endroit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleSetupBanking}
          >
            <Feather name="credit-card" size={24} color="#003049" />
            <Text style={styles.quickActionText}>Configurer paiement</Text>
          </TouchableOpacity>
        </View>

        {/* Subscriptions Section */}
        <Text style={styles.sectionTitle}>
          Découvrir nos abonnements premium
        </Text>

        {/* Current Subscription */}
        {vendorStats.subscription && (
          <View style={styles.currentSubscriptionCard}>
            <Text style={styles.currentSubscriptionTitle}>Votre abonnement actuel</Text>
            <Text style={styles.currentSubscriptionType}>{vendorStats.subscription.type}</Text>
            <Text style={styles.currentSubscriptionExpiry}>
              Expire le {new Date(vendorStats.subscription.expiresAt).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        )}

        {/* Subscription Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subscriptionCardsContainer}
        >
          {subscriptionPlans.map((plan) => (
            <View key={plan.id} style={styles.subscriptionCard}>
              {plan.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{plan.discount}%</Text>
                </View>
              )}
              
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}€/mois</Text>
              
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <View style={[
                      styles.featureDot,
                      { backgroundColor: feature.active ? '#00BCD4' : '#CCCCCC' }
                    ]} />
                    <Text style={[
                      styles.featureText,
                      { color: feature.active ? '#333333' : '#999999' }
                    ]}>
                      {feature.text}
                    </Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.planActions}>
                <TouchableOpacity 
                  style={styles.subscribeButton}
                  onPress={() => handleSubscribe(plan.id)}
                >
                  <Text style={styles.subscribeButtonText}>S'abonner</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.externalLinkButton}
                  onPress={() => handleExternalLink(plan.id)}
                >
                  <Feather name="external-link" size={20} color="#003049" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Help Section */}
        <TouchableOpacity style={styles.helpSection} onPress={handleHelp}>
          <Text style={styles.helpText}>Besoin de l'aide ?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#003049',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontFamily: 'Montserrat',
    fontSize: 24,
    color: '#333333',
    marginBottom: 20,
  },
  userName: {
    fontFamily: 'Montserrat-Bold',
    color: '#003049',
  },
  statusCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#FFA500',
    marginLeft: 10,
    flex: 1,
  },
  
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  
  quickActionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  quickActionText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#003049',
    marginTop: 8,
  },
  
  currentSubscriptionCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  
  currentSubscriptionTitle: {
    fontFamily: 'Montesserat',
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
  },
  
  currentSubscriptionType: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#003049',
    marginBottom: 5,
  },
  
  currentSubscriptionExpiry: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#666666',
  },
  
  planPrice: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTextContainer: {
    marginBottom: 12,
  },
  statsTitle: {
    fontFamily: 'Montesserat',
    fontSize: 16,
    color: '#333333',
  },
  statsSubtitle: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  statsValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    height: 40,
  },
  chartBar: {
    width: 8,
    backgroundColor: '#00BCD4',
    marginRight: 6,
    borderRadius: 4,
  },
  statsNumberContainer: {
    marginLeft: 16,
  },
  statsNumber: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: '#003049',
  },
  statsGrowth: {
    fontFamily: 'Montesserat',
    fontSize: 14,
    color: '#4CAF50',
  },
  
  // Section title
  sectionTitle: {
    fontFamily: 'Montesserat',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  
  // Subscription cards
  subscriptionCardsContainer: {
    paddingBottom: 16,
    paddingRight: 16,
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginRight: 16,
    width: width * 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF5722',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  planName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#003049',
    marginBottom: 4,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  featureText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    flex: 1,
  },
  planActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscribeButton: {
    backgroundColor: '#003049',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 12,
  },
  subscribeButtonText: {
    fontFamily: 'Montesserat',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  externalLinkButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Help section
  helpSection: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  helpText: {
    fontFamily: 'Montesserat',
    fontSize: 16,
    color: '#003049',
  },
  
  // Bottom navigation
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
    fontFamily: 'Montesserat',
  },
});
export default VendorDashboard;