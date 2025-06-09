import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const initialTasks = [
  {
    id: 1,
    name: 'Pack water and food',
    assignedTo: 'Ethan',
    dueDate: '2025-07-01',
    priority: 'high',
    completed: false,
    subtasks: [
      { id: '1a', name: 'Gather bottles', completed: false },
      { id: '1b', name: 'Fill water tank', completed: false },
    ],
  },
  {
    id: 2,
    name: 'Check solar panels',
    assignedTo: 'Lauren',
    dueDate: '2025-07-03',
    priority: 'medium',
    completed: false,
    subtasks: [],
  },
  {
    id: 3,
    name: 'Test generator',
    assignedTo: 'Ethan',
    dueDate: '2025-07-05',
    priority: 'high',
    completed: false,
    subtasks: [
      { id: '3a', name: 'Check fuel', completed: false },
    ],
  },
  {
    id: 4,
    name: 'Organize medical supplies',
    assignedTo: 'Lauren',
    dueDate: '2025-07-07',
    priority: 'low',
    completed: false,
    subtasks: [],
  },
];

const initialUsers = [
  { name: 'Ethan', tasksCompleted: 0, preference: '' },
  { name: 'Lauren', tasksCompleted: 0, preference: '' },
];

const initialAnalytics = {
  tasksCompleted: 0,
  rewardsClaimed: 0,
};

const initialNotificationSettings = {
  hour: 9,
  minute: 0,
  frequency: 'daily',
};

const storySegments = [
  'The journey begins. Ethan and Lauren feel the thrill of the open road.',
  'With your first milestone complete, the adventure starts to take shape.',
  'You are seasoned travelers now, ready for the challenges ahead.',
];

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [tokens, setTokens] = useState(0);
  const [storyStep, setStoryStep] = useState(0);
  const [users, setUsers] = useState(initialUsers);
  const [pendingReward, setPendingReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [theme, setTheme] = useState('#4caf50');
  const [feedbackLogs, setFeedbackLogs] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState(
    initialNotificationSettings
  );
  const claimReward = () => {
    setPendingReward(null);
    setAnalytics((a) => ({ ...a, rewardsClaimed: a.rewardsClaimed + 1 }));
  };

  useEffect(() => {
    const load = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        const storedAnalytics = await AsyncStorage.getItem('analytics');
        const storedTheme = await AsyncStorage.getItem('theme');
        const storedNotify = await AsyncStorage.getItem('notify');
        const storedFeedback = await AsyncStorage.getItem('feedbackLogs');
        const storedTokens = await AsyncStorage.getItem('tokens');
        if (storedTasks) setTasks(JSON.parse(storedTasks));
        if (storedAnalytics) setAnalytics(JSON.parse(storedAnalytics));
        if (storedTheme) setTheme(storedTheme);
        if (storedNotify) setNotificationSettings(JSON.parse(storedNotify));
        if (storedFeedback) setFeedbackLogs(JSON.parse(storedFeedback));
        if (storedTokens) setTokens(JSON.parse(storedTokens));
      } catch (e) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
        await AsyncStorage.setItem('analytics', JSON.stringify(analytics));
        await AsyncStorage.setItem('theme', theme);
        await AsyncStorage.setItem('notify', JSON.stringify(notificationSettings));
        await AsyncStorage.setItem('feedbackLogs', JSON.stringify(feedbackLogs));
        await AsyncStorage.setItem('tokens', JSON.stringify(tokens));
      } catch (e) {
        setError('Failed to save data');
      }
    };
    if (!loading) save();
  }, [tasks, analytics, theme, notificationSettings, feedbackLogs, tokens, loading]);

  const updatePreference = (name, preference) => {
    setUsers((prev) =>
      prev.map((u) => (u.name === name ? { ...u, preference } : u))
    );
  };

  const updateNotificationSettings = (settings) => {
    setNotificationSettings(settings);
  };

  const logFeedback = () => {
    setFeedbackLogs((logs) => [...logs, Date.now()]);
  };

  useEffect(() => {
    const schedule = async () => {
      try {
        await Notifications.requestPermissionsAsync();
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Adventure awaits!',
            body: 'Complete your tasks today!',
          },
          trigger: {
            hour: notificationSettings.hour,
            minute: notificationSettings.minute,
            repeats: notificationSettings.frequency === 'daily',
          },
        });
      } catch (e) {
        console.log('Notification scheduling failed', e);
      }
    };
    schedule();
  }, [notificationSettings]);

  const postponeTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              dueDate: new Date(
                new Date(t.dueDate).getTime() + 86400000
              )
                .toISOString()
                .split('T')[0],
            }
          : t
      )
    );
  };

  const toggleTask = (taskId, subId) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== taskId) return t;
        if (subId) {
          const subtasks = t.subtasks.map((s) =>
            s.id === subId ? { ...s, completed: !s.completed } : s
          );
          const allDone = subtasks.every((s) => s.completed);
          return { ...t, subtasks, completed: allDone ? true : t.completed };
        }
        return { ...t, completed: !t.completed };
      });

      // update user stats
      const before = prev.find((x) => x.id === taskId);
      const after = updated.find((x) => x.id === taskId);
      if (before && after && before.completed !== after.completed) {
        if (!before.completed && after.completed) {
          setAnalytics((a) => ({ ...a, tasksCompleted: a.tasksCompleted + 1 }));
        }
        setUsers((u) =>
          u.map((usr) =>
            usr.name === before.assignedTo
              ? {
                  ...usr,
                  tasksCompleted: usr.tasksCompleted +
                    (after.completed ? 1 : -1),
                }
              : usr
          )
        );
      }

      const current = prev.find((x) => x.id === taskId);
      if (current) {
        if (subId) {
          const sub = current.subtasks.find((s) => s.id === subId);
          if (sub && !sub.completed) setTokens((p) => p + 5);
        } else if (!current.completed) {
          setTokens((p) => p + 10);
        }
      }

      const completedCount = updated.filter((t) => t.completed).length;
      if (completedCount === 5) {
        setTokens((p) => p + 20);
        setPendingReward('Milestone reached! +20 tokens');
        setStoryStep(1);
      }
      if (completedCount === 10) {
        setTokens((p) => p + 50);
        setPendingReward('Another milestone! +50 tokens');
        setStoryStep(2);
      }

      return updated;
    });
  };

  const progress = React.useMemo(
    () => tasks.filter((t) => t.completed).length / tasks.length,
    [tasks]
  );

  return (
    <AppContext.Provider
      value={{
        tasks,
        toggleTask,
        tokens,
        progress,
        storyStep,
        storySegments,
        users,
        updatePreference,
        postponeTask,
        pendingReward,
        claimReward,
        loading,
        error,
        theme,
        setTheme,
        analytics,
        feedbackLogs,
        notificationSettings,
        updateNotificationSettings,
        logFeedback,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
