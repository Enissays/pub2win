import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './InfluencerDashboard';

type InfluencerSettingsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'InfluencerSettings'>;

const InfluencerSettings: React.FC = () => {
  const navigation = useNavigation<InfluencerSettingsNavigationProp>();

  const settingsOptions = [
    { icon: 'user', title: 'Edit Profile', screen: 'EditProfile' },
    { icon: 'lock', title: 'Privacy & Security', screen: 'PrivacySettings' },
    { icon: 'credit-card', title: 'Payment Methods', screen: 'PaymentSettings' },
    { icon: 'bell', title: 'Notification Preferences', screen: 'NotificationSettings' },
    { icon: 'globe', title: 'Language', screen: 'LanguageSettings' },
    { icon: 'help-circle', title: 'Help Center', screen: 'InfluencerHelp' },
    { icon: 'log-out', title: 'Log Out', screen: 'Logout' },
  ];

  const handleOptionPress = (screen: string) => {
    console.log(`Navigate to ${screen}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#003049" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} /> {/* Empty view for alignment */}
      </View>

      <ScrollView style={styles.content}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.optionItem}
            onPress={() => handleOptionPress(option.screen)}
          >
            <View style={styles.optionLeft}>
              <Feather name={option.icon as any} size={20} color="#003049" />
              <Text style={styles.optionText}>{option.title}</Text>
            </View>
            <View>
              <Feather name="chevron-right" size={20} color="#AAAAAA" />
            </View>
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#333333',
    marginLeft: 16,
  },
});

export default InfluencerSettings;