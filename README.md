# ShopApp

ShopApp is a React Native mobile application for small retail shops to manage products, sales, expenses, and day-to-day business tracking from a phone.

The project is currently focused on the MVP experience, with simple shop workflows and mobile-first screens for product management, sales entry, expense tracking, and reporting.

## Persistence

The app now uses an offline-first persistence model.

- SQLite is the local source of truth for reads and writes.
- Firestore is used as a background sync target when Firebase native configuration is present.
- If Firebase is unavailable, the app keeps working locally and retries sync later.
