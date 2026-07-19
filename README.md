<div align="center">
  <img src="https://img.icons8.com/color/120/000000/survey.png" alt="App Logo" />
  <h1>Smart Field Survey & Inspection App</h1>
  <p>A comprehensive, cross-platform React Native application designed for professional field inspectors.</p>
  
  <p>
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
    <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk Auth" />
    <img src="https://img.shields.io/badge/Convex-EA580C?style=for-the-badge&logo=convex&logoColor=white" alt="Convex" />
  </p>
</div>

---

## Overview

The **Smart Field Survey App** is a modern, feature-rich mobile and web application built using the Expo ecosystem. It serves as a unified workspace for field agents, allowing them to manage surveys, capture field photos, record GPS locations, and organize their daily inspection tasks seamlessly.


## Key Features

### 1. Smart Dashboard
- **Real-time Analytics:** Track total surveys, pending approvals, and inspector ratings.
- **Dynamic Layout:** Quick action cards and recent activity tracking.
- **Premium UI:** Glassmorphism, smooth gradients, and interactive animations.

### 2. Survey Management
- Create comprehensive surveys with native **Calendar/Date Pickers**.
- Priority tagging (High/Medium/Low).
- Seamless synchronization with the **Convex** backend database.

### 3. Integrated Field Camera
- Take live photos during site visits.
- Automatic **timestamp tagging** on photo captures.
- Complete preview, retake, and secure delete flows.

### 4. Precision Location Tracking
- Fetch high-accuracy GPS coordinates (Latitude, Longitude, Altitude).
- Cross-platform support for location copying and sharing.

### 5. Native Integrations
- **Contacts Module:** Read and manage device contacts directly from the app.
- **Clipboard Utility:** Fast and secure text copying for notes and IDs.

### 6. Enterprise-Grade Security
- Powered by **Clerk Authentication**.
- Google OAuth login with robust session management.
- Web & Mobile synchronized token caching.

---

## Technology Stack

| Category | Technology |
|---|---|
| **Framework** | React Native (Expo) |
| **Routing** | Expo Router (File-based routing) |
| **Authentication** | Clerk Auth (@clerk/clerk-expo) |
| **Backend & DB** | Convex (@convex-dev) |
| **Styling** | React Native StyleSheet & Reanimated |
| **Native APIs** | expo-camera, expo-location, expo-contacts, expo-clipboard |

---

## Getting Started

### Prerequisites
Make sure you have Node.js and the Expo CLI installed.
```bash
npm install -g expo-cli
```

### Installation
1. Clone the repository and navigate into the app directory:
```bash
cd Smart-app
```
2. Install dependencies:
```bash
npm install
```
3. Set up your environment variables (`.env` file) with your Clerk and Convex keys:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
EXPO_PUBLIC_CONVEX_URL=your_convex_url
```

### Running the App
Start the Expo development server:
```bash
npx expo start
```
- Press `a` to open on Android.
- Press `i` to open on iOS.
- Press `w` to open on Web.

---

## Cross-Platform Compatibility

This app has been meticulously optimized for **both Mobile (Android/iOS) and Web browsers**. Special fallback mechanisms and responsive UI layouts have been implemented to ensure a flawless experience, even on desktop browsers!

<div align="center">
  <br/>
  <p><i>Crafted with ❤️ for modern field inspections.</i></p>
</div>