# SignCast Full Stack Application

SignCast is a digital signage application built using the MERN stack, WebSockets, and Electron for real-time canvas creation, updates, and display synchronization.

Dashboard Link
https://signcast-assignment-fullstack-dashboard.vercel.app/

Demo Video Link
https://youtu.be/N4J2S27Xxts


### Project Architecture Overview
SignCast is developed using the following technologies:

Frontend Dashboard:

Built with React.js (TypeScript) and TailwindCSS using Vite for optimized builds.
Backend:

Node.js + Express.js with WebSocket implementation for real-time communication.
Deployed on Railway.app.
Desktop Application:

Electron application powered by React.js (TypeScript) and TailwindCSS.
WebSocket integration enables real-time synchronization with the dashboard.

Setup Instructions

Display Application

Navigate to the desktop application folder

Navigate to the desktop application folder:
cd /desktop-application  

Install dependencies:
npm install  

Run the application in development mode:
npm run dev  

Use the screen key 1234 to sync displays with the dashboard.


Dashboard

Navigate to the dashboard folder:
cd /dashboard  

Install dependencies:
npm install  

Start the development server:
npm run dev  


WebSocket Implementation Details
Data Flow:
Canvas Events: WebSocket messages are triggered on canvas creation and updates.
Dashboard: Listens for real-time updates and processes canvas data for display.
Electron Application: Subscribes to WebSocket updates to ensure synchronized display.

Real-Time Communication:
WebSocket events are managed via a backend server, ensuring a continuous connection between the dashboard and the display application.

Offline Functionality
Offline support for the Electron application is not implemented yet. The plan includes:

Saving data locally for offline use.
Using WebSocket events in conjunction with network detection to fetch the latest data when reconnected.
Implementing a caching mechanism to store and sync data seamlessly

Known Limitations
Electron Application:
Build for production not yet implemented.
Lacks offline support and caching mechanisms.
Slideshow Feature:
Contains a known bug that needs resolution.
UI/UX:
Demo UI is basic and requires enhancements.
Security:
Screen key (1234) and client validation need improvements.
Password hashing and encrypted communication are not yet implemented.

Future Improvements
Enhance the UI/UX for both the dashboard and Electron application.
Build the Electron application for production with offline mode enabled.
Optimize canvas rendering logic to cater to various user applications.
Improve security by:
Using hashed passwords.
Validating WebSocket clients more rigorously.
Securing the screen ID mechanism.
Add advanced features such as:
Video playback capabilities.
Live streaming support.
