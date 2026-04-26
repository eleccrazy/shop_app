# ShopApp

ShopApp is a React Native mobile application for small retail shops to manage products, sales, expenses, and day-to-day business tracking from a phone.

The project is currently focused on the MVP experience, with simple shop workflows and mobile-first screens for product management, sales entry, expense tracking, and reporting.

## Persistence

The app now supports a Firestore-backed persistence adapter with SQLite fallback.

- If Firebase native configuration is present, the app will use Firestore.
- If Firebase is not configured yet, the app falls back to the existing local SQLite storage.

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
