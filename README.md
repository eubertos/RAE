# Resident's Adventure Engine (RAE)

RAE is a React Native app with a simple Node.js backend. It gamifies task management while letting you chat with a local "Mentor" assistant.

## Prerequisites
* Node.js 18+
* npm
* Expo CLI (`npm install -g expo-cli`)

## Installation
```sh
# install mobile dependencies
npm install --prefix app
# install backend dependencies
npm install --prefix server
```

## Running Tests
```sh
npm test --prefix app --silent
npm test --prefix server --silent
```

## Starting the Servers
1. Copy the example env file and add your OpenAI key:
   ```sh
   cp server/.env.example server/.env
   # edit server/.env and set OPENAI_API_KEY
   ```
2. Start the backend:
   ```sh
   npm start --prefix server
   ```
3. In another terminal start the Expo dev server:
   ```sh
   npm start --prefix app
   ```
   Use the Expo QR code or simulator to run the app.

## Building for Devices
Generate a preview build with [EAS Build](https://docs.expo.dev/build/introduction/):
```sh
npx eas build --profile preview --platform android   # or ios
```
The resulting APK/IPA can be sideloaded onto your device.

## Features Overview
* Swipeable task list with haptic feedback
* Mentor assistant chat with micro agents and file uploads
* Login and registration backed by the Node.js server
* Profile screen with theme selection and data export
* Over-the-air updates via Expo
* Scripts for design refinement and feedback reports
