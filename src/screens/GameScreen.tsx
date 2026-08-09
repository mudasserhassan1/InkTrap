import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ColorButton, type ButtonFeedback} from '../components/ColorButton';
import {TimerBar} from '../components/TimerBar';
import {
  applyCorrect,
  applyWrong,
  checkAnswer,
  isGameOver,
} from '../game/engine';
import type {ColorId, GameSession} from '../game/types';
import {COLOR_DEFINITIONS, UI} from '../theme/colors';

const FEEDBACK_MS = 650;

type FeedbackKind = 'correct' | 'wrong' | 'timeout' | null;

type Props = {
  session: GameSession;
  onSessionChange: (session: GameSession) => void;
  onGameOver: (session: GameSession) => void;
};

function getButtonFeedback(
  colorId: ColorId,
  feedback: FeedbackKind,
  selected: ColorId | null,
  correctInk: ColorId,
): ButtonFeedback {
  if (!feedback || feedback === 'correct') {
    return 'none';
  }
  if (colorId === correctInk) {
    return 'correctReveal';
  }
  if (feedback === 'wrong' && colorId === selected) {
    return 'wrongPick';
  }
  return 'none';
}

function getFeedbackMessage(
  feedback: FeedbackKind,
  ink: ColorId,
): string {
  if (feedback === 'timeout') {
    return 'Too slow!';
  }
  if (feedback === 'wrong') {
    return `Ink was ${COLOR_DEFINITIONS[ink].label}`;
  }
  return ' ';
}

export function GameScreen({session, onSessionChange, onGameOver}: Props) {
  const [remainingMs, setRemainingMs] = useState(session.timeLimitMs);
  const [feedback, setFeedback] = useState<FeedbackKind>(null);
  const [lastSelected, setLastSelected] = useState<ColorId | null>(null);
  const [locked, setLocked] = useState(false);
  const [displayLives, setDisplayLives] = useState(session.lives);

  const startTimeRef = useRef(Date.now());
  const rafRef = useRef<number | null>(null);
  const advancingRef = useRef(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptEpochRef = useRef(0);
  const sessionRef = useRef(session);
  const onSessionChangeRef = useRef(onSessionChange);
  const onGameOverRef = useRef(onGameOver);

  sessionRef.current = session;
  onSessionChangeRef.current = onSessionChange;
  onGameOverRef.current = onGameOver;

  const prompt = session.currentPrompt;
  const round = session.round;

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  const resetTimer = useCallback((limitMs: number) => {
    startTimeRef.current = Date.now();
    setRemainingMs(limitMs);
  }, []);

  const scheduleAdvance = useCallback(
    (next: GameSession, delayMs: number) => {
      clearAdvanceTimer();
      const epoch = promptEpochRef.current;

      advanceTimerRef.current = setTimeout(() => {
        advanceTimerRef.current = null;
        advancingRef.current = false;

        if (epoch !== promptEpochRef.current) {
          return;
        }

        if (isGameOver(next)) {
          onGameOverRef.current(next);
        } else {
          onSessionChangeRef.current(next);
        }
      }, delayMs);
    },
    [clearAdvanceTimer],
  );

  useEffect(() => {
    promptEpochRef.current += 1;
    setDisplayLives(session.lives);
    resetTimer(session.timeLimitMs);
    setLocked(false);
    setFeedback(null);
    setLastSelected(null);
    advancingRef.current = false;
  }, [round, session.timeLimitMs, resetTimer]);

  useEffect(
    () => () => {
      clearAdvanceTimer();
    },
    [clearAdvanceTimer],
  );

  const handleTimeout = useCallback(() => {
    if (advancingRef.current) {
      return;
    }
    advancingRef.current = true;
    setLocked(true);
    setFeedback('timeout');
    setLastSelected(null);

    const next = applyWrong(sessionRef.current);
    setDisplayLives(next.lives);
    scheduleAdvance(next, FEEDBACK_MS);
  }, [scheduleAdvance]);

  const handleAnswer = useCallback(
    (selected: ColorId) => {
      if (!prompt || advancingRef.current) {
        return;
      }

      advancingRef.current = true;
      setLocked(true);
      setLastSelected(selected);

      if (checkAnswer(prompt, selected)) {
        setFeedback('correct');
        scheduleAdvance(applyCorrect(sessionRef.current), 200);
      } else {
        setFeedback('wrong');
        const next = applyWrong(sessionRef.current);
        setDisplayLives(next.lives);
        scheduleAdvance(next, FEEDBACK_MS);
      }
    },
    [prompt, scheduleAdvance],
  );

  useEffect(() => {
    if (!prompt || locked) {
      return;
    }

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const left = Math.max(0, session.timeLimitMs - elapsed);
      setRemainingMs(left);

      if (left <= 0) {
        handleTimeout();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [prompt, session.timeLimitMs, locked, handleTimeout]);

  if (!prompt) {
    return null;
  }

  const progress = remainingMs / session.timeLimitMs;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.lives}>
          {Array.from({length: 3}).map((_, index) => (
            <Text
              key={index}
              style={[
                styles.heart,
                index >= displayLives && styles.heartEmpty,
              ]}>
              ♥
            </Text>
          ))}
        </View>
        <Text style={styles.headerValue}>{session.score}</Text>
      </View>

      <View style={styles.timerSection}>
        <TimerBar progress={progress} />
      </View>

      <View style={styles.promptSection}>
        <Text style={styles.instruction}>Tap the ink color</Text>
        <Text
          style={[
            styles.promptWord,
            {color: COLOR_DEFINITIONS[prompt.ink].hex},
          ]}>
          {COLOR_DEFINITIONS[prompt.word].label}
        </Text>
        <Text
          style={[
            styles.feedbackHint,
            !feedback && styles.feedbackHidden,
          ]}>
          {getFeedbackMessage(feedback, prompt.ink)}
        </Text>
      </View>

      <View style={styles.grid}>
        {prompt.options.map(colorId => (
          <ColorButton
            key={colorId}
            colorId={colorId}
            disabled={locked}
            feedback={getButtonFeedback(
              colorId,
              feedback,
              lastSelected,
              prompt.ink,
            )}
            onPress={() => handleAnswer(colorId)}
            style={styles.gridButton}
          />
        ))}
      </View>

      <Pressable
        onPress={() => onGameOverRef.current(sessionRef.current)}
        style={styles.quit}>
        <Text style={styles.quitText}>Quit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: UI.background,
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerValue: {
    color: UI.text,
    fontSize: 32,
    fontWeight: '900',
  },
  lives: {
    flexDirection: 'row',
    gap: 6,
  },
  heart: {
    color: UI.danger,
    fontSize: 24,
  },
  heartEmpty: {
    opacity: 0.25,
  },
  timerSection: {
    marginBottom: 32,
  },
  promptSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  instruction: {
    color: UI.textMuted,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  promptWord: {
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 64,
  },
  feedbackHint: {
    color: UI.danger,
    fontSize: 15,
    fontWeight: '700',
    height: 24,
    lineHeight: 24,
    marginTop: 16,
    textAlign: 'center',
  },
  feedbackHidden: {
    opacity: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  gridButton: {
    flexBasis: '47%',
    maxWidth: '47%',
  },
  quit: {
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
  },
  quitText: {
    color: UI.textMuted,
    fontSize: 14,
  },
});
