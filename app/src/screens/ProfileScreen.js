import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  Pressable,
  Share,
  Linking,
} from 'react-native';
import { AppContext } from '../context/AppContext';

export default function ProfileScreen() {
  const {
    tokens,
    progress,
    users,
    updatePreference,
    setTheme,
    theme,
    analytics,
    tasks,
    notificationSettings,
    updateNotificationSettings,
    feedbackLogs,
    logFeedback,
    animationEnabled,
    setAnimationEnabled,
  } = useContext(AppContext);

  const [hour, setHour] = useState(notificationSettings.hour.toString());
  const [minute, setMinute] = useState(notificationSettings.minute.toString());
  const [frequency, setFrequency] = useState(notificationSettings.frequency);

  const saveNotification = () => {
    updateNotificationSettings({
      hour: parseInt(hour, 10) || 0,
      minute: parseInt(minute, 10) || 0,
      frequency,
    });
  };

  const exportCSV = async () => {
    const header = 'Task,Completed\n';
    const rows = tasks
      .map((t) => `${t.name},${t.completed}`)
      .join('\n');
    await Share.share({ message: header + rows });
  };

  const exportJSON = async () => {
    const data = JSON.stringify({ analytics, tasks }, null, 2);
    await Share.share({ message: data });
  };

  const exportFeedbackLogs = async () => {
    const data = JSON.stringify(feedbackLogs, null, 2);
    await Share.share({ message: data });
  };

  const openFeedback = () => {
    logFeedback();
    Linking.openURL('https://example.com/feedback');
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Tokens: {tokens}</Text>
      <Text>Progress: {(progress * 100).toFixed(0)}%</Text>
      {users.map((u) => (
        <View key={u.name} style={styles.userSection}>
          <Text style={styles.userName}>{u.name}</Text>
          <Text>Completed: {u.tasksCompleted}</Text>
          <TextInput
            style={styles.input}
            placeholder="Preference"
            value={u.preference}
            onChangeText={(text) => updatePreference(u.name, text)}
          />
        </View>
      ))}

      <View style={styles.analytics}>
        <Text>All-time tasks completed: {analytics.tasksCompleted}</Text>
        <Text>Rewards claimed: {analytics.rewardsClaimed}</Text>
        <Text>Feedback submissions: {feedbackLogs.length}</Text>
        {feedbackLogs.length > 0 && (
          <Text>
            Last feedback:{' '}
            {new Date(feedbackLogs[feedbackLogs.length - 1]).toLocaleDateString()}
          </Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Background Animation</Text>
      <Switch
        value={animationEnabled}
        onValueChange={setAnimationEnabled}
        accessibilityLabel="Toggle background animation"
      />

      <Text style={styles.sectionTitle}>Theme</Text>
      <View style={styles.themeRow}>
        {['#4caf50', '#2196f3', '#ff9800'].map((c) => (
          <Pressable
            key={c}
            style={[styles.colorBox, { backgroundColor: c }, theme === c && styles.colorSelected]}
            onPress={() => setTheme(c)}
            accessibilityRole="button"
            accessibilityLabel={`Select ${c} theme`}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Daily Reminder</Text>
      <View style={styles.notifyRow}>
        <TextInput
          style={styles.inputSmall}
          value={hour}
          keyboardType="number-pad"
          onChangeText={setHour}
          accessibilityLabel="Reminder hour"
        />
        <Text style={styles.colon}>:</Text>
        <TextInput
          style={styles.inputSmall}
          value={minute}
          keyboardType="number-pad"
          onChangeText={setMinute}
          accessibilityLabel="Reminder minute"
        />
        <TextInput
          style={[styles.inputSmall, { flex: 1 }]}
          value={frequency}
          onChangeText={setFrequency}
          accessibilityLabel="Reminder frequency"
        />
      </View>
      <Pressable style={styles.button} onPress={saveNotification} accessibilityRole="button" accessibilityLabel="Save reminder settings">
        <Text style={styles.buttonText}>Save Reminder</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={exportCSV} accessibilityRole="button" accessibilityLabel="Export data as CSV">
        <Text style={styles.buttonText}>Export CSV</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={exportJSON} accessibilityRole="button" accessibilityLabel="Export data as JSON">
        <Text style={styles.buttonText}>Export JSON</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={exportFeedbackLogs}
        accessibilityRole="button"
        accessibilityLabel="Export feedback logs"
      >
        <Text style={styles.buttonText}>Export Feedback</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={openFeedback} accessibilityRole="button" accessibilityLabel="Open feedback form">
        <Text style={styles.buttonText}>Send Feedback</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  userSection: {
    marginVertical: 10,
    width: '80%',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginTop: 5,
  },
  analytics: {
    marginVertical: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
  },
  themeRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  colorBox: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
    borderRadius: 4,
  },
  colorSelected: {
    borderWidth: 2,
    borderColor: '#000',
  },
  notifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 40,
    textAlign: 'center',
    marginHorizontal: 2,
  },
  colon: {
    paddingHorizontal: 2,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
