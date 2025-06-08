const React = require('react');
const { createContext, useEffect, useState } = React;
const AsyncStorage = require('@react-native-async-storage/async-storage');

const MentorContext = createContext();

const MentorProvider = ({ children }) => {
  const [messages, setMessages] = useState([]); // {id, sender, text}
  const [agents, setAgents] = useState([]); // {id, name}

  useEffect(() => {
    const load = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem('mentorMessages');
        const storedAgents = await AsyncStorage.getItem('mentorAgents');
        if (storedMessages) setMessages(JSON.parse(storedMessages));
        if (storedAgents) setAgents(JSON.parse(storedAgents));
      } catch (e) {
        console.log('Mentor load failed', e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem('mentorMessages', JSON.stringify(messages));
        await AsyncStorage.setItem('mentorAgents', JSON.stringify(agents));
      } catch (e) {
        console.log('Mentor save failed', e);
      }
    };
    save();
  }, [messages, agents]);

  const sendMessage = (text, sender = 'user') => {
    const msg = { id: Date.now().toString(), sender, text };
    setMessages((m) => [...m, msg]);
  };

  const addAgent = (name) => {
    const agent = { id: Date.now().toString(), name };
    setAgents((a) => [...a, agent]);
  };

  const setAllMessages = (list) => setMessages(list);

  const value = {
    messages,
    agents,
    sendMessage,
    addAgent,
    setAllMessages,
  };

  return React.createElement(MentorContext.Provider, { value }, children);
};

module.exports = {
  MentorContext,
  MentorProvider,
};
