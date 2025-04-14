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
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '@clerk/clerk-expo';
import BottomNavigation from '../../components/BottomNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getUserId } from '../../hooks/getUserId';
const { width } = Dimensions.get('window');

interface InfluencerStats {
  rank: number;
  totalPoints: number;
  status: string;
}

interface Partner {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  rating: number;
  totalSpent: number;
  points: number;
}

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Chat: undefined;
  Wallet: undefined;
  InfluencerSettings: undefined;
  InfluencerNotifications: undefined;
  InfluencerHelp: undefined;
  PartnerDetails: { partnerId: string };
};

type InfluencerDashboardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const InfluencerDashboard: React.FC = () => {
  const navigation = useNavigation<InfluencerDashboardNavigationProp>();
  const api = useApi();
  const { userId } = useAuth();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [influencerData, setInfluencerData] = useState<any>(null);
  const [influencerStats, setInfluencerStats] = useState<InfluencerStats>({
    rank: 10,
    totalPoints: 100,
    status: 'active'
  });
  const [partners, setPartners] = useState<Partner[]>([]);
  
  // Fetch influencer data on component mount
  useEffect(() => {
    const fetchInfluencerData = async () => {
      let userId = getUserId();
      if (!userId) return;
      
      try {
        setLoading(true);
        const data = await api.get(`/influencer/${userId}`);
        console.log(data);
        if (data?.success) {
          setInfluencerData(data.influencer);
          
          // Update stats based on influencer data
          setInfluencerStats({
            rank: data.stats?.rank || 10,
            totalPoints: data.stats?.totalPoints || 100,
            status: data.influencer?.status || 'active',
          });
          
          const dataEndroits = await api.get(`/endroits`);

          setPartners(dataEndroits?.endroits.map((endroit: any) => ({
            id: endroit._id,
            name: endroit.nom,
            category: endroit.category,
            imageUrl: endroit.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
            rating: endroit.rating || 5,
            totalSpent: endroit.totalSpent || 0,
            points: endroit.points || 0
          })));
        }
      } catch (error) {
        console.error('Error fetching influencer data:', error);
        Alert.alert('Error', 'Failed to load your profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInfluencerData();
    
    // For demo purposes, add sample partners if none are returned
    if (partners.length === 0) {
      const samplePartners: Partner[] = [
        {
          id: '1',
          name: 'Le vingt 4',
          category: 'Restaurant',
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
          rating: 4.5,
          totalSpent: 50,
          points: 3,
        },
        {
          id: '2',
          name: 'Ivory',
          category: 'Bar',
          imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
          rating: 4.2,
          totalSpent: 35,
          points: 2,
        },
      ];
      setPartners(samplePartners);
    }
  }, [userId]);

  const handleSettings = () => {
    navigation.navigate('InfluencerSettings');
  };

  const handleNotifications = () => {
    navigation.navigate('InfluencerNotifications');
  };

  const handleHelp = () => {
    navigation.navigate('InfluencerHelp');
  };

  const handlePartnerPress = (partnerId: string) => {
    navigation.navigate('PartnerDetails', { partnerId });
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
        <TouchableOpacity onPress={handleNotifications}style={styles.notif}>
          <Feather name="bell" size={24} color="#003049" />
          <Image 
            source={{ uri: influencerData?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <Text style={styles.welcomeText}>
          Bienvenue,{'\n'}
          <Text style={styles.userName}>{influencerData?.prenom || 'Paul'}</Text>
        </Text>

        {/* Rank Card */}
        <View style={styles.rankCard}>
          <Text style={styles.rankNumber}>#{influencerStats.rank}</Text>
          <View style={styles.rankInfo}>
            <Text style={styles.rankText}>Parmi Les Top Influenceurs De Cette Semaine</Text>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsText}>{influencerStats.totalPoints}</Text>
              <View style={styles.pointsIndicator}>
                <View style={styles.pointsActive} />
              </View>
            </View>
          </View>
        </View>

        {/* Partners Section */}
        <View style={styles.partnersSection}>
          <Text style={styles.sectionTitle}>
            Découvrir certains de nos <Text style={styles.highlightText}>partenaires</Text>
          </Text>
          
          {/* Partner Cards */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.partnerCardsContainer}
          >
            {partners.map((partner) => (
              <TouchableOpacity 
                key={partner.id} 
                style={styles.partnerCard}
                onPress={() => handlePartnerPress(partner.id)}
              >
                <Image 
                  source={{ uri: partner.imageUrl }} 
                  style={styles.partnerImage}
                />
                <View style={styles.partnerContent}>
                  <View style={styles.partnerHeader}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Feather name="star" size={16} color="#FFC107" />
                      <Text style={styles.ratingText}>{partner.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.categoryContainer}>
                    <Text style={styles.categoryText}>{partner.category}</Text>
                    {partner.category === 'Restaurant' && (
                      <Text style={styles.categoryText}>Bar</Text>
                    )}
                  </View>
                  
                  <View style={styles.partnerStats}>
                    <Text style={styles.partnerStatsText}>
                      Prix totale de la commande • {partner.totalSpent}€
                    </Text>
                  </View>
                  
                  <View style={styles.pointsRow}>
                    <Text style={styles.winText}>Win</Text>
                    <View style={styles.pointsBadge}>
                      <Text style={styles.pointsBadgeText}>{partner.points}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Help Section */}
        <TouchableOpacity style={styles.helpSection} onPress={handleHelp}>
          <Text style={styles.helpText}>Besoin d'aide ?</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      {/* <BottomNavigation activeScreen="home" /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 12,
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
  rankCard: {
    backgroundColor: '#00BCD4',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankNumber: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 36,
    color: '#FFFFFF',
    marginRight: 16,
  },
  rankInfo: {
    flex: 1,
  },
  rankText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  pointsIndicator: {
    width: 40,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 2,
  },
  pointsActive: {
    width: 16,
    height: 16,
    backgroundColor: '#FFC107',
    borderRadius: 8,
  },
  partnersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  highlightText: {
    fontFamily: 'Montserrat-Bold',
    color: '#003049',
  },
  partnerCardsContainer: {
    paddingBottom: 8,
  },
  partnerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 16,
    width: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  partnerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  notif:{
    flexDirection:'row'
  },
  partnerContent: {
    padding: 16,
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  partnerName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#003049',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#333333',
    marginLeft: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  categoryText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  partnerStats: {
    marginBottom: 12,
  },
  partnerStatsText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  winText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#333333',
    marginRight: 8,
  },
  pointsBadge: {
    backgroundColor: '#FFC107',
    borderRadius: 50,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsBadgeText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  helpSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  helpText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#666666',
  },
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
    fontFamily: 'Montserrat-Medium',
  },
});

export default InfluencerDashboard;