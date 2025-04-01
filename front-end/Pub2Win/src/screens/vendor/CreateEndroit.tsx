import React, { useState } from 'react';
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
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';

// Define the navigation param list type
type RootStackParamList = {
  VendorPlace: undefined;
};

// Create a typed navigation prop
type CreateEndroitNavigationProp = StackNavigationProp<RootStackParamList>;

const CreateEndroit: React.FC = () => {
  const navigation = useNavigation<CreateEndroitNavigationProp>();
  const api = useApi();
  const { userId } = useAuth();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
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
      setLoading(true);
      
      // In a real app, you would upload the image to a server and get a URL back
      // For now, we'll just use a placeholder URL
      const imageUrl = image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24';
      
      const response = await api.post('/vendor/places', {
        userId,
        name,
        address,
        category,
        description,
        imageUrl,
      });
      
      if (response.data && response.data.success) {
        Alert.alert('Success', 'Your place has been added successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('VendorPlace') }
        ]);
      }
    } catch (error) {
      console.error('Error adding place:', error);
      Alert.alert('Error', 'Failed to add your place. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View>
            <Feather name="arrow-left" size={24} color="#003049" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajouter un endroit</Text>
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
              <Text style={styles.uploadText}>Ajouter une photo</Text>
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
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.submitButtonText}>Chargement...</Text>
          ) : (
            <Text style={styles.submitButtonText}>Ajouter l'endroit</Text>
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

export default CreateEndroit;   