# Gauge Client

Weather and sensor monitoring dashboard — sensor management, live readings, weather overview, and alert management.

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev
```

## Stack

- **Runtime:** Next.js 16 (React 19)
- **Backend:** gauge-service:5607
- **Libraries:** @rodrigo-barraza/components-library, recharts, lucide-react, luxon

## Scripts

```bash
npm run start         # Start production server (port 3006)
npm run dev           # Start dev server (port 3006)
npm run build         # Build for production
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix lint issues
npm run format        # Format with Prettier
npm run format:check  # Check formatting
npm test              # Run tests (Vitest)
npm run test:watch    # Run tests in watch mode
npm run deploy        # Deploy to production
npm run deploy:dry    # Validate deployment without deploying
```

