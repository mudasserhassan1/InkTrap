const TEST_IDS = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
};

const PROD_IDS = {
  BANNER: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  INTERSTITIAL: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  REWARDED: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
};

const ids = __DEV__ ? TEST_IDS : PROD_IDS;

export const AD_UNIT_IDS = {
  banner: ids.BANNER,
  interstitial: ids.INTERSTITIAL,
  rewarded: ids.REWARDED,
};

export const INTERSTITIAL_EVERY_N_RUNS = 5;
export const INTERSTITIAL_MIN_SCORE = 3;

export type InterstitialContext = {
  runCount: number;
  score: number;
};

export function shouldShowInterstitial({
  runCount,
  score,
}: InterstitialContext): boolean {
  if (runCount < INTERSTITIAL_EVERY_N_RUNS) {
    return false;
  }
  if (runCount % INTERSTITIAL_EVERY_N_RUNS !== 0) {
    return false;
  }
  if (score < INTERSTITIAL_MIN_SCORE) {
    return false;
  }
  return true;
}
