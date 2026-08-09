jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('lottie-react-native', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    __esModule: true,
    default: React.forwardRef(({onAnimationFinish}: {onAnimationFinish?: () => void}, _ref: unknown) => {
      React.useEffect(() => {
        onAnimationFinish?.();
      }, [onAnimationFinish]);
      return <View />;
    }),
  };
});

jest.mock('react-native-google-mobile-ads', () => {
  const mockAd = () => ({
    loaded: false,
    load: jest.fn(),
    show: jest.fn(() => Promise.resolve()),
    addAdEventListener: jest.fn(() => jest.fn()),
  });

  return {
    __esModule: true,
    default: jest.fn(() => ({
      initialize: jest.fn(() => Promise.resolve()),
    })),
    BannerAd: 'BannerAd',
    BannerAdSize: {ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER'},
    InterstitialAd: {
      createForAdRequest: jest.fn(mockAd),
    },
    RewardedAd: {
      createForAdRequest: jest.fn(mockAd),
    },
    AdEventType: {
      LOADED: 'loaded',
      CLOSED: 'closed',
    },
    RewardedAdEventType: {
      LOADED: 'loaded',
      EARNED_REWARD: 'earned_reward',
    },
  };
});
