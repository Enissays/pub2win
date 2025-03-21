import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '@clerk/clerk-expo';

const { width } = Dimensions.get('window');

interface Reward {
  id: string;
  points: number;
  description: string;
}

type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Chat: undefined;
  Wallet: undefined;
};

type WalletNavigationProp = StackNavigationProp<RootStackParamList>;

const Wallet: React.FC = () => {
  const navigation = useNavigation<WalletNavigationProp>();
  const api = useApi();
  const { userId } = useAuth();
  
  const [balance, setBalance] = useState<number>(100);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch wallet data from your API
        // For now, we'll use sample data
        const sampleRewards: Reward[] = [
          {
            id: '1',
            points: 50,
            description: 'Débloquéz ce cadeau et gagnez 50 WinCoin = 1 coupon de 5€ du restaurant de votre choix',
          },
          {
            id: '2',
            points: 100,
            description: 'Débloquéz ce cadeau et gagnez 100 WinCoin = 1 coupon de 5€ du restaurant de votre choix',
          },
          {
            id: '3',
            points: 150,
            description: 'Débloquéz ce cadeau et gagnez 150 WinCoin = 1 coupon de 5€ du restaurant de votre choix',
          },
        ];
        
        setRewards(sampleRewards);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWalletData();
  }, [userId]);
  
  const handleUnlockReward = (rewardId: string) => {
    // In a real app, you would call your API to unlock the reward
    console.log(`Unlocking reward ${rewardId}`);
  };
  
  const handleNavigation = (screen: string) => {
    switch(screen) {
      case 'home':
        navigation.navigate('Home');
        break;
      case 'search':
        navigation.navigate('Search');
        break;
      case 'chat':
        navigation.navigate('Chat');
        break;
      case 'wallet':
        // Already on wallet
        break;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>VOTRE SOLDE</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>{balance}</Text>
          <Image 
            source={require('../../assets/coin.png')} 
            style={styles.coinIcon}
          />
        </View>
        <Text style={styles.exchangeRate}>1 WinCoin = 1 Euro</Text>
        
        <TouchableOpacity style={styles.detailButton}>
          <Text style={styles.detailButtonText}>Détail</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.withdrawalInfo}>
        Le montant de retrait minimum est de 10 WinCoin
      </Text>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.rewardsTitle}>
          Découvrir nos meilleures surprises
        </Text>
        
        {/* Rewards List */}
        {rewards.map((reward) => (
          <View key={reward.id} style={styles.rewardCard}>
            <Image 
              source={require('../../assets/gift.png')} 
              style={styles.giftIcon}
            />
            <View style={styles.rewardContent}>
              <Text style={styles.rewardDescription}>
                {reward.description}
              </Text>
              <TouchableOpacity 
                style={styles.unlockButton}
                onPress={() => handleUnlockReward(reward.id)}
              >
                <Text style={styles.unlockButtonText}>Débloquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => handleNavigation('home')}
        >
          <Feather name="home" size={24} color="#AAAAAA" />
          <Text style={styles.navText}>Accueil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => handleNavigation('search')}
        >
          <Feather name="search" size={24} color="#AAAAAA" />
          <Text style={styles.navText}>Recherche</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => handleNavigation('chat')}
        >
          <Feather name="message-square" size={24} color="#AAAAAA" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
        >
          <Feather name="credit-card" size={24} color="#003049" />
          <Text style={[styles.navText, styles.navTextActive]}>Mon solde</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    width: width - 32,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceAmount: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 36,
    color: '#000000',
    marginRight: 8,
  },
  coinIcon: {
    width: 32,
    height: 32,
  },
  exchangeRate: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#666666',
    marginBottom: 16,
  },
  detailButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#003049',
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 10,
    color: '#FFFFFF',
  },
  withdrawalInfo: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
    marginBottom: 24,
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  rewardsTitle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
  },
  rewardCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  giftIcon: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  rewardContent: {
    flex: 1,
  },
  rewardDescription: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#333333',
    marginBottom: 12,
  },
  unlockButton: {
    backgroundColor: '#003049',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  unlockButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    width: '100%',
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

export default Wallet;