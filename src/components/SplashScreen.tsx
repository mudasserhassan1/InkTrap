import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {UI} from '../theme/colors';

type Props = {
  onFinish: () => void;
};

const MIN_SPLASH_MS = 2200;

export function SplashScreen({onFinish}: Props) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [readyToExit, setReadyToExit] = useState(false);
  const startTimeRef = useRef(Date.now());

  const finishSplash = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) {
        onFinish();
      }
    });
  };

  useEffect(() => {
    if (!readyToExit) {
      return;
    }
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);
    const timer = setTimeout(finishSplash, remaining);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToExit]);

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <LottieView
        source={require('../../assets/animations/ink-trap-splash.json')}
        autoPlay
        loop={false}
        resizeMode="contain"
        style={styles.lottie}
        onAnimationFinish={() => setReadyToExit(true)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: UI.background,
    flex: 1,
  },
  lottie: {
    flex: 1,
    width: '100%',
  },
});
