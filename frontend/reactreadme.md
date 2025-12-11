# HackConnect Frontend 🚀

This is the frontend client for **HackConnect**, built as a Single Page Application (SPA) using **React** and **Vite**. It serves as the "LinkedIn for Builders," facilitating hackathon discovery, team formation, and professional portfolio building.

## 🛠 Tech Stack

*   **Framework**: React 18 + Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **UI Components**: Shadcn/UI (Radix Primitives)
*   **Icons**: Lucide React
*   **Routing**: React Router DOM
*   **Backend/Auth**: Appwrite (Client-side integration)
*   **State Management**: React Hooks + Context (planned)

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── features/       # Business-specific components (HackathonCard, TeamCard)
│   │   ├── layout/         # Global layout (Navbar, Footer, Sidebar)
│   │   └── ui/             # Reusable UI atoms (Buttons, Inputs, Cards)
│   ├── hooks/              # Custom hooks (useAuth, useTheme)
│   ├── lib/                # Configuration & Utilities (appwrite.ts, utils.ts)
│   ├── pages/              # Route views (Index, Explore, Dashboard)
│   ├── types/              # TypeScript interfaces (User, Hackathon)
│   └── utils/              # Helper functions (date formatting, validation)
├── .env                    # Environment variables (VITE_ prefixes)
└── package.json
```

## ⚡️ Setup & Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Configuration**
    Ensure your `.env` file is set up with your Appwrite credentials:
    ```env
    VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
    VITE_APPWRITE_PROJECT_ID=your_project_id
    VITE_APPWRITE_DATABASE_ID=your_database_id
    VITE_COLLECTION_USERS=users
    VITE_COLLECTION_HACKATHONS=hackathons
    # ... other collections
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🔄 Making it Dynamic: Roadmap

Currently, the application uses a mix of **Appwrite Authentication** and **Mock Data**. To make the application fully dynamic, the following changes are required:

### 1. Authentication ()
*   **Status**: Implemented in `src/hooks/useAuth.ts`.
*   **Features**: Signup, Login, Logout, and User Profile fetching from the `users` collection.

### 2. Hackathon Discovery (🚧 In Progress)
*   **Current State**: `src/pages/Index.tsx` uses a hardcoded `featuredHackathons` array.
*   **Required Changes**:
    *   Create a `useHackathons` hook.
    *   Use `databases.listDocuments()` to fetch from the `hackathons` collection.
    *   Replace the static array in `Index.tsx` with the data from the hook.
    *   Update `HackathonCard` to handle loading states (Skeleton implemented).

### 3. Explore & Search (TODO)
*   **Current State**: `src/pages/Explore.tsx` (Static/Placeholder).
*   **Required Changes**:
    *   Implement Appwrite `Query` for filtering by tags, status, and location.
    *   Connect the Search Bar input to the Appwrite query.

### 4. User Dashboard (TODO)
*   **Current State**: `src/pages/Dashboard.tsx` (Static).
*   **Required Changes**:
    *   Fetch "My Hackathons" by querying the `participants` collection or a relationship attribute.
    *   Fetch "My Teams" data.

### 5. Team Formation (TODO)
*   **Current State**: `src/pages/TeamsLobby.tsx` (Static).
*   **Required Changes**:
    *   Implement real-time updates for team requests using Appwrite Realtime.
    *   CRUD operations for creating and joining teams.

## 📝 Data Models (Appwrite)

Ensure your Appwrite Database has the following collections matching `src/types/`:

*   **Users**: `username`, `email`, `avatar_url`, `bio`, `skills` (array), `xp`.
*   **Hackathons**: `title`, `description`, `start_date`, `prize_pool`, `tags` (array), `cover_image`.
*   **Teams**: `name`, `hackathon_id`, `members` (array of user_ids), `looking_for` (array).
