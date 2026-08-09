#!/bin/bash
# Regenerate launcher icons from assets/icon/icon-master.png (macOS sips)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MASTER="$ROOT/assets/icon/icon-master.png"
ANDROID_RES="$ROOT/android/app/src/main/res"
IOS_ICON="$ROOT/ios/ColorRush/Images.xcassets/AppIcon.appiconset"

if [[ ! -f "$MASTER" ]]; then
  echo "Missing $MASTER"
  exit 1
fi

resize() {
  local size=$1
  local out=$2
  sips -z "$size" "$size" "$MASTER" --out "$out" >/dev/null
}

# Android mipmap densities
resize 48  "$ANDROID_RES/mipmap-mdpi/ic_launcher.png"
resize 48  "$ANDROID_RES/mipmap-mdpi/ic_launcher_round.png"
resize 72  "$ANDROID_RES/mipmap-hdpi/ic_launcher.png"
resize 72  "$ANDROID_RES/mipmap-hdpi/ic_launcher_round.png"
resize 96  "$ANDROID_RES/mipmap-xhdpi/ic_launcher.png"
resize 96  "$ANDROID_RES/mipmap-xhdpi/ic_launcher_round.png"
resize 144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher.png"
resize 144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_round.png"
resize 192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher.png"
resize 192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_round.png"

# Android splash logo (centered on native splash)
mkdir -p "$ANDROID_RES/drawable-nodpi"
resize 256 "$ANDROID_RES/drawable-nodpi/splash_logo.png"

# iOS App Icon set
mkdir -p "$IOS_ICON"
resize 40  "$IOS_ICON/Icon-20@2x.png"
resize 60  "$IOS_ICON/Icon-20@3x.png"
resize 58  "$IOS_ICON/Icon-29@2x.png"
resize 87  "$IOS_ICON/Icon-29@3x.png"
resize 80  "$IOS_ICON/Icon-40@2x.png"
resize 120 "$IOS_ICON/Icon-40@3x.png"
resize 120 "$IOS_ICON/Icon-60@2x.png"
resize 180 "$IOS_ICON/Icon-60@3x.png"
resize 1024 "$IOS_ICON/Icon-1024.png"

echo "Icons generated."
