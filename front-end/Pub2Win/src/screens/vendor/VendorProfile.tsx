import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '@clerk/clerk-expo';
import { StackNavigationProp } from '@react-navigation/stack';
// Define the navigation param list type
type RootStackParamList = {
    VendorDashboard: undefined;
    Chat: undefined;
    VendorPlace: undefined;
    VendorProfile: undefined;
    CreateEndroit: undefined;
  };
  
  // Create a typed navigation prop
type VendorProfileNavigationProp = StackNavigationProp<RootStackParamList>;
  
interface VendorProfileData {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  siret: string;
  profileImage: string;
  notificationSettings: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

const VendorProfile: React.FC = () => {
  const navigation = useNavigation<VendorProfileNavigationProp>();
  const api = useApi();
  const { userId, signOut } = useAuth();
  
  // Use the typed navigation
  const [profileData, setProfileData] = useState<VendorProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/vendor/profile?userId=${userId}`);
        
        if (response.data && response.data.success) {
          setProfileData(response.data.vendor);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        Alert.alert('Error', 'Failed to load your profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
    
    // For demo purposes, set sample data if none is returned
    if (!profileData) {
      const sampleData: VendorProfileData = {
        id: '1',
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        address: '123 Rue de Paris, 75001 Paris',
        company: 'Café Parisien',
        siret: '123 456 789 00012',
        profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        notificationSettings: {
          email: true,
          push: true,
          sms: false,
        },
      };
      setProfileData(sampleData);
    }
  }, [userId]);
  
  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log('Edit profile');
  };
  
  const handleToggleNotification = async (type: 'email' | 'push' | 'sms', value: boolean) => {
    if (!profileData) return;
    
    try {
      const response = await api.put(`/vendor/profile/notifications`, {
        userId,
        type,
        value,
      });
      
      if (response.data && response.data.success) {
        setProfileData(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            notificationSettings: {
              ...prev.notificationSettings,
              [type]: value,
            },
          };
        });
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          onPress: () => signOut(),
          style: 'destructive',
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <Feather name="edit-2" size={24} color="#003049" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ 
              uri: profileData?.profileImage || 'https://via.placeholder.com/150' 
            }} 
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profileData?.prenom} {profileData?.nom}
            </Text>
            <Text style={styles.profileCompany}>{profileData?.company}</Text>
          </View>
        </View>
        
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          <View style={styles.infoItem}>
            <Feather name="mail" size={20} color="#003049" />
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profileData?.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Feather name="phone" size={20} color="#003049" />
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>{profileData?.phone}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Feather name="map-pin" size={20} color="#003049" />
            <Text style={styles.infoLabel}>Adresse</Text>
            <Text style={styles.infoValue}>{profileData?.address}</Text>
          </View>
        </View>
        
        {/* Business Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations professionnelles</Text>
          
          <View style={styles.infoItem}>
            <Feather name="briefcase" size={20} color="#003049" />
            <Text style={styles.infoLabel}>Entreprise</Text>
            <Text style={styles.infoValue}>{profileData?.company}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Feather name="file-text" size={20} color="#003049" />
            <Text style={styles.infoLabel}>SIRET</Text>
            <Text style={styles.infoValue}>{profileData?.siret}</Text>
          </View>
        </View>
        
        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres de notification</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Feather name="mail" size={20} color="#003049" />
              <Text style={styles.settingLabel}>Notifications par email</Text>
            </View>
            <Switch
              value={profileData?.notificationSettings.email}
              onValueChange={(value) => handleToggleNotification('email', value)}
              trackColor={{ false: '#CCCCCC', true: '#003049' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Feather name="bell" size={20} color="#003049" />
              <Text style={styles.settingLabel}>Notifications push</Text>
            </View>
            <Switch
              value={profileData?.notificationSettings.push}
              onValueChange={(value) => handleToggleNotification('push', value)}
              trackColor={{ false: '#CCCCCC', true: '#003049' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Feather name="smartphone" size={20} color="#003049" />
              <Text style={styles.settingLabel}>Notifications SMS</Text>
            </View>
            <Switch
              value={profileData?.notificationSettings.sms}
              onValueChange={(value) => handleToggleNotification('sms', value)}
              trackColor={{ false: '#CCCCCC', true: '#003049' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color="#F44336" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
      
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
          onPress={() => navigation.navigate('VendorPlace')}
        >
          <Feather name="map-pin" size={24} color="#AAAAAA" />
          <Text style={styles.navText}>My place</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
        >
          <Feather name="user" size={24} color="#003049" />
          <Text style={[styles.navText, styles.navTextActive]}>Profile</Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#003049',
    marginBottom: 4,
  },
  profileCompany: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#003049',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: '#333333',
    width: 80,
    marginLeft: 12,
  },
  infoValue: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: '#F44336',
    marginLeft: 8,
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

export default VendorProfile;