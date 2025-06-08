import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function MicroAgentList({ agents }) {
  return (
    <FlatList
      data={agents}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<Text style={styles.header}>Micro Agents</Text>}
      renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  item: {
    paddingVertical: 2,
  },
});
