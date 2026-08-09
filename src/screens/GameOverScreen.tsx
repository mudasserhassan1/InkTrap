import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {AdBanner} from '../components/AdBanner';
import {UI} from '../theme/colors';

type Props = {
  score: number;
  bestScore: number;
  canContinue: boolean;
  rewardedLoaded: boolean;
  onRetry: () => void;
  onContinue: () => void;
};

export function GameOverScreen({
  score,
  bestScore,
  canContinue,
  rewardedLoaded,
  onRetry,
  onContinue,
}: Props) {
  const isNewBest = score >= bestScore && score > 0;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>OUT OF INK</Text>

        <View style={styles.scoreHero}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreLabel}>SCORE</Text>
          {isNewBest ? (
            <Text style={styles.newBest}>New Best!</Text>
          ) : (
            <Text style={styles.bestLine}>Best: {bestScore}</Text>
          )}
        </View>

        {canContinue && score > 0 && (
          <Text style={styles.continueHint}>
            Keep your {score} point{score === 1 ? '' : 's'} with one more life
          </Text>
        )}

        <Pressable
          onPress={onRetry}
          style={({pressed}) => [styles.retryButton, pressed && styles.pressed]}>
          <Text style={styles.retryText}>Play again</Text>
          <Text style={styles.retrySubtext}>Start over · score resets</Text>
        </Pressable>

        {canContinue && (
          <Pressable
            onPress={onContinue}
            disabled={!rewardedLoaded}
            style={({pressed}) => [
              styles.continueButton,
              !rewardedLoaded && styles.disabled,
              pressed && rewardedLoaded && styles.pressed,
            ]}>
            {rewardedLoaded ? (
              <View style={styles.continueContent}>
                <Text style={styles.continueTitle}>Keep score · Watch ad</Text>
                <Text style={styles.continueSub}>Get +1 life and continue</Text>
              </View>
            ) : (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={UI.text} size="small" />
                <Text style={styles.continueTitle}>Loading ad…</Text>
              </View>
            )}
          </Pressable>
        )}
      </View>

      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: UI.background,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 12,
  },
  subtitle: {
    color: UI.textMuted,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreHero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreValue: {
    color: UI.text,
    fontSize: 72,
    fontWeight: '900',
    lineHeight: 80,
  },
  scoreLabel: {
    color: UI.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4,
  },
  newBest: {
    color: UI.success,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
  bestLine: {
    color: UI.textMuted,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  continueHint: {
    color: UI.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    alignItems: 'center',
    backgroundColor: UI.accent,
    borderRadius: 16,
    marginBottom: 12,
    paddingVertical: 18,
  },
  retryText: {
    color: UI.text,
    fontSize: 18,
    fontWeight: '800',
  },
  retrySubtext: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  continueButton: {
    alignItems: 'center',
    backgroundColor: '#FF9800',
    borderRadius: 16,
    paddingVertical: 16,
  },
  continueContent: {
    alignItems: 'center',
  },
  continueTitle: {
    color: UI.text,
    fontSize: 16,
    fontWeight: '800',
  },
  continueSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  loadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.85,
  },
});
