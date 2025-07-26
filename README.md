# Voikup

Your AI-powered accountability partner for better habits. Built with the [T3 Stack](https://create.t3.gg/).

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org) (Email Magic Links)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://prisma.io)
- **API**: [tRPC](https://trpc.io) for type-safe APIs
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Code Quality**: [Biome](https://biomejs.dev/) for linting/formatting

## Prerequisites

- Node.js 18+ and pnpm
- Docker or Podman (for local PostgreSQL)
- A PostgreSQL database (local or cloud)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/voikup.git
cd voikup
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

- `AUTH_SECRET`: Run `npx auth secret` to generate
- `DATABASE_URL`: PostgreSQL connection string

### 4. Start the database

For local development with Docker:

```bash
./start-database.sh
```

This will start a PostgreSQL container on port 5433.

### 5. Set up the database

Push the Prisma schema to your database:

```bash
pnpm db:push
```

### 6. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) to see the app.

## Available Scripts

```bash
# Development
pnpm dev          # Start dev server (port 3001)
pnpm build        # Build for production
pnpm start        # Start production server

# Database
pnpm db:push      # Push schema changes (development)
pnpm db:generate  # Generate Prisma migrations
pnpm db:migrate   # Apply migrations (production)
pnpm db:studio    # Open Prisma Studio GUI

# Code Quality
pnpm check        # Run Biome linting
pnpm check:write  # Run Biome with auto-fix
pnpm typecheck    # TypeScript type checking
```

## Project Structure

```text
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (auth, tRPC)
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   └── api-test/          # tRPC API testing page
├── server/                # Backend logic
│   ├── api/              # tRPC routers and procedures
│   │   ├── routers/      # Feature routers (auth, user, health)
│   │   ├── root.ts       # Root router
│   │   └── trpc.ts       # tRPC context and middleware
│   ├── auth/             # NextAuth configuration
│   └── db.ts             # Prisma client
└── trpc/                 # Frontend tRPC setup
```

## Features

- ✅ Email magic link authentication
- ✅ Protected routes and API endpoints
- ✅ User profile management
- ✅ Health check endpoint
- ✅ Type-safe API with tRPC
- ✅ Pre-commit hooks with Husky
- ✅ Environment validation with Zod

## Development Workflow

1. The app uses Biome for code formatting and linting
2. Pre-commit hooks automatically format code and check types
3. Environment variables are validated on startup
4. Magic link emails are logged to console in development

## Testing the App

1. Visit the homepage and click "Get Started"
2. Enter your email to receive a magic link
3. Check your terminal for the magic link URL
4. Click the link to sign in
5. Visit "/api-test" to test all API endpoints

## Learn More

- [T3 Stack Documentation](https://create.t3.gg/)
- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## Deployment

Follow the deployment guides for:

- [Vercel](https://create.t3.gg/en/deployment/vercel)
- [Netlify](https://create.t3.gg/en/deployment/netlify)
- [Docker](https://create.t3.gg/en/deployment/docker)

Remember to set up your production environment variables and database!
