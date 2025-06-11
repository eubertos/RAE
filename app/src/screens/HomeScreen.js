import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Button, Modal, ActivityIndicator, Pressable } from 'react-native';
import { AppContext } from '../context/AppContext';
import { ProgressBar } from '../components/ProgressBar';

export default function HomeScreen({ navigation }) {
  const {
    progress,
    tokens,
    tasks,
    pendingReward,
    claimReward,
    storyStep,
    storySegments,
    loading,
    error,
    theme,
  } = useContext(AppContext);
  const [showNarrative, setShowNarrative] = useState(true);
  const completed = tasks.filter((t) => t.completed).length;
  const nextMilestone = completed < 5 ? 5 : completed < 10 ? 10 : null;

  if (loading) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resident's Adventure Engine</Text>
      <ProgressBar progress={progress} color={theme} />
      <Text style={styles.tokens}>Tokens: {tokens}</Text>
      {nextMilestone && (
        <Text style={styles.milestone}>
          {5 - (completed % 5)} tasks until next reward!
        </Text>
      )}
      <Button
        title="View Tasks"
        onPress={() => navigation.navigate('Tasks')}
        accessibilityLabel="Go to tasks"
      />
      <Button
        title="Profile"
        onPress={() => navigation.navigate('Profile')}
        accessibilityLabel="Open profile screen"
      />
      <Button
        title="Chat"
        onPress={() => navigation.navigate('Chat')}
        accessibilityLabel="Open chat screen"
      />

      <Modal
        visible={!!pendingReward}
        transparent
        animationType="slide"
        onRequestClose={claimReward}
      >
        <Pressable style={styles.modalContent} onPress={claimReward}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{pendingReward}</Text>
            <Button title="Claim" onPress={claimReward} accessibilityLabel="Claim reward" />
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showNarrative && storyStep > 0}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNarrative(false)}
      >
        <Pressable
          style={styles.modalContent}
          onPress={() => setShowNarrative(false)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{storySegments[storyStep]}</Text>
            <Button title="Close" onPress={() => setShowNarrative(false)} accessibilityLabel="Close narrative" />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  tokens: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  milestone: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});
