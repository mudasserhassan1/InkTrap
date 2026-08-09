import {
  INTERSTITIAL_EVERY_N_RUNS,
  INTERSTITIAL_MIN_SCORE,
  shouldShowInterstitial,
} from '../src/constants/ads';

describe('shouldShowInterstitial', () => {
  it('skips before 5 runs', () => {
    expect(shouldShowInterstitial({runCount: 4, score: 10})).toBe(false);
  });

  it('skips when not every Nth run', () => {
    expect(shouldShowInterstitial({runCount: 2, score: 10})).toBe(false);
  });

  it('skips low score runs', () => {
    expect(
      shouldShowInterstitial({
        runCount: INTERSTITIAL_EVERY_N_RUNS,
        score: INTERSTITIAL_MIN_SCORE - 1,
      }),
    ).toBe(false);
  });

  it('shows on every 5th play again with enough score', () => {
    expect(
      shouldShowInterstitial({
        runCount: INTERSTITIAL_EVERY_N_RUNS,
        score: INTERSTITIAL_MIN_SCORE,
      }),
    ).toBe(true);
  });
});
