import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '@clerk/clerk-expo';

// Define the navigation param list type
type RootStackParamList = {
  VendorDashboard: undefined;
  Chat: undefined;
  VendorPlace: undefined;
  VendorProfile: undefined;
  CreateEndroit: undefined;
};

// Create a typed navigation prop
type VendorPlaceNavigationProp = StackNavigationProp<RootStackParamList>;

interface Place {
  id: string;
  name: string;
  address: string;
  category: string;
  rating: number;
  imageUrl: string;
  isActive: boolean;
}

const VendorPlace: React.FC = () => {
  // Use the typed navigation
  const navigation = useNavigation<VendorPlaceNavigationProp>();
  const api = useApi();
  const { userId } = useAuth();
  
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/vendor/places?userId=${userId}`);
        
        if (response.data && response.data.success) {
          setPlaces(response.data.places || []);
        }
      } catch (error) {
        console.error('Error fetching places:', error);
        Alert.alert('Error', 'Failed to load your places');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlaces();
    
    // For demo purposes, add sample places if none are returned
    if (places.length === 0) {
      const samplePlaces: Place[] = [
        {
          id: '1',
          name: 'Café Parisien',
          address: '123 Rue de Paris, 75001 Paris',
          category: 'Restaurant',
          rating: 4.5,
          imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
          isActive: true,
        },
        {
          id: '2',
          name: 'Boutique Mode',
          address: '45 Avenue des Champs-Élysées, 75008 Paris',
          category: 'Retail',
          rating: 4.2,
          imageUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5',
          isActive: true,
        },
      ];
      setPlaces(samplePlaces);
    }
  }, [userId]);
  
  const handleAddPlace = () => {
    navigation.navigate('CreateEndroit');
  };
  
  const handleEditPlace = (placeId: string) => {
    // Navigate to edit place screen
    console.log(`Edit place ${placeId}`);
  };
  
  const togglePlaceStatus = async (placeId: string, currentStatus: boolean) => {
    try {
      const response = await api.put(`/vendor/places/${placeId}/status`, {
        isActive: !currentStatus,
      });
      
      if (response.data && response.data.success) {
        setPlaces(prevPlaces => 
          prevPlaces.map(place => 
            place.id === placeId 
              ? { ...place, isActive: !place.isActive } 
              : place
          )
        );
      }
    } catch (error) {
      console.error('Error updating place status:', error);
      Alert.alert('Error', 'Failed to update place status');
    }
  };
  
  const renderPlace = ({ item }: { item: Place }) => (
    <View style={styles.placeCard}>
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.placeImage}
        // defaultSource={require('../../assets/s.png')}
      />
      
      <View style={styles.placeContent}>
        <View style={styles.placeHeader}>
          <Text style={styles.placeName}>{item.name}</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.isActive ? '#4CAF50' : '#F44336' }
          ]}>
            <Text style={styles.statusText}>
              {item.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.placeAddress}>{item.address}</Text>
        <Text style={styles.placeCategory}>{item.category}</Text>
        
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Feather 
              key={index}
              name="star" 
              size={16} 
              color={index < Math.floor(item.rating) ? '#FFC107' : '#CCCCCC'} 
              style={{ marginRight: 2 }}
            />
          ))}
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
        
        <View style={styles.placeActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEditPlace(item.id)}
          >
            <Feather name="edit" size={16} color="#003049" />
            <Text style={styles.actionText}>Modifier</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => togglePlaceStatus(item.id, item.isActive)}
          >
            <Feather 
              name={item.isActive ? 'eye-off' : 'eye'} 
              size={16} 
              color="#003049" 
            />
            <Text style={styles.actionText}>
              {item.isActive ? 'Désactiver' : 'Activer'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Endroits</Text>
        <TouchableOpacity onPress={handleAddPlace}>
          <Feather name="plus-circle" size={24} color="#003049" />
        </TouchableOpacity>
      </View>
      
      {places.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="map-pin" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>
            Vous n'avez pas encore ajouté d'endroit
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddPlace}
          >
            <Text style={styles.addButtonText}>Ajouter un endroit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={places}
          renderItem={renderPlace}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.placesContainer}
        />
      )}
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('VendorDashboard')}
        >
          <Feather name="home" size={24} color="#AAAAAA" />
          <Text style={styles.navText}>Accueil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Chat')}
        >
          <Feather name="message-square" size={24} color="#AAAAAA" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
        >
          <Feather name="map-pin" size={24} color="#003049" />
          <Text style={[styles.navText, styles.navTextActive]}>My place</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('VendorProfile')}
        >
          <Feather name="user" size={24} color="#AAAAAA" />
          <Text style={styles.navText}>Profile</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#003049',
  },
  placesContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#003049',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  placeContent: {
    padding: 16,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#003049',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  placeAddress: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  placeCategory: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#333333',
    marginLeft: 4,
  },
  placeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#003049',
    marginLeft: 6,
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

export default VendorPlace;