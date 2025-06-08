import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { MentorContext } from '../context/MentorContext';
import { AuthContext } from '../context/AuthContext';
import * as Haptics from 'expo-haptics';
import MentorMessageList from '../components/MentorMessageList';
import MicroAgentList from '../components/MicroAgentList';
import FileUploader from '../components/FileUploader';

export default function MentorScreen() {
  const { messages, agents, sendMessage, addAgent, setAllMessages } = useContext(MentorContext);
  const { token } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const [agentName, setAgentName] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:3001/messages', {
          headers: { Authorization: token },
        });
        const data = await res.json();
        const msgs = data.map((m) => ({ id: m.id, sender: m.username, text: m.text }));
        setAllMessages(msgs);
      } catch (e) {
        console.log('fetch messages failed', e);
      }
    };
    fetchMessages();
  }, [token]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    if (token) {
      fetch('http://localhost:3001/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ text: input.trim() }),
      }).catch((e) => console.log('send failed', e));
    }
    Haptics.selectionAsync();
    setInput('');
  };

  const handleAddAgent = () => {
    if (!agentName.trim()) return;
    addAgent(agentName.trim());
    Haptics.selectionAsync();
    setAgentName('');
  };

  const handleUpload = async (file) => {
    if (!token || !file) return;
    try {
      const form = new FormData();
      form.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
      });
      await fetch('http://localhost:3001/files', {
        method: 'POST',
        headers: { Authorization: token },
        body: form,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.log('upload failed', e);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <View style={styles.container}>
      <MentorMessageList messages={messages} />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask Mentor..."
        />
        <Pressable style={styles.button} onPress={handleSend} accessibilityLabel="Send message">
          <Text style={styles.buttonText}>Send</Text>
        </Pressable>
      </View>

      <View style={styles.agentRow}>
        <TextInput
          style={styles.input}
          value={agentName}
          onChangeText={setAgentName}
          placeholder="New micro agent name"
        />
        <Pressable style={styles.button} onPress={handleAddAgent} accessibilityLabel="Add agent">
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>

      <MicroAgentList agents={agents} />
      <FileUploader onUpload={handleUpload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  button: {
    padding: 10,
    backgroundColor: '#2196f3',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
  },
  upload: {
    marginTop: 20,
  },
});
