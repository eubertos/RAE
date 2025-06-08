import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  LayoutAnimation,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { RectButton } from 'react-native-gesture-handler';
import { AppContext } from '../context/AppContext';

export default function TaskScreen() {
  const { tasks, toggleTask, postponeTask } = useContext(AppContext);

  const handleToggle = (id, subId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleTask(id, subId);
  };

  const renderLeft = (id) => (
    <RectButton
      style={[styles.action, styles.done]}
      onPress={() => handleToggle(id)}
      accessibilityLabel="Mark task done"
    >
      <Text style={styles.actionText}>Done</Text>
    </RectButton>
  );

  const renderRight = (id) => (
    <RectButton
      style={[styles.action, styles.postpone]}
      onPress={() => postponeTask(id)}
      accessibilityLabel="Postpone task"
    >
      <Text style={styles.actionText}>Postpone</Text>
    </RectButton>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Swipeable
            renderLeftActions={() => renderLeft(item.id)}
            renderRightActions={() => renderRight(item.id)}
          >
            <View style={styles.item}>
              <Pressable
                onPress={() => handleToggle(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Toggle ${item.name}`}
              >
                <Text style={[styles.text, item.completed && styles.completed]}>
                  {item.name} ({item.assignedTo})
                </Text>
                <Text style={styles.meta}>
                  Due: {item.dueDate} | Priority: {item.priority}
                </Text>
              </Pressable>
              {item.subtasks.map((sub) => (
                <Pressable
                  key={sub.id}
                  onPress={() => handleToggle(item.id, sub.id)}
                  style={styles.subItem}
                  accessibilityRole="button"
                  accessibilityLabel={`Toggle ${sub.name}`}
                >
                  <Text
                    style={[styles.subText, sub.completed && styles.completed]}
                  >
                    - {sub.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Swipeable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  subItem: {
    paddingLeft: 20,
  },
  text: {
    fontSize: 18,
  },
  subText: {
    fontSize: 16,
  },
  meta: {
    fontSize: 12,
    color: '#555',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  actionText: {
    color: '#fff',
  },
  done: {
    backgroundColor: '#4caf50',
  },
  postpone: {
    backgroundColor: '#ff9800',
  },
});
