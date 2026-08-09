import {InterstitialAd, AdEventType} from 'react-native-google-mobile-ads';
import {AD_UNIT_IDS} from '../constants/ads';

let interstitial: InterstitialAd | null = null;

const LOAD_TIMEOUT_MS = 10_000;

function getInterstitial(): InterstitialAd {
  if (!interstitial) {
    interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial);
  }
  return interstitial;
}

export function preloadInterstitial(): void {
  getInterstitial().load();
}

export function showInterstitialIfReady(): Promise<boolean> {
  const ad = getInterstitial();

  return new Promise(resolve => {
    let settled = false;
    let adWasShown = false;
    let unsubscribeLoaded: (() => void) | undefined;
    let unsubscribeClosed: (() => void) | undefined;
    let loadTimeout: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      unsubscribeLoaded?.();
      unsubscribeClosed?.();
      if (loadTimeout) {
        clearTimeout(loadTimeout);
      }
    };

    const finish = (shown: boolean) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      ad.load();
      resolve(shown);
    };

    const attachCloseListener = () => {
      unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
        finish(adWasShown);
      });
    };

    const tryShow = () => {
      attachCloseListener();
      ad
        .show()
        .then(() => {
          adWasShown = true;
          if (loadTimeout) {
            clearTimeout(loadTimeout);
            loadTimeout = undefined;
          }
        })
        .catch(() => finish(false));
    };

    if (ad.loaded) {
      tryShow();
      return;
    }

    unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      unsubscribeLoaded?.();
      unsubscribeLoaded = undefined;
      tryShow();
    });

    ad.load();

    loadTimeout = setTimeout(() => {
      if (!adWasShown) {
        finish(false);
      }
    }, LOAD_TIMEOUT_MS);
  });
}
