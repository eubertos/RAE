import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { MentorContext } from '../context/MentorContext';
import MentorMessageList from '../components/MentorMessageList';
import MicroAgentList from '../components/MicroAgentList';
import FileUploader from '../components/FileUploader';

export default function MentorScreen() {
  const { messages, agents, sendMessage, addAgent } = useContext(MentorContext);
  const [input, setInput] = useState('');
  const [agentName, setAgentName] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleAddAgent = () => {
    if (!agentName.trim()) return;
    addAgent(agentName.trim());
    setAgentName('');
  };

  const handleUpload = async () => {
    // actual storage handled elsewhere
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
