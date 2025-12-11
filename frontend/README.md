# HackConnect Frontend

Next.js 15 application with TypeScript, Shadcn/ui, and Appwrite integration.

## 📁 Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (auth)/            # Auth-related routes
│   │   ├── (main)/            # Main app routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── ui/                # Shadcn/ui components
│   │   ├── layout/            # Layout components (Navbar, Footer)
│   │   └── features/          # Feature-specific components
│   ├── lib/
│   │   ├── appwrite/          # Appwrite client configuration
│   │   └── utils.ts           # Utility functions
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   ├── styles/                # Global styles
│   └── utils/                 # Helper functions
├── public/
│   ├── images/                # Static images
│   └── icons/                 # Icons and logos
├── .env.local                 # Environment variables (create from .env.example)
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## 🎯 Responsibilities

**Navdeep (Frontend Lead):**
- Implement UI screens (Login, Dashboard, Explore)
- Integrate Appwrite Client SDK for Realtime Chat
- Build responsive layouts with Shadcn/ui components
- Handle client-side state management

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔌 Appwrite Integration

- Client SDK setup in `src/lib/appwrite/`
- Realtime subscriptions for chat
- Direct database queries for simple reads
- Authentication flows

## 📝 Key Pages

- `/` - Landing page with hero section
- `/explore` - Browse hackathons
- `/dashboard` - User dashboard
- `/teams` - Team management
- `/chat` - Realtime messaging
- `/profile` - User profile