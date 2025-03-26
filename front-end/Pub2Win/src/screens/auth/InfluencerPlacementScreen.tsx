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
import { useAuth } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateProfileRequest, updateProfileSuccess, updateProfileFailure } from '../../store/slices/authSlice';
import { useApi } from '../../hooks/useApi';
import * as ImagePicker from 'expo-image-picker';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  RegisterInfluencer: undefined;
  InfluencerPlacement: undefined;
};

type InfluencerPlacementNavigationProp = StackNavigationProp<RootStackParamList, 'InfluencerPlacement'>;

interface InfluencerPlacementScreenProps {
  navigation: InfluencerPlacementNavigationProp;
}

const InfluencerPlacementScreen: React.FC<InfluencerPlacementScreenProps> = ({ navigation }) => {
  const [bio, setBio] = useState<string>('');
  const [instagramLink, setInstagramLink] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  // Available interest categories
  const availableInterests = ['Restaurant', 'Bar', 'Café'];
  
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const { isLoaded, userId, getToken } = useAuth();
  const api = useApi();
  
  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(item => item !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };
  
  const handleAddLink = () => {
    // For now, just a placeholder for adding more social media links
    Alert.alert('Add Link', 'This feature will allow adding more social media links');
  };
  
  const handleChoosePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'You need to grant permission to access your photos');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  const handleComplete = async () => {
    if (!isLoaded || !userId) {
      Alert.alert('Error', 'Authentication system is not ready. Please try again.');
      return;
    }

    if (!bio) {
      Alert.alert('Error', 'Please add a bio');
      return;
    }

    if (interests.length === 0) {
      Alert.alert('Error', 'Please select at least one interest');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'You must accept the terms and conditions');
      return;
    }

    try {
      dispatch(updateProfileRequest());
      
      // Get the token for API authorization
      const token = await getToken();
      
      // Create form data for image upload
      const formData = new FormData();
      
      // Add profile photo if selected
      if (profilePhoto) {
        const filename = profilePhoto.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append('profilePhoto', {
          uri: profilePhoto,
          name: filename,
          type,
        } as any);
      }
      
      // Add other data
      formData.append('bio', bio);
      formData.append('instagram', instagramLink);
      formData.append('interests', JSON.stringify(interests));
      formData.append('userId', userId);
      
      // Make API call to your backend
      const response = await api.post('/influencer/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.data && response.data.success) {
        // Update Redux store with profile info
        dispatch(updateProfileSuccess(response.data.influencer));
        
        // Navigate to home or dashboard
        navigation.navigate('Home');
      } else {
        throw new Error(response.data?.message || 'Failed to update profile');
      }
      
    } catch (err: any) {
      console.error("Error updating profile:", err);
      dispatch(updateProfileFailure(err.message || "An error occurred during profile update"));
      Alert.alert('Error', err.message || 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header with back button and info */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="chevron-left" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="info" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          {/* Profile Photo */}
          <View style={styles.photoContainer}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.photoImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Feather name="user" size={40} color="#8A7FD6" />
              </View>
            )}
            <TouchableOpacity style={styles.photoButton} onPress={handleChoosePhoto}>
              <Text style={styles.photoButtonText}>Choisir une photo</Text>
            </TouchableOpacity>
          </View>
          
          {/* Bio */}
          <View style={styles.inputSection}>
            <TextInput
              style={styles.bioInput}
              placeholder="Bio"
              value={bio}
              onChangeText={setBio}
              multiline
              editable={!loading}
            />
          </View>
          
          {/* Interests */}
          <View style={styles.interestsSection}>
            <Text style={styles.sectionTitle}>
              Aidez-nous à trouver ce qui vous intéresse le plus, dans l'ordre que vous désirez*
            </Text>
            
            <View style={styles.interestTags}>
              {availableInterests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestTag,
                    interests.includes(interest) ? styles.interestTagSelected : {}
                  ]}
                  onPress={() => toggleInterest(interest)}
                  disabled={loading}
                >
                  <Text 
                    style={[
                      styles.interestTagText,
                      interests.includes(interest) ? styles.interestTagTextSelected : {}
                    ]}
                  >
                    {interest}
                  </Text>
                  {interests.includes(interest) && (
                    <View style={styles.interestRank}>
                      <Text style={styles.interestRankText}>
                        {interests.indexOf(interest) + 1}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Selected Interests */}
          {interests.length > 0 && (
            <View style={styles.selectedInterests}>
              {interests.map((interest, index) => (
                <View key={interest} style={styles.selectedInterestItem}>
                  <Text style={styles.selectedInterestRank}>{index + 1}</Text>
                  <Text style={styles.selectedInterestText}>{interest}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Social Media */}
          <View style={styles.socialSection}>
            <Text style={styles.sectionTitle}>
              Associez votre compte Instagram à P2W pour vérifier vos stories et remporter des récompenses*
            </Text>
            
            <View style={styles.socialInput}>
              {/* <Image 
                source={require('../../assets/instagram-icon.png')} 
                style={styles.socialIcon}
              /> */}
              <Feather name='instagram' ></Feather>
              <TextInput
                style={styles.socialTextInput}
                placeholder="www.instagram.com/test_1"
                value={instagramLink}
                onChangeText={setInstagramLink}
                editable={!loading}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.addLinkButton}
              onPress={handleAddLink}
            >
              <Text style={styles.addLinkText}>Ajoutez autres liens</Text>
              <Feather name="plus-circle" size={20} color="#00BCD4" />
            </TouchableOpacity>
          </View>
          
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
          
          {/* Error message */}
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          {/* Complete Button */}
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleComplete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.completeButtonText}>Ajouter</Text>
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
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0DCFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    // backgroundColor: '#E0DCFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoButton: {
    backgroundColor: '#0D3B56',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Montserrat',
  },
  inputSection: {
    marginBottom: 20,
  },
  bioInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: 'Montserrat',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  interestsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontFamily: 'Montserrat',
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  interestTagSelected: {
    backgroundColor: '#E0DCFC',
    borderColor: '#8A7FD6',
  },
  interestTagText: {
    color: '#666',
    fontFamily: 'Montserrat',
  },
  interestTagTextSelected: {
    color: '#8A7FD6',
    fontWeight: '500',
  },
  interestRank: {
    backgroundColor: '#8A7FD6',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  interestRankText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedInterests: {
    marginBottom: 20,
  },
  selectedInterestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  selectedInterestRank: {
    backgroundColor: '#8A7FD6',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    color: '#FFFFFF',
    marginRight: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedInterestText: {
    color: '#333',
    fontFamily: 'Montserrat',
  },
  socialSection: {
    marginBottom: 20,
  },
  socialInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 10,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialTextInput: {
    flex: 1,
    fontFamily: 'Montserrat',
  },
  addLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  addLinkText: {
    color: '#00BCD4',
    marginRight: 5,
    fontFamily: 'Montserrat',
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'Montserrat',
  },
  completeButton: {
    backgroundColor: '#0D3B56',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});

export default InfluencerPlacementScreen;