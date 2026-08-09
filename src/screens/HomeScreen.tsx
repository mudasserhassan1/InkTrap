import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {AdBanner} from '../components/AdBanner';
import {COLOR_DEFINITIONS, UI} from '../theme/colors';

type Props = {
  bestScore: number;
  onPlay: () => void;
};

export function HomeScreen({bestScore, onPlay}: Props) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.titleWord, {color: COLOR_DEFINITIONS.blue.hex}]}>
            INK
          </Text>
          <Text style={[styles.titleWord, {color: COLOR_DEFINITIONS.red.hex}]}>
            TRAP
          </Text>
        </View>

        <Pressable
          onPress={onPlay}
          style={({pressed}) => [styles.playButton, pressed && styles.pressed]}>
          <Text style={styles.playText}>▶  PLAY</Text>
        </Pressable>

        <View style={styles.bestSection}>
          <Text style={styles.bestLabel}>BEST SCORE</Text>
          <Text style={styles.bestValue}>{bestScore}</Text>
        </View>

        <Pressable
          onPress={() => setShowHelp(true)}
          style={({pressed}) => [styles.helpLink, pressed && styles.pressed]}>
          <Text style={styles.helpText}>How to Play</Text>
        </Pressable>
      </View>

      <AdBanner />

      <Modal visible={showHelp} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>How to Play</Text>

            <View style={styles.demoCard}>
              <Text
                style={[styles.demoWord, {color: COLOR_DEFINITIONS.red.hex}]}>
                BLUE
              </Text>
              <Text style={styles.demoHint}>
                Word says BLUE, ink is RED → tap RED
              </Text>
            </View>

            <Text style={styles.modalBody}>
              • Tap the button matching the ink — ignore the word{'\n'}
              • You have 3 lives; wrong answers and timeouts cost a life{'\n'}
              • Each correct answer speeds up the timer{'\n'}
              • Score 10+ to unlock trickier near-miss colors
            </Text>
            <Pressable
              onPress={() => setShowHelp(false)}
              style={({pressed}) => [styles.playButton, pressed && styles.pressed]}>
              <Text style={styles.playText}>Got it</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: UI.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 12,
  },
  titleRow: {
    alignItems: 'center',
    marginBottom: 48,
  },
  titleWord: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 4,
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: UI.accent,
    borderRadius: 16,
    marginBottom: 32,
    paddingHorizontal: 48,
    paddingVertical: 20,
    width: '100%',
  },
  playText: {
    color: UI.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  bestSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bestLabel: {
    color: UI.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  bestValue: {
    color: UI.text,
    fontSize: 36,
    fontWeight: '900',
  },
  helpLink: {
    padding: 8,
  },
  helpText: {
    color: UI.textMuted,
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.85,
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: UI.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    color: UI.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  demoCard: {
    backgroundColor: UI.background,
    borderRadius: 16,
    marginBottom: 20,
    padding: 20,
  },
  demoWord: {
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoHint: {
    color: UI.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalBody: {
    color: UI.textMuted,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
});
