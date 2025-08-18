# AI Character Converter - Replit Documentation

## Overview

This is a full-stack web application for converting AI character definitions between different formats (TavernAI, Pygmalion, Character.AI, TextGeneration). The application provides a user-friendly interface for creating, editing, validating, and exporting AI character cards in multiple formats, including both JSON and PNG character card formats.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Query (@tanstack/react-query) for server state, local React state for component state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Build Tool**: ESBuild for production builds, TSX for development
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Validation**: Zod schemas shared between frontend and backend

### Project Structure
- `client/` - Frontend React application
- `server/` - Backend Express.js API
- `shared/` - Shared TypeScript types and schemas
- `migrations/` - Database migration files (Drizzle)

## Key Components

### Character Management
- **Character Form**: Input forms for character details (name, personality, scenario, etc.)
- **Character Preview**: Real-time preview with validation status and token counting
- **File Upload**: Support for importing existing character files (JSON, PNG)
- **Mobile-Friendly Import**: Manual import dialog for copy/paste on mobile devices
- **Export Panel**: Multi-format export capabilities (JSON/PNG)

### Data Validation
- **Real-time Validation**: Character data validation using Zod schemas
- **Token Counting**: Estimates token usage for AI model compatibility
- **Field Status Tracking**: Visual indicators for required vs optional fields

### Format Conversion
- **Multiple Formats**: Support for TavernAI, Pygmalion, Character.AI, and TextGeneration formats
- **Format-specific Mapping**: Converts between different field naming conventions
- **PNG Generation**: Creates character card images with embedded JSON metadata

## Data Flow

### Character Creation/Editing
1. User inputs character data in the form
2. Real-time validation occurs using shared Zod schemas
3. Character preview updates with validation status and token count
4. Data is stored in local React state until export

### File Import
1. User uploads JSON or PNG character file (desktop/laptop)
2. OR uses manual import dialog for mobile-friendly copy/paste
3. File is parsed and mapped to internal character schema
4. Imported data populates the character form
5. Validation runs on imported data

### Export Process
1. User selects target format and export type (JSON/PNG)
2. Character data is validated before export
3. Server converts data to target format
4. For PNG: Server generates character card image with embedded data
5. File is downloaded to user's device

### API Communication
- RESTful API endpoints for conversion and validation
- Request/response handled through React Query for caching and error handling
- Shared types ensure type safety between frontend and backend

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives (@radix-ui/*)
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **State Management**: TanStack React Query
- **Form Handling**: React Hook Form, @hookform/resolvers
- **Validation**: Zod for schema validation
- **Utilities**: clsx, date-fns, cmdk

### Backend Dependencies
- **Database**: Drizzle ORM with Neon PostgreSQL
- **Validation**: Zod for shared schemas
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **Development**: TSX for TypeScript execution, Vite for frontend dev server

### Build Tools
- **Frontend**: Vite with React plugin
- **Backend**: ESBuild for production bundling
- **TypeScript**: Shared tsconfig.json with path aliases
- **Database**: Drizzle Kit for migrations

## Deployment Strategy

### Development
- Frontend served by Vite dev server with HMR
- Backend runs with TSX for TypeScript execution
- Database migrations applied with `npm run db:push`
- Replit-specific plugins for development experience

### Production Build
1. Frontend built with Vite to `dist/public/`
2. Backend bundled with ESBuild to `dist/index.js`
3. Static files served by Express in production
4. Database connection via environment variable `DATABASE_URL`

### Environment Configuration
- **Development**: NODE_ENV=development, uses Vite dev server
- **Production**: NODE_ENV=production, serves static files
- **Database**: PostgreSQL via DATABASE_URL environment variable
- **Replit Integration**: Special handling for Replit environment detection

### File Structure
```
├── client/           # React frontend
├── server/           # Express backend
├── shared/           # Shared types and schemas
├── migrations/       # Database migrations
├── dist/            # Production build output
└── config files     # Build and development configuration
```

The application is designed to be deployed as a single service that serves both the API and static frontend files, with PostgreSQL as the database backend.