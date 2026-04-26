# ShopApp

ShopApp is a React Native mobile application for small retail shops to manage products, sales, expenses, and day-to-day business tracking from a phone.

The project is currently focused on the MVP experience, with simple shop workflows and mobile-first screens for product management, sales entry, expense tracking, and reporting.

## Persistence

The app now uses an offline-first persistence model.

- SQLite is the local source of truth for reads and writes.
- Firestore is used as a background sync target when Firebase native configuration is present.
- If Firebase is unavailable, the app keeps working locally and retries sync later.

## Firebase Setup

To activate Firestore in the running app, add your Firebase project files:

- Android: place `google-services.json` in `android/app/`
- iOS: place `GoogleService-Info.plist` in `ios/ShopApp/`

You also need these project and build steps:

1. Create a Firebase project and register the Android app as `com.shopapp`.
2. Register the iOS app with the same bundle identifier used by Xcode for `ShopApp`.
3. In Firebase Console, enable Firestore Database for that project.
4. After adding `GoogleService-Info.plist`, run `cd ios && pod install`.
5. Rebuild the native apps after the config files are added.

This repository is already wired to use Firestore when Firebase native setup succeeds, and it will fall back to SQLite when Firebase is unavailable.
