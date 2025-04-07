import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './InfluencerDashboard';

type InfluencerNotificationsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'InfluencerNotifications'>;

const InfluencerNotifications: React.FC = () => {
  const navigation = useNavigation<InfluencerNotificationsNavigationProp>();

  const notifications = [
    {
      id: '1',
      title: 'New Partnership Opportunity',
      message: 'Le Vingt 4 is looking for influencers in your area',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      title: 'Points Updated',
      message: 'You earned 5 points from your visit to Ivory',
      time: '1 day ago',
      read: true,
    },
    {
      id: '3',
      title: 'Weekly Ranking Update',
      message: 'You moved up to #8 in the influencer rankings this week!',
      time: '3 days ago',
      read: true,
    },
    {
      id: '4',
      title: 'New Feature Available',
      message: 'Check out our new analytics dashboard for influencers',
      time: '1 week ago',
      read: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#003049" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {notifications.map((notification) => (
          <TouchableOpacity 
            key={notification.id} 
            style={[
              styles.notificationItem,
              !notification.read && styles.unreadNotification
            ]}
          >
            <View style={styles.notificationIcon}>
              <Feather name="bell" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
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
  clearText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#00BCD4',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  unreadNotification: {
    backgroundColor: '#F8F9FF',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#003049',
    marginBottom: 4,
  },
  notificationMessage: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  notificationTime: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#AAAAAA',
  },
});

export default InfluencerNotifications;