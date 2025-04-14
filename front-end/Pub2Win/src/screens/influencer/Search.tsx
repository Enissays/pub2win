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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApi } from '../../hooks/useApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import BottomNavigation from '../../components/BottomNavigation';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

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
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

type RootStackParamList = {
  InfluencerDashboard: undefined;
  Search: undefined;
  Chat: undefined;
  Wallet: undefined;
  PartnerDetails: { partnerId: string };
};

type SearchNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Search: React.FC = () => {
  const navigation = useNavigation<SearchNavigationProp>();
  const api = useApi();
  const { token } = useSelector((state: RootState) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([
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
  ]);
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'Ivory Isle Inn',
      category: 'Restaurant',
      imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
      rating: 4.8,
      priceRange: '€€',
      points: 3,
      latitude: 48.8566,
      longitude: 2.3522,
    },
    {
      id: '2',
      name: 'Le vingt 4',
      category: 'Restaurant',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      rating: 4.5,
      priceRange: '€€€',
      points: 3,
      latitude: 48.8606,
      longitude: 2.3376,
    },
    {
      id: '3',
      name: 'Au Bonheur',
      category: 'Restaurant',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
      rating: 4.7,
      priceRange: '€€',
      points: 3,
      latitude: 48.8634,
      longitude: 2.3488,
    },
    {
      id: '4',
      name: 'République',
      category: 'Café',
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
      rating: 4.6,
      priceRange: '€',
      points: 2,
      latitude: 48.8674,
      longitude: 2.3631,
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch partners from API
        const data = await api.get('/endroits', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (data?.success) {
          // Transform the data to match our Partner interface
          const partnerData = data.endroits.map((endroit: any) => ({
            id: endroit._id,
            name: endroit.nom,
            category: endroit.category,
            imageUrl: endroit.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', // Default image if none provided
            rating: endroit.rating || 4.5, // Default rating if none provided
            priceRange: '€€', // You might want to add this to your endroit model
            points: endroit.conditions && endroit.conditions.length > 0 ? endroit.conditions[0].wincoins : 3,
            description: endroit.description,
            address: endroit.adresse,
            latitude: endroit.latitude || 48.8566, // Default to Paris coordinates
            longitude: endroit.longitude || 2.3522,
          }));
          
          setPartners(partnerData);
        } else {
          setError('Failed to fetch partners from API');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error connecting to API');
      }
    };
    
    fetchData();
  }, [token]); 
  
  // Filter partners based on search query
  const filteredPartners = searchQuery
    ? partners.filter(partner => 
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : partners;
  
  const handlePartnerPress = (partnerId: string) => {
    navigation.navigate('PartnerDetails', { partnerId });
  };
  
  
  const handleMarkerPress = (partner: Partner) => {
    setSelectedPartner(partner);
  };
  
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => setSearchQuery(item.name)}
    >
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
  
  const renderPartnerInfoCard = () => {
    if (!selectedPartner) return null;
    
    return (
      <View style={styles.partnerInfoCard}>
        <Image 
          source={{ uri: selectedPartner.imageUrl }} 
          style={styles.partnerInfoImage}
        />
        <View style={styles.partnerInfoContent}>
          <Text style={styles.partnerInfoName}>{selectedPartner.name}</Text>
          <Text style={styles.partnerInfoCategory}>{selectedPartner.category} • {selectedPartner.priceRange}</Text>
          <View style={styles.partnerInfoRating}>
            <Feather name="star" size={14} color="#FFC107" />
            <Text style={styles.partnerInfoRatingText}>{selectedPartner.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.partnerInfoWinCoins}>
            <Text style={styles.partnerInfoWinText}>Win</Text>
            <View style={styles.partnerInfoWinBadge}>
              <Text style={styles.partnerInfoWinBadgeText}>{selectedPartner.points}</Text>
            </View>
            <Text style={styles.partnerInfoWinLabel}>WinCoins</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.partnerInfoButton}
          onPress={() => handlePartnerPress(selectedPartner.id)}
        >
          <Text style={styles.partnerInfoButtonText}>Voir</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
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
      
      {/* View Mode Toggle */}
      <View style={styles.viewToggleContainer}>
        <TouchableOpacity 
          style={[styles.viewToggleButton, viewMode === 'list' && styles.viewToggleButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <Feather 
            name="list" 
            size={18} 
            color={viewMode === 'list' ? "#003049" : "#666666"} 
          />
          <Text style={[styles.viewToggleText, viewMode === 'list' && styles.viewToggleTextActive]}>
            Liste
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.viewToggleButton, viewMode === 'map' && styles.viewToggleButtonActive]}
          onPress={() => setViewMode('map')}
        >
          <Feather 
            name="map" 
            size={18} 
            color={viewMode === 'map' ? "#003049" : "#666666"} 
          />
          <Text style={[styles.viewToggleText, viewMode === 'map' && styles.viewToggleTextActive]}>
            Carte
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <View style={{ flex: 1 }}>
        <>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {viewMode === 'list' ? (
            // List View
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
                  
                  {filteredPartners.length > 0 ? (
                    <FlatList
                      data={filteredPartners}
                      renderItem={renderPartnerItem}
                      keyExtractor={item => item.id}
                      horizontal={false}
                      scrollEnabled={false}
                      numColumns={2}
                      columnWrapperStyle={styles.partnerRow}
                      contentContainerStyle={styles.partnersContainer}
                    />
                  ) : (
                    <View style={styles.noResultsContainer}>
                      <Feather name="search" size={50} color="#CCCCCC" />
                      <Text style={styles.noResultsText}>Aucun résultat trouvé</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            ) : (
              // Map View
              <View style={styles.mapContainer}>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  initialRegion={{
                    latitude: filteredPartners[0]?.latitude || 48.8566,
                    longitude: filteredPartners[0]?.longitude || 2.3522,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                >
                  {filteredPartners.map(partner => (
                    <Marker
                      key={partner.id}
                      coordinate={{
                        latitude: partner.latitude || 48.8566,
                        longitude: partner.longitude || 2.3522,
                      }}
                      title={partner.name}
                      description={`${partner.category} • ${partner.points} WinCoins`}
                      onPress={() => handleMarkerPress(partner)}
                    />
                  ))}
                </MapView>
                
                {selectedPartner && renderPartnerInfoCard()}
              </View>
            )}
          </>
      </View>
      
      {/* Bottom Navigation */}
      {/* <BottomNavigation activeScreen="search" /> */}
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
  viewToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  viewToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewToggleButtonActive: {
    backgroundColor: '#E6F0FF',
  },
  viewToggleText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  viewToggleTextActive: {
    color: '#003049',
    fontFamily: 'Montserrat-Medium',
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FFEBEE',
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#D32F2F',
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
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  partnerInfoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  partnerInfoImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  partnerInfoContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  partnerInfoName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#003049',
    marginBottom: 4,
  },
  partnerInfoCategory: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  partnerInfoRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  partnerInfoRatingText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#333333',
    marginLeft: 4,
  },
  partnerInfoWinCoins: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerInfoWinText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#333333',
  },
  partnerInfoWinBadge: {
    backgroundColor: '#FFC107',
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  partnerInfoWinBadgeText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  partnerInfoWinLabel: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#666666',
  },
  partnerInfoButton: {
    backgroundColor: '#003049',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginLeft: 12,
  },
  partnerInfoButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
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