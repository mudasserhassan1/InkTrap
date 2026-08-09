import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import mobileAds from 'react-native-google-mobile-ads';
import {shouldShowInterstitial} from './src/constants/ads';
import {applyContinue, createSession} from './src/game/engine';
import type {GameSession, Screen} from './src/game/types';
import {GameOverScreen} from './src/screens/GameOverScreen';
import {GameScreen} from './src/screens/GameScreen';
import {HomeScreen} from './src/screens/HomeScreen';
import {
  preloadInterstitial,
  showInterstitialIfReady,
} from './src/services/interstitialAd';
import {useRewardedAd} from './src/services/rewardedAd';
import {
  getBestScore,
  incrementRunCount,
  resetRunCount,
  saveBestScore,
} from './src/services/scoreStorage';
import {SplashScreen as AnimatedSplash} from './src/components/SplashScreen';
import {UI} from './src/theme/colors';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<Screen>('home');
  const [session, setSession] = useState<GameSession>(createSession());
  const [finishedRunScore, setFinishedRunScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [adsReady, setAdsReady] = useState(false);
  const {loaded: rewardedLoaded, show: showRewarded} = useRewardedAd();

  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => {
        setAdsReady(true);
        preloadInterstitial();
      })
      .catch(() => setAdsReady(true));
  }, []);

  useEffect(() => {
    getBestScore().then(setBestScore);
  }, []);

  const startNewRun = useCallback(() => {
    setScreen('game');
    setSession(createSession());
  }, []);

  const handleGameOver = useCallback((finalSession: GameSession) => {
    setFinishedRunScore(finalSession.score);
    setSession(finalSession);
    setScreen('gameOver');
    saveBestScore(finalSession.score).then(setBestScore);
  }, []);

  const handleRetry = useCallback(async () => {
    const runCount = await incrementRunCount();
    const showAd =
      shouldShowInterstitial({runCount, score: finishedRunScore}) && adsReady;

    if (showAd) {
      const adShown = await showInterstitialIfReady();
      if (adShown) {
        await resetRunCount();
      }
    }

    startNewRun();
  }, [adsReady, finishedRunScore, startNewRun]);

  const handleContinue = useCallback(async () => {
    const earned = await showRewarded();
    if (!earned) {
      return;
    }
    const continued = applyContinue(session);
    setSession(continued);
    setScreen('game');
  }, [session, showRewarded]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={UI.background} />
      {showSplash ? (
        <AnimatedSplash onFinish={() => setShowSplash(false)} />
      ) : (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          {screen === 'home' && (
            <HomeScreen bestScore={bestScore} onPlay={startNewRun} />
          )}
          {screen === 'game' && (
            <GameScreen
              session={session}
              onSessionChange={setSession}
              onGameOver={handleGameOver}
            />
          )}
          {screen === 'gameOver' && (
            <GameOverScreen
              score={finishedRunScore}
              bestScore={bestScore}
              canContinue={!session.hasUsedContinue}
              rewardedLoaded={rewardedLoaded}
              onRetry={handleRetry}
              onContinue={handleContinue}
            />
          )}
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: UI.background,
    flex: 1,
  },
});

export default App;
