# Buddy: Your Mental Wellness Companion

Buddy is a comprehensive mental wellness application designed to provide a safe and supportive space for users to understand their emotions, connect with peers, and engage in mindful activities. Built with **Vite + React** and Firebase, it leverages the power of generative AI to offer personalized insights and creative tools for a holistic approach to mental well-being.

## ✨ Core Features

-   **Emotional Wellness Assessment**: A guided questionnaire helps users understand their emotional landscape regarding anxiety, depression, and stress. This provides a private, insightful baseline for their mental health journey. The results directly update their user profile for personalized content suggestions.
-   **Daily Mood Check-in**: Users can log their daily mood, which is tracked over time to reveal emotional patterns. After check-in, the app suggests a relevant activity (e.g., writing, gaming, chatting) based on the user's input.
-   **Anonymous Peer Chat**: A secure, real-time chat feature allows users to connect with peers for supportive, anonymous conversations. Anonymity is ensured through customizable avatars and aliases, removing the fear of judgment and encouraging open discussion.
-   **Live Group Therapy Sessions**: Users can join real-time, video-based group therapy sessions. This feature is powered by Agora for a stable and high-quality experience, with tokens securely generated on the backend.
-   **Customizable Avatars & Profiles**: Users can create a unique and anonymous digital identity by choosing from a wide range of avatars and setting a public alias, ensuring privacy and safety across the platform.
-   **Mindful Music Lounge**: An integrated music player with a curated selection of tracks for calming, focusing, and sleeping, providing an immediate tool for stress reduction.
-   **Creative Writing Prompts**: A blog where users can write stories inspired by AI-generated image prompts. This feature fosters creative expression as a therapeutic outlet, and a Genkit flow can even help suggest titles.
-   **Wellness Games**: A collection of simple, engaging games like Chess, Ludo, and a calming "Star Catcher" game designed to help users relax, refocus, and practice mindfulness. Multiplayer games use Firebase Realtime Database for low-latency state synchronization.
-   **Secure & Private by Design**: Built with Firebase Authentication and robust Firestore Security Rules, all user data, journal entries, and conversations are kept private and secure, creating a trusted environment.

## ⚙️ Technology Stack

Buddy is built with a modern, performant, and scalable tech stack, chosen to provide the best possible user experience.

-   **Framework**: **[Vite](https://vitejs.dev/) + [React](https://react.dev/)** for fast development and optimized production builds.
-   **Language**: **[TypeScript](https://www.typescriptlang.org/)** for code quality, type safety, and improved developer experience.
-   **Styling**: **[Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)** for rapid, consistent, and accessible UI development.
-   **Backend & Database**: **[Firebase](https://firebase.google.com/)**
    -   **Authentication**: Manages user sign-up and login (Email/Password & Anonymous).
    -   **Firestore**: The primary NoSQL database for storing user profiles, chat rooms, stories, and assessments.
    -   **Realtime Database**: Used for low-latency, real-time synchronization needed for user presence (online status) and multiplayer games.
    -   **Security Rules**: Protects all user data stored in Firestore and Realtime Database.
-   **Generative AI**: **[Google AI](https://ai.google/) via [Genkit](https://firebase.google.com/docs/genkit)** for features like story title suggestion, journal analysis, and generating Agora tokens.
-   **Real-time Communication**: **[Agora](https://www.agora.io/)** for high-quality, low-latency audio and video streaming in group therapy sessions.

## 🌊 Data & Application Flow

The application is designed around a client-centric architecture with a clear separation of concerns.

1.  **Authentication Flow**:
    -   A new user signs up via the `/signup` page. `createUserWithEmailAndPassword` is called.
    -   On success, a `createUserProfile` function is triggered to create a new user document in the `users` collection in Firestore.
    -   Existing users log in via the `/login` page. `signInWithEmailAndPassword` is called.
    -   The `AuthContext` and `useUser` hook provide the user's authentication state throughout the app. Authenticated pages are wrapped in a layout that redirects to `/login` if no user is present.

2.  **Data Fetching (Firestore)**:
    -   Client components use custom hooks like `useCollection` and `useDoc` to subscribe to real-time data from Firestore.
    -   These hooks are built on top of `onSnapshot`, ensuring the UI automatically updates when data changes in the database.
    -   For example, the Chat page (`/chat`) uses `useCollection` to listen for new friend requests and updates to the friends list.

3.  **Real-time Features (Realtime Database)**:
    -   **User Presence**: The `useUserPresence` hook listens to the `.info/connected` node in the Realtime Database. When a user connects, their status is set to 'online'. An `onDisconnect` handler is set to mark them as 'offline' if they close the browser unexpectedly.
    -   **Multiplayer Games**: Game state for Chess and Ludo is stored in the Realtime Database under `games/{gameId}`. Each player's client listens for changes to this node and updates the UI accordingly, providing a shared game experience.

4.  **Generative AI (Genkit)**:
    -   AI-powered features are encapsulated in "flows" within the `src/ai/flows/` directory.
    -   These flows are Next.js Server Actions, meaning they execute securely on the server.
    -   For example, when a user writes a story and clicks "Suggest Title," the `suggest-story-title.ts` flow is called with the story content. The flow invokes the Gemini model via Genkit to generate a title and returns it to the client.
    -   Similarly, the `generate-agora-token.ts` flow securely generates a temporary token for a user to join a video session, without exposing any secret credentials to the client.

5.  **Security**:
    -   All access to Firestore and Realtime Database is governed by security rules defined in `firestore.rules` and `database.rules.json`.
    -   These rules ensure that users can only read and write their own data. For example, a user can only update their own profile in `/users/{userId}` and can only read messages in a chat room if their UID is in the `participants` array of that chat room document.

## 📁 Project Structure

The project follows the Next.js App Router paradigm for a clear and scalable structure.

-   `src/app/`: Contains all pages and layouts.
    -   `(app)/`: Authenticated routes that require a user to be logged in (dashboard, chat, games, etc.).
    -   `(auth)/`: Unauthenticated routes for login and sign-up.
    -   `api/`: API routes for server-side logic.
-   `src/components/`: Shared React components.
    -   `ui/`: Core ShadCN UI components (Button, Card, etc.).
-   `src/context/`: React Context providers for managing global state (`AuthContext`, `MusicPlayerContext`).
-   `src/firebase/`: Contains all Firebase configuration, custom hooks (`useUser`, `useCollection`), and helper functions.
-   `src/ai/`: Houses all Genkit-related code for generative AI features.
    -   `flows/`: Contains specific AI-powered workflows.
-   `src/lib/`: Utility functions, type definitions, and static data.
-   `src/hooks/`: Custom React hooks (`useUserPresence`).
-   `firestore.rules`: Defines the security rules for the Firestore database.
-   `database.rules.json`: Defines security rules for the Firebase Realtime Database.
-   `docs/backend.json`: A blueprint file describing the app's data models for reference.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A [Firebase Project](https://console.firebase.google.com/) with **Firestore**, **Realtime Database**, and **Email/Password & Anonymous Authentication** enabled.
-   An [Agora.io Account](https://console.agora.io/) for video session credentials.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <repo-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of your project and add your Firebase, Google AI, and Agora credentials.

    ```env
    # Firebase Client SDK Configuration (from your Firebase project settings)
    NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

    # Google AI (for Genkit features)
    GEMINI_API_KEY="your-google-ai-api-key"

    # Agora (for Group Therapy video sessions)
    NEXT_PUBLIC_AGORA_APP_ID="your-agora-app-id"
    AGORA_APP_CERTIFICATE="your-agora-app-certificate"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.
# IamBuddy
