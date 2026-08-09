import AsyncStorage from '@react-native-async-storage/async-storage';

const BEST_SCORE_KEY = '@inktrap/best_score';
const RUN_COUNT_KEY = '@inktrap/run_count';

export async function getBestScore(): Promise<number> {
  const value = await AsyncStorage.getItem(BEST_SCORE_KEY);
  return value ? parseInt(value, 10) : 0;
}

export async function saveBestScore(score: number): Promise<number> {
  const current = await getBestScore();
  if (score > current) {
    await AsyncStorage.setItem(BEST_SCORE_KEY, String(score));
    return score;
  }
  return current;
}

export async function getRunCount(): Promise<number> {
  const value = await AsyncStorage.getItem(RUN_COUNT_KEY);
  return value ? parseInt(value, 10) : 0;
}

export async function incrementRunCount(): Promise<number> {
  const count = (await getRunCount()) + 1;
  await AsyncStorage.setItem(RUN_COUNT_KEY, String(count));
  return count;
}

export async function resetRunCount(): Promise<void> {
  await AsyncStorage.setItem(RUN_COUNT_KEY, '0');
}
