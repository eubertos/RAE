import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function MentorMessageList({ messages }) {
  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.sender}>{item.sender}:</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  sender: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  text: {
    flex: 1,
  },
});
