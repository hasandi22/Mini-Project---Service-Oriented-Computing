# Global Health and Travel Safety Dashboard

## Project Overview
The **Global Health and Travel Safety Dashboard** is a web-based client-server application that provides users with real-time COVID-19 statistics for countries worldwide. The dashboard also intended to provide travel advisory information, though this feature is currently limited due to API issues.

Built with **React.js** for a responsive and dynamic interface, the app fetches data from trusted APIs and presents it in an easy-to-understand format with country cards and visual charts.

## Features
- Search for countries and filter results
- Display COVID-19 statistics: cases, deaths, recoveries
- Display country flags
- Travel advisory display (currently shows **“N/A”** or **“No advisory available”**)
- Data visualization through charts
- User authentication with:
  - Email/password (JWT token)
  - Google Authentication
- Logout functionality

## Technologies Used
- **Frontend:** React.js
- **Backend / APIs:** disease.sh API for COVID-19 data, travel-advisory.info API (limited)
- **Authentication:** JWT for email/password login, Google OAuth for Google Sign-In
- **Data Visualization:** ChartComponent (React charts)

## How It Works
1. **Login / Sign Up:** Users can register or log in using email/password or Google Authentication.
2. **Data Fetching:** On successful login, COVID-19 data and advisory information are fetched.
3. **Country Search:** Users can search for specific countries.
4. **Dashboard Display:** Shows country flags, COVID-19 stats, and advisory scores/messages.
5. **Data Visualization:** Charts display comparative COVID-19 statistics.
6. **Logout:** Clears JWT token from local storage.

## Known Issues / Limitations
- Travel advisory data is **not available**, showing **“N/A”** or **“No advisory available”** for all countries.
- Reliance on third-party APIs means data availability depends on external services.

## Future Improvements
- Integrate a more reliable travel advisory API
- Add multi-language support for advisories
- Enhance UI with more visualization options
- Provide historical COVID-19 trends in charts



