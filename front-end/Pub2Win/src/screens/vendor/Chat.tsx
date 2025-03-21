import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '@clerk/clerk-expo';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

const Chat: React.FC = () => {
  const navigation = useNavigation();
  const api = useApi();
  const { userId } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch chat messages
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/vendor/messages?userId=${userId}`);
        
        if (response.data && response.data.success) {
          setMessages(response.data.messages || []);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // For demo purposes, add some sample messages if none are returned
    if (messages.length === 0) {
      const sampleMessages: Message[] = [
        {
          id: '1',
          text: 'Bonjour! Comment puis-je vous aider aujourd\'hui?',
          sender: 'other',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '2',
          text: 'Je voudrais en savoir plus sur les abonnements premium.',
          sender: 'user',
          timestamp: new Date(Date.now() - 3000000),
        },
        {
          id: '3',
          text: 'Bien sûr! Nous proposons deux formules: Standard à 29.99€/mois et Omega Premium à 49.99€/mois avec 20% de réduction actuellement.',
          sender: 'other',
          timestamp: new Date(Date.now() - 2400000),
        },
      ];
      setMessages(sampleMessages);
    }
  }, [userId]);
  
  const sendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, message]);
    setNewMessage('');
    
    try {
      await api.post('/vendor/messages', {
        userId,
        message: newMessage,
      });
      
      // Simulate response for demo purposes
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.',
          sender: 'other',
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, responseMessage]);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.otherMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{formatTime(new Date(item.timestamp))}</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#003049" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Chat</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        inverted={false}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Tapez votre message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
          disabled={newMessage.trim() === ''}
        >
          <Feather 
            name="send" 
            size={20} 
            color={newMessage.trim() === '' ? '#CCCCCC' : '#FFFFFF'} 
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#003049',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  messageTime: {
    fontFamily: 'Montserrat',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#333333',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#003049',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default Chat;