import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import type {ColorId} from '../game/types';
import {COLOR_DEFINITIONS, UI} from '../theme/colors';

export type ButtonFeedback = 'none' | 'wrongPick' | 'correctReveal';

type Props = {
  colorId: ColorId;
  onPress: () => void;
  disabled?: boolean;
  feedback?: ButtonFeedback;
  style?: ViewStyle;
};

export function ColorButton({
  colorId,
  onPress,
  disabled,
  feedback = 'none',
  style,
}: Props) {
  const {hex, label} = COLOR_DEFINITIONS[colorId];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({pressed}) => [
        styles.button,
        {backgroundColor: hex},
        feedback === 'wrongPick' && styles.wrongPick,
        feedback === 'correctReveal' && styles.correctReveal,
        pressed && feedback === 'none' && styles.pressed,
        disabled && feedback === 'none' && styles.disabled,
        style,
      ]}>
      <View style={styles.inner}>
        <Text style={styles.label}>{label}</Text>
        {feedback === 'wrongPick' && <Text style={styles.markWrong}>✕</Text>}
        {feedback === 'correctReveal' && (
          <Text style={styles.markCorrect}>✓</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'transparent',
    flex: 1,
    minHeight: 72,
    overflow: 'hidden',
  },
  inner: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 12,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  wrongPick: {
    borderColor: UI.danger,
    opacity: 1,
  },
  correctReveal: {
    borderColor: UI.success,
    opacity: 1,
  },
  markWrong: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  markCorrect: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  pressed: {
    opacity: 0.85,
    transform: [{scale: 0.97}],
  },
  disabled: {
    opacity: 0.5,
  },
});
