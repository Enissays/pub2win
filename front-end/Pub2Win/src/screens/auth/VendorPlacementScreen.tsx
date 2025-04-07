import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '@clerk/clerk-expo';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  RegisterVender: undefined;
  VendorPlacement: undefined;
};

type VendorPlacementScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VendorPlacement'>;

interface VendorPlacementScreenProps {
  navigation: VendorPlacementScreenNavigationProp;
}

type BusinessCategory = 'Restaurant' | 'Bar' | 'Cafe' | null;

const VendorPlacementScreen: React.FC<VendorPlacementScreenProps> = ({ navigation }) => {
  const [category, setCategory] = useState<BusinessCategory>(null);
  const [businessName, setBusinessName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const dispatch = useAppDispatch();
  const api = useApi();
  const { userId, getToken } = useAuth();
  
  const handleCategorySelect = (selected: BusinessCategory) => {
    setCategory(selected);
  };
  
  const handleAddPhotos = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'You need to grant permission to access your photos');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotos([...photos, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  const handleSubmit = async () => {
    if (!category) {
      Alert.alert('Error', 'Please select a business category');
      return;
    }
    
    if (!businessName) {
      Alert.alert('Error', 'Please enter your business name');
      return;
    }
    
    if (!description) {
      Alert.alert('Error', 'Please provide a description of your business');
      return;
    }
    
    if (!address) {
      Alert.alert('Error', 'Please enter your business address');
      return;
    }
    
    if (!acceptTerms) {
      Alert.alert('Error', 'You must accept the terms and conditions');
      return;
    }
    
    setLoading(true);
    
    try {
      // Get auth token
      const token = await getToken();
      
      // Create form data for image upload
      const formData = new FormData();
      
      // Add images to form data
      photos.forEach((photo, index) => {
        const filename = photo.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append('photos', {
          uri: photo,
          name: filename,
          type,
        } as any);
      });
      
      // Add other data
      formData.append('nom', businessName);
      formData.append('description', description);
      formData.append('adresse', address);
      formData.append('type', category);
      formData.append('userId', userId || '');
      
      // Send data to backend
      const response = await api.post('/endroit/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setLoading(false);
      
      if (response.data && response.data.success) {
        Alert.alert(
          'Success',
          'Your business has been registered successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home')
            }
          ]
        );
      } else {
        Alert.alert('Error', response.data?.message || 'Failed to register your business. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting business data:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to register your business. Please try again.');
    }
  };
  
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Feather name="chevron-left" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoButton}>
              <Feather name="info" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          {/* Title */}
          <Text style={styles.title}>Ajoutez Votre Placement Des Maintenant !</Text>
          
          {/* Category Selection */}
          <View style={styles.categoryContainer}>
            <TouchableOpacity 
              style={[
                styles.categoryButton, 
                category === 'Restaurant' && styles.categoryButtonSelected
              ]}
              onPress={() => handleCategorySelect('Restaurant')}
            >
              <Text style={styles.categoryText}>Restaurant</Text>
              {category === 'Restaurant' && (
                <View style={styles.categoryCheckmark}>
                  <Feather name="check" size={16} color="#00BCD4" />
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryButton, 
                category === 'Bar' && styles.categoryButtonSelected
              ]}
              onPress={() => handleCategorySelect('Bar')}
            >
              <Text style={styles.categoryText}>Bar</Text>
              {category === 'Bar' && (
                <View style={styles.categoryCheckmark}>
                  <Feather name="check" size={16} color="#00BCD4" />
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryButton, 
                category === 'Cafe' && styles.categoryButtonSelected
              ]}
              onPress={() => handleCategorySelect('Cafe')}
            >
              <Text style={styles.categoryText}>Café</Text>
              {category === 'Cafe' && (
                <View style={styles.categoryCheckmark}>
                  <Feather name="check" size={16} color="#00BCD4" />
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Selected Category Display */}
          {category && (
            <View style={styles.selectedCategoryContainer}>
              <Text style={styles.selectedCategoryText}>{category}</Text>
            </View>
          )}
          
          {/* Business Name */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nom*"
              value={businessName}
              onChangeText={setBusinessName}
              editable={!loading}
            />
          </View>
          
          {/* Description */}
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description*"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              editable={!loading}
            />
          </View>
          
          {/* Address */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Addresse*"
              value={address}
              onChangeText={setAddress}
              editable={!loading}
            />
          </View>
          
          {/* Photo Upload */}
          <TouchableOpacity 
            style={styles.photoUploadContainer}
            onPress={handleAddPhotos}
            disabled={loading}
          >
            <Feather name="image" size={24} color="#999" />
            <Text style={styles.photoUploadText}>Ajouter des photos</Text>
            <Text style={styles.photoUploadSubtext}>Format: PNG, JPG, JPEG and SVG</Text>
          </TouchableOpacity>
          
          {/* Photo Preview */}
          {photos.length > 0 && (
            <View style={styles.photoPreviewContainer}>
              {photos.map((photo, index) => (
                <Image 
                  key={index}
                  source={{ uri: photo }}
                  style={styles.photoPreview}
                />
              ))}
            </View>
          )}
          
          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={[
                styles.checkbox, 
                acceptTerms ? styles.checkboxChecked : {}
              ]}
              onPress={() => setAcceptTerms(!acceptTerms)}
              disabled={loading}
            >
              {acceptTerms && <Feather name="check" size={14} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              J'accepte les <Text style={styles.termsLink}>politiques</Text> et <Text style={styles.termsLink}>conditions d'utilisations</Text>
            </Text>
          </View>
          
          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Ajouter</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  infoButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#E0F7FA',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: '#B2EBF2',
  },
  categoryText: {
    color: '#0D3B56',
    fontFamily: 'Montserrat',
    fontSize: 14,
  },
  categoryCheckmark: {
    marginLeft: 5,
  },
  selectedCategoryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedCategoryText: {
    fontFamily: 'Montserrat',
    color: '#333',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  textAreaContainer: {
    height: 100,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoUploadContainer: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderStyle: 'dashed',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  photoUploadText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  photoUploadSubtext: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  photoPreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 5,
    margin: 5,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00BCD4',
    borderColor: '#00BCD4',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  termsLink: {
    color: '#00BCD4',
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: '#0D3B56',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});

export default VendorPlacementScreen;