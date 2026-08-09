import {useCallback, useEffect, useRef, useState} from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads';
import {AD_UNIT_IDS} from '../constants/ads';

function createRewardedAd(): RewardedAd {
  return RewardedAd.createForAdRequest(AD_UNIT_IDS.rewarded);
}

export function useRewardedAd() {
  const adRef = useRef<RewardedAd>(createRewardedAd());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ad = adRef.current;

    const unsubscribeLoaded = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => setLoaded(true),
    );

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      ad.load();
    });

    ad.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const show = useCallback(
    (): Promise<boolean> =>
      new Promise(resolve => {
        const ad = adRef.current;

        if (!loaded) {
          resolve(false);
          return;
        }

        let rewarded = false;

        const unsubscribeEarned = ad.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          () => {
            rewarded = true;
          },
        );

        const unsubscribeClosed = ad.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            unsubscribeEarned();
            unsubscribeClosed();
            resolve(rewarded);
          },
        );

        ad.show();
      }),
    [loaded],
  );

  return {loaded, show};
}
