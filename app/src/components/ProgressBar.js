import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { tokens } from '../../theme';

const ProgressBarBase = ({ progress, color = tokens.accent.success }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={styles.bar}
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(progress * 100), min: 0, max: 100 }}
    >
      <Animated.View
        style={[styles.progress, { width, backgroundColor: color }]}
      />
    </View>
  );
};

export const ProgressBar = React.memo(ProgressBarBase);

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    height: 10,
    backgroundColor: tokens.border.default,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});
