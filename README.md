# Ink Trap (Color Rush)

Stroop-style color game for Android. Tap the **ink color**, not the word.

## Stack

- React Native 0.86 + TypeScript
- `@react-native-async-storage/async-storage` — best score persistence
- `react-native-google-mobile-ads` — banner, interstitial, rewarded continue

## Run locally

```sh
npm install
npm start
npm run android
```

For iOS (optional):

```sh
bundle install
bundle exec pod install --project-directory=ios
npm run ios
```

## Game rules

- 3 lives, 2.5s per prompt (speeds up −50ms per correct answer, floor 0.9s)
- Score ≥ 10 / 25 / 50 unlocks near-miss ink colors
- Game Over: Retry, Watch Ad to Continue (once per run), or Home

## Ads (dev)

Test AdMob IDs are used automatically in `__DEV__`. Production placeholders live in `src/constants/ads.ts` — replace before shipping.

| Placement | Type | Rule |
|-----------|------|------|
| Home + Game Over | Banner | Always |
| Retry from Game Over | Interstitial | Every 3rd finished run |
| Game Over | Rewarded | Continue with +1 life (once per run) |

## Android release signing

1. Generate a upload keystore:
   ```sh
   keytool -genkeypair -v -storetype PKCS12 -keystore inktrap-upload.keystore -alias inktrap -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Add to `android/gradle.properties` (do not commit secrets):
   ```
   INKTRAP_UPLOAD_STORE_FILE=inktrap-upload.keystore
   INKTRAP_UPLOAD_KEY_ALIAS=inktrap
   INKTRAP_UPLOAD_STORE_PASSWORD=***
   INKTRAP_UPLOAD_KEY_PASSWORD=***
   ```
3. Wire `signingConfigs.release` in `android/app/build.gradle` to use those values.
4. Build: `cd android && ./gradlew assembleRelease`

## Tests

```sh
npm test
```

Engine logic tests: `__tests__/engine.test.ts`

## Play Console checklist

- [ ] Create AdMob app for `com.inktrap.game`
- [ ] Replace prod unit IDs in `src/constants/ads.ts`
- [ ] Replace prod app IDs in `app.json` / `Info.plist`
- [ ] Add app icon and feature graphic
- [ ] Upload signed AAB
