import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import { chat as chatLLM } from '../api/openai';

export default function ChatScreen() {
  const { theme } = useContext(AppContext);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), from: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    try {
      setLoading(true);
      const botText = await chatLLM(userMsg.text);
      const botMsg = {
        id: Date.now().toString() + '-bot',
        from: 'bot',
        text: botText,
      };
      setMessages((m) => [...m, botMsg]);
    } catch (e) {
      const errMsg = { id: Date.now().toString() + '-err', from: 'bot', text: 'Error: ' + e.message };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.msg, item.from === 'user' ? styles.user : styles.bot]}>
      <Text style={styles.msgText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { borderColor: theme }]}
          value={input}
          onChangeText={setInput}
          placeholder="Ask the LLM"
        />
        <Button title={loading ? '...' : 'Send'} onPress={sendMessage} disabled={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  msg: {
    marginBottom: 8,
    padding: 10,
    borderRadius: 6,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#e0f7fa',
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f8e9',
  },
  msgText: {
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
  },
});
