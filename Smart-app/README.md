# Smart Field Survey & Inspection App

A complete React Native application built for field survey and inspection. Uses modern Expo APIs, Expo Router, Bottom Tabs, and features a clean, premium UI.

## 📱 Modules Implemented

### Module 1 - Dashboard
- **Welcome Screen**: Clean and modern custom app header.
- **Student Details**: Displays the student's name, ID, and active status.
- **Today's Survey Count**: Overview of daily and total completed surveys.
- **Quick Action Cards**: Easy navigation options (New Survey, History, Locations, Contacts).
- **Recent Survey Summary**: List showing recent surveys along with their priority tags.

### Module 2 - Create Survey
- **Form Fields**: Includes inputs for Site Name, Client Name, Description, Priority (selectable buttons for High/Medium/Low), and Date.
- **Validation**: Strict validation to ensure no required fields are left blank.
- **Alerts**: Success and Error alerts based on validation status.

### Module 3 - Camera
- **Permissions**: Prompts for Camera and Media Library permissions.
- **Smart Camera**: Flip camera functionality (front/back) with an intuitive overlay.
- **Photo Preview**: View the captured photo with an automatic date & time watermark.
- **Gallery Integration**: Directly save the captured site photo to the device gallery.
- **Actions**: Easily Retake or Delete with safety confirmation alerts.

## 🛠 Technologies Used
- **React Native** & **Expo SDK 54** (Stable)
- **Expo Router** for file-based routing
- **React Navigation** (Bottom Tabs & Stack)
- **Vector Icons** (Ionicons)

## 🚀 How to Run

1. Make sure you are in the project folder:
   ```bash
   cd Smart-app
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Expo server:
   ```bash
   npx expo start
   ```
