# Resident's Adventure Engine (RAE)

RAE is a gamified task management app built with React Native and Expo. It helps Ethan and Lauren prepare for their boondocking adventure through engaging tasks, rewards and narrative unlocks.

## Setup

1. Install dependencies:
   ```sh
   cd RAE/app    # from repository parent directory
   npm install
   ```
2. Start the development server:
   ```sh
   npm start
   ```
3. Run the Jest test suite (optional):
   ```sh
   npm test
   ```
   This launches the Expo dev server where you can run the app on iOS, Android or web.

## Core Features

- **Interactive tasks** with due dates, priority and subtasks.
- **Progress tracking** and token rewards.
- **Narrative unlocks** when hitting milestones.
- **Profile screen** showing user stats, preferences and theme selection.
- **Daily reminders** via push notifications.
- **Performance monitoring** using React's `Profiler`.

## Navigation Flow

1. **Home** – overview of progress, tokens and access to tasks or profile.
2. **Tasks** – swipeable task list with quick actions to complete or postpone items.
3. **Profile** – view stats, edit preferences, change theme, adjust reminders, export data and submit feedback.

## Performance Logs

The `PerformanceMonitor` component wraps the app and logs render times to the console:
```
Render RAE [mount/update] took 12.3ms
```
Use these numbers to spot expensive renders during development. Lower times indicate better performance.

## Building for Testing and Sideloading

Use [EAS Build](https://docs.expo.dev/build/introduction/) to create a distributable APK or IPA that can be installed on a device:

```sh
cd RAE/app    # from repository parent directory
npx expo login        # if not logged in
npx eas build --profile preview --platform android    # or --platform ios
# Alternatively use the `internal` profile which is configured the same way:
npx eas build --profile internal --platform android
```

The `preview` profile produces an APK on Android that you can sideload directly. For iOS it generates an IPA for TestFlight or internal distribution. After the build completes, download the archive from the EAS website and install it on your device.


The project includes an `eas.json` file with this `preview` profile preconfigured.

## Building for App Stores

Follow these steps to produce a binary ready for Google Play or the App Store:

1. Install the Expo build tool:
   ```sh
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```sh
   eas login
   ```
3. Configure the project (run once):
   ```sh
   cd RAE/app
   eas build:configure
   ```
   If prompted, install the dev client with `npx expo install expo-dev-client`.
4. Create the store build:
   ```sh
   eas build --platform ios    # or --platform android / --platform all
   ```
   The CLI handles signing credentials and generates an IPA or APK.
5. Monitor progress:
   ```sh
   eas build:list
   ```
6. When complete, download the build from the EAS website and submit it to the store or install it on a device.

## Beta Feedback

Feedback submissions are counted locally and shown on the Profile screen. Review your external form responses regularly and log new issues in your tracker of choice (GitHub Issues or Trello).

## Feedback Monitoring

Use the **Export Feedback** button on the Profile screen to share a JSON file of feedback submission timestamps. Run the reporting script to summarize recency and frequency:

```sh
node scripts/feedbackReport.js feedback.json
```

This creates `logs/feedback_report.txt` with counts per day and the date of the last submission.

Plan a weekly check-in to review these reports along with performance logs from the console output.

## Over-the-Air Updates

The app checks for new versions each time it starts. When an update is available it downloads in the background and prompts you to restart. To publish an OTA update run:

```sh
cd RAE/app
npx expo export --platform android,ios
npx eas update --branch main --message "New update"
```

Users will see an update prompt on next launch and can restart to apply it seamlessly.

## Sync design tokens

Run after modifying `/the-loop/specs/ui-colors.md`:

```sh
python3 scripts/spec_sync.py
```
This refreshes `app/design-tokens.json`.



---

## THE LOOP LLM Project Quickstart

1. `docker compose up`
2. LLM (Ollama) available on port `11434`, Gradio chat UI on port `7860`.
3. All design and behavior is spec-driven from `/the-loop/`.
