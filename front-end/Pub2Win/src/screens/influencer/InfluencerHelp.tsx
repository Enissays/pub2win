import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './InfluencerDashboard';

type InfluencerHelpNavigationProp = NativeStackNavigationProp<RootStackParamList, 'InfluencerHelp'>;

const InfluencerHelp: React.FC = () => {
  const navigation = useNavigation<InfluencerHelpNavigationProp>();

  const helpTopics = [
    {
      title: 'Getting Started',
      items: [
        'How to create your influencer profile',
        'Understanding your dashboard',
        'How to connect with partners',
      ],
    },
    {
      title: 'Points & Rewards',
      items: [
        'How points work',
        'Redeeming your rewards',
        'Understanding your ranking',
      ],
    },
    {
      title: 'Account & Security',
      items: [
        'Updating your profile',
        'Changing your password',
        'Privacy settings',
      ],
    },
  ];

  const contactMethods = [
    {
      icon: 'mail',
      title: 'Email Us',
      action: () => Linking.openURL('mailto:support@influenceapp.com'),
    },
    {
      icon: 'message-circle',
      title: 'Live Chat',
      action: () => navigation.navigate('Chat'),
    },
    {
      icon: 'phone',
      title: 'Call Support',
      action: () => Linking.openURL('tel:+1234567890'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#003049" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 24 }} /> {/* For alignment */}
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>How can we help you?</Text>
        
        {/* Search Box */}
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color="#AAAAAA" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search help topics...</Text>
        </View>

        {/* Help Topics */}
        {helpTopics.map((topic, index) => (
          <View key={index} style={styles.topicSection}>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            {topic.items.map((item, itemIndex) => (
              <TouchableOpacity key={itemIndex} style={styles.topicItem}>
                <Text style={styles.topicItemText}>{item}</Text>
                <Feather name="chevron-right" size={20} color="#AAAAAA" />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Contact Methods */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Still need help?</Text>
        <Text style={styles.sectionSubtitle}>Contact our support team</Text>
        
        <View style={styles.contactMethods}>
          {contactMethods.map((method, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.contactMethod}
              onPress={method.action}
            >
              <View style={styles.contactIcon}>
                <Feather name={method.icon as any} size={20} color="#00BCD4" />
              </View>
              <Text style={styles.contactText}>{method.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#003049',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#AAAAAA',
  },
  topicSection: {
    marginBottom: 24,
  },
  topicTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  topicItemText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
  },
  contactMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  contactMethod: {
    alignItems: 'center',
    width: '30%',
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E6F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
});

export default InfluencerHelp;