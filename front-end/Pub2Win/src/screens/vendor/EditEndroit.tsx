import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';

// Define the navigation param list type
type RootStackParamList = {
  VendorPlace: undefined;
  EditEndroit: { placeId: string };
};

// Create a typed navigation prop
type EditEndroitNavigationProp = StackNavigationProp<RootStackParamList>;
type EditEndroitRouteProp = RouteProp<RootStackParamList, 'EditEndroit'>;

interface Place {
  id: string;
  name: string;
  address: string;
  category: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

const EditEndroit: React.FC = () => {
  const navigation = useNavigation<EditEndroitNavigationProp>();
  const route = useRoute<EditEndroitRouteProp>();
  const { placeId } = route.params;
  const api = useApi();
  const { userId } = useAuth();
  
  const [place, setPlace] = useState<Place | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const categories = [
    'Restaurant',
    'Café',
    'Bar',
    'Retail',
    'Hotel',
    'Spa',
    'Gym',
    'Other'
  ];
  
  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/vendor/places/${placeId}`);
        
        if (response.data && response.data.success) {
          const placeData = response.data.place;
          setPlace(placeData);
          setName(placeData.name);
          setAddress(placeData.address);
          setCategory(placeData.category);
          setDescription(placeData.description || '');
          setImage(placeData.imageUrl);
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
        Alert.alert('Error', 'Failed to load place details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlaceDetails();
    
    // For demo purposes, set sample data if API call fails
    setTimeout(() => {
      if (loading) {
        const samplePlace = {
          id: placeId,
          name: 'Café Parisien',
          address: '123 Rue de Paris, 75001 Paris',
          category: 'Restaurant',
          description: 'A cozy café in the heart of Paris.',
          imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
          isActive: true,
        };
        setPlace(samplePlace);
        setName(samplePlace.name);
        setAddress(samplePlace.address);
        setCategory(samplePlace.category);
        setDescription(samplePlace.description);
        setImage(samplePlace.imageUrl);
        setLoading(false);
      }
    }, 2000);
  }, [placeId]);
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload images.');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const handleSubmit = async () => {
    if (!name || !address || !category) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    try {
      setSaving(true);
      
      // In a real app, you would upload the image to a server and get a URL back
      const imageUrl = image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24';
      
      const response = await api.put(`/vendor/places/${placeId}`, {
        name,
        address,
        category,
        description,
        imageUrl,
      });
      
      if (response.data && response.data.success) {
        Alert.alert('Success', 'Your place has been updated successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('VendorPlace') }
        ]);
      }
    } catch (error) {
      console.error('Error updating place:', error);
      Alert.alert('Error', 'Failed to update your place. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View>
              <Feather name="arrow-left" size={24} color="#003049" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modifier l'endroit</Text>
          <View style={{ width: 24 }} /> {/* For alignment */}
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#003049" />
          <Text style={styles.loadingText}>Chargement des détails...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View>
            <Feather name="arrow-left" size={24} color="#003049" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier l'endroit</Text>
        <View style={{ width: 24 }} /> {/* For alignment */}
      </View>
      
      <ScrollView style={styles.content}>
        {/* Image Upload */}
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <View>
                <Feather name="image" size={40} color="#AAAAAA" />
              </View>
              <Text style={styles.uploadText}>Modifier la photo</Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Form Fields */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nom de l'endroit *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Café Parisien"
            placeholderTextColor="#AAAAAA"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Adresse *</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Ex: 123 Rue de Paris, 75001 Paris"
            placeholderTextColor="#AAAAAA"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Catégorie *</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez votre endroit..."
            placeholderTextColor="#AAAAAA"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <TouchableOpacity
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <Text style={styles.submitButtonText}>Enregistrement...</Text>
          ) : (
            <Text style={styles.submitButtonText}>Enregistrer les modifications</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#003049',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageUpload: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EEEEEE',
    borderStyle: 'dashed',
    borderRadius: 10,
  },
  uploadText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#AAAAAA',
    marginTop: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#003049',
  },
  categoryText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#003049',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#AAAAAA',
  },
  submitButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default EditEndroit;