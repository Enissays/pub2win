import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApi } from '../../hooks/useApi';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

interface Partner {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  rating: number;
  priceRange: string;
  points: number;
}

type RootStackParamList = {
  InfluencerDashboard: undefined;
  Search: undefined;
  Chat: undefined;
  Wallet: undefined;
  PartnerDetails: { partnerId: string };
};

type SearchNavigationProp = StackNavigationProp<RootStackParamList>;

const Search: React.FC = () => {
  const navigation = useNavigation<SearchNavigationProp>();
  const api = useApi();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch categories and partners from your API
        // For now, we'll use sample data
        const sampleCategories: Category[] = [
          {
            id: '1',
            name: 'Restaurants',
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
          },
          {
            id: '2',
            name: 'Café',
            imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
          },
        ];
        
        const samplePartners: Partner[] = [
          {
            id: '1',
            name: 'Ivory Isle Inn',
            category: 'Restaurant',
            imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
            rating: 4.8,
            priceRange: '€€',
            points: 3,
          },
          {
            id: '2',
            name: 'Le vingt 4',
            category: 'Restaurant',
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
            rating: 4.5,
            priceRange: '€€€',
            points: 3,
          },
          {
            id: '3',
            name: 'Au Bonheur',
            category: 'Restaurant',
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
            rating: 4.7,
            priceRange: '€€',
            points: 3,
          },
          {
            id: '4',
            name: 'République',
            category: 'Café',
            imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
            rating: 4.6,
            priceRange: '€',
            points: 2,
          },
        ];
        
        setCategories(sampleCategories);
        setPartners(samplePartners);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handlePartnerPress = (partnerId: string) => {
    navigation.navigate('PartnerDetails', { partnerId });
  };
  
  const handleNavigation = (screen: string) => {
    switch(screen) {
      case 'home':
        navigation.navigate('InfluencerDashboard');
        break;
      case 'search':
        // Already on search
        break;
      case 'chat':
        navigation.navigate('Chat');
        break;
      case 'wallet':
        navigation.navigate('Wallet');
        break;
    }
  };
  
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.categoryImage}
      />
      <View style={styles.categoryOverlay} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );
  
  const renderPartnerItem = ({ item }: { item: Partner }) => (
    <TouchableOpacity 
      style={styles.partnerCard}
      onPress={() => handlePartnerPress(item.id)}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.partnerImage}
      />
      <View style={styles.partnerContent}>
        <View style={styles.partnerHeader}>
          <Text style={styles.partnerName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Feather name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <View style={styles.partnerInfo}>
          <Text style={styles.partnerCategory}>{item.category}</Text>
          <Text style={styles.partnerPriceRange}>{item.priceRange}</Text>
        </View>
        
        <View style={styles.partnerFooter}>
          <Text style={styles.priceText}>Prix totale de la commande • €€</Text>
          <View style={styles.pointsContainer}>
            <Text style={styles.winText}>Win</Text>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsBadgeText}>{item.points}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Recherchez un restaurant, un café..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="sliders" size={20} color="#003049" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal={false}
          scrollEnabled={false}
          contentContainerStyle={styles.categoriesContainer}
        />
        
        {/* Partners */}
        <View style={styles.partnersSection}>
          <Text style={styles.sectionTitle}>
            Nos meilleurs <Text style={styles.highlightText}>partenaires</Text>
          </Text>
          
          <FlatList
            data={partners}
            renderItem={renderPartnerItem}
            keyExtractor={item => item.id}
            horizontal={false}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.partnerRow}
            contentContainerStyle={styles.partnersContainer}
          />
        </View>
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
        >
          <Feather name="search" size={24} color="#003049" />
          <Text style={[styles.navText, styles.navTextActive]}>Recherche</Text>
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
          onPress={() => handleNavigation('wallet')}
        >
          <Feather name="credit-card" size={24} color="#AAAAAA" />
          <Text style={styles.navText}>Mon solde</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#333333',
  },
  filterButton: {
    marginLeft: 12,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    padding: 16,
  },
  categoryCard: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  categoryName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  partnersSection: {
    paddingHorizontal: 16,
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
  partnersContainer: {
    paddingBottom: 16,
  },
  partnerRow: {
    justifyContent: 'space-between',
  },
  partnerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    width: (width - 40) / 2,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  partnerImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  partnerContent: {
    padding: 10,
  },
  partnerHeader: {
    marginBottom: 4,
  },
  partnerName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: '#003049',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#333333',
    marginLeft: 4,
  },
  partnerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  partnerCategory: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#666666',
  },
  partnerPriceRange: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#666666',
  },
  partnerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 8,
  },
  priceText: {
    fontFamily: 'Montserrat',
    fontSize: 10,
    color: '#666666',
    marginBottom: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  winText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#333333',
    marginRight: 4,
  },
  pointsBadge: {
    backgroundColor: '#FFC107',
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsBadgeText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 10,
    color: '#FFFFFF',
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

export default Search;