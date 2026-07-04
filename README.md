# My Masjid — Working Project (M0 + M1)

**This is a reconstructed, known-good snapshot** — rebuilt after a real
debugging session on Windows, so `package.json` here reflects the exact
versions that actually worked (SDK 57.0.2, React Native 0.86, etc.), not
original guesses. On a fresh machine, this should install and run without
repeating that whole process.

## Setting up on a new machine

```bash
cd app
npm install
```

That's it for dependencies — no `expo install --fix` dance needed, since
these versions are already the ones Expo resolved as mutually compatible
last time.

**Copy your `.env` file over separately** (from your other computer, via USB/cloud/etc.) —
it's git-ignored and never included in a zip like this on purpose, since it
holds your real Firebase project keys. If you don't have it handy, copy
`.env.example` to `.env` and re-paste the config values from Firebase Console
→ Project settings → Your apps.

```bash
npx expo start -c
```

Scan the QR with Expo Go (make sure Expo Go on this new machine's paired
phone — or the same phone, doesn't matter, it's the same Expo Go app — is
updated; see the SDK-compatibility saga from earlier if this bites again).

## What's implemented so far

- **M0**: full navigation skeleton, all 8 screens reachable, theme, Firestore rules
- **M1**: real Home screen — live countdown, today's timings from Firestore,
  offline caching via AsyncStorage, refetch-on-foreground

Everything else (Announcements, admin login/dashboard/forms, notifications)
is still the M0 stub screens, per the Development Milestones roadmap.

## Firebase setup (if starting a project from scratch)

See the original M0 setup steps — create two Firebase projects (dev/prod),
enable Firestore + Auth, register a Web app for config keys, deploy
`firestore.rules`/`firestore.indexes.json`, and manually seed
`masjids/noor-masjid` + `masjids/noor-masjid/timetable/current` in the
Firestore Console.
