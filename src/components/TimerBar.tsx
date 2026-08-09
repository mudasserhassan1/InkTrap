import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {UI} from '../theme/colors';

type Props = {
  progress: number;
};

function getFillColor(progress: number): string {
  if (progress <= 0.2) {
    return UI.danger;
  }
  if (progress <= 0.4) {
    return '#FFC107';
  }
  return UI.timerFill;
}

export function TimerBar({progress}: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (clamped > 0.15) {
      pulse.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [clamped, pulse]);

  const fillColor = getFillColor(clamped);

  return (
    <Animated.View style={[styles.track, {transform: [{scaleY: pulse}]}]}>
      <View style={[styles.fill, {width: `${clamped * 100}%`, backgroundColor: fillColor}]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: UI.timerTrack,
    borderRadius: 6,
    height: 10,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: 6,
    height: '100%',
  },
});
