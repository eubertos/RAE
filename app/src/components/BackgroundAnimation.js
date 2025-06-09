import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { AppContext } from '../context/AppContext';

const remoteSource = {
  uri: 'https://assets10.lottiefiles.com/packages/lf20_u4yrau.json',
};

export default function BackgroundAnimation() {
  const { animationEnabled } = useContext(AppContext);
  if (!animationEnabled) return null;
  return (
    <LottieView
      source={remoteSource}
      autoPlay
      loop
      style={[StyleSheet.absoluteFill, styles.anim]}
      resizeMode="cover"
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  anim: { zIndex: -1 },
});
