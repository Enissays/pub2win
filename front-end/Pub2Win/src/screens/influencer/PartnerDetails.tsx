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
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApi } from '../../hooks/useApi';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Search: undefined;
  PartnerDetails: { partnerId: string };
};

type PartnerDetailsRouteProp = RouteProp<RootStackParamList, 'PartnerDetails'>;
type PartnerDetailsNavigationProp = StackNavigationProp<RootStackParamList>;

interface Cuisine {
  id: string;
  name: string;
}

interface PartnerDetails {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  cuisines: Cuisine[];
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  openingHours: string;
  priceRange: string;
  features: string[];
}

const PartnerDetails: React.FC = () => {
  const navigation = useNavigation<PartnerDetailsNavigationProp>();
  const route = useRoute<PartnerDetailsRouteProp>();
  const api = useApi();
  
  const { partnerId } = route.params;
  const [partnerData, setPartnerData] = useState<PartnerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPartnerDetails = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch partner details from your API
        // For now, we'll use sample data
        const samplePartner: PartnerDetails = {
          id: partnerId,
          name: 'Au Bonheur',
          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
          rating: 4.5,
          cuisines: [
            { id: '1', name: 'Asiatique' },
            { id: '2', name: 'Chinoise' },
            { id: '3', name: 'Vietnamienne' },
            { id: '4', name: 'Thaï' },
          ],
          description: 'Régimes spéciaux : Végétariens bienvenus.\nRepas : Déjeuner, Dîner.\nCaractéristiques : Réservations, Places assises, Accessible en fauteuil roulant, Cartes bancaires acceptées, Service de table.',
          address: '61 rue de Paris, 95130 Franconville France',
          latitude: 48.9805,
          longitude: 2.2278,
          openingHours: 'Lun-Dim: 11h30-14h30, 18h30-22h30',
          priceRange: 'Plat conseillé : Crêpe vietnamienne',
          features: ['Apéro bien habillé'],
        };
        
        setPartnerData(samplePartner);
      } catch (error) {
        console.error('Error fetching partner details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPartnerDetails();
  }, [partnerId]);
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  if (loading || !partnerData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#003049" />
          <Text style={styles.loadingText}>Loading partner details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerContainer}>
        <Image 
          source={{ uri: partnerData.imageUrl }} 
          style={styles.headerImage}
        />
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Feather name="chevron-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Restaurant Name and Rating */}
        <View style={styles.nameContainer}>
          <Text style={styles.restaurantName}>{partnerData.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{partnerData.rating.toFixed(1)}</Text>
            <Feather name="star" size={16} color="#FFC107" />
          </View>
        </View>
        
        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.cuisineContainer}>
            {partnerData.cuisines.map((cuisine) => (
              <View key={cuisine.id} style={styles.cuisineTag}>
                <Text style={styles.cuisineText}>{cuisine.name}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.featuresContainer}>
            {partnerData.features.map((feature, index) => (
              <View key={index} style={styles.featureTag}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{partnerData.priceRange}</Text>
          </View>
        </View>
        
        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{partnerData.description}</Text>
        </View>
        
        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localisation</Text>
          
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: partnerData.latitude,
                longitude: partnerData.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: partnerData.latitude,
                  longitude: partnerData.longitude,
                }}
                title={partnerData.name}
              />
            </MapView>
          </View>
          
          <View style={styles.addressContainer}>
            <Feather name="map-pin" size={18} color="#003049" />
            <Text style={styles.addressText}>{partnerData.address}</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Action Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Réserver une table</Text>
        </TouchableOpacity>
      </View>
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
  headerContainer: {
    position: 'relative',
    height: 200,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: '#333333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#333333',
    marginRight: 4,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 12,
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  cuisineTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  cuisineText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#0277BD',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  featureTag: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#FFA000',
  },
  priceContainer: {
    marginTop: 8,
  },
  priceText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
  },
  descriptionText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  actionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  actionButton: {
    backgroundColor: '#003049',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default PartnerDetails;