# Overview

AgntsLab is a comprehensive AI agent marketplace built as a full-stack web application. The platform allows users to discover, download, and purchase AI agents while providing vendors with tools to upload and monetize their AI creations. The application features a modern React frontend with a Node.js/Express backend, PostgreSQL database with Drizzle ORM, and integrated Stripe payment processing.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Comprehensive component system built on Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables for theming and dark mode support
- **State Management**: TanStack Query (React Query) for server state management and API calls
- **Routing**: Wouter for lightweight client-side routing
- **Payment Integration**: Stripe React components for checkout flows

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM module system
- **Authentication**: Replit Auth using OpenID Connect (OIDC) with Passport.js integration
- **Session Management**: Express sessions stored in PostgreSQL using connect-pg-simple
- **File Uploads**: Multer middleware for handling agent file uploads
- **API Design**: RESTful endpoints with JSON responses and comprehensive error handling

## Database Design
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive relational design including users, agents, categories, purchases, reviews, and contact messages
- **Migration**: Drizzle Kit for database schema management and migrations

## Key Features
- **Multi-tier User System**: Regular users and vendors with different permissions
- **Agent Marketplace**: Browse, filter, and download AI agents with category-based organization
- **Monetization**: Stripe integration for paid agents with subscription support
- **Vendor Dashboard**: Complete agent management interface for uploading and tracking sales
- **Review System**: User feedback and rating system for agents
- **Contact System**: Built-in contact forms for user inquiries

## Security & Performance
- **Authentication**: Secure OIDC-based authentication with session management
- **File Handling**: Secure file upload with size limits and validation
- **Database**: Connection pooling with Neon serverless for optimal performance
- **Error Handling**: Comprehensive error boundaries and API error responses
- **CORS**: Configured for production deployment with credential support

# External Dependencies

## Core Infrastructure
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication Provider**: Replit Auth OIDC service
- **CDN/Assets**: Unsplash for placeholder images
- **Font Services**: Google Fonts (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)

## Payment Processing
- **Stripe**: Complete payment infrastructure including customer management, subscriptions, and checkout flows
- **Environment Variables**: STRIPE_SECRET_KEY and VITE_STRIPE_PUBLIC_KEY required for payment functionality

## Development Tools
- **Replit Integration**: Cartographer plugin for enhanced development experience
- **Build Tools**: Vite with React plugin, esbuild for server bundling
- **Runtime Error Handling**: Replit's runtime error overlay for development debugging

## UI Components
- **Radix UI**: Complete set of accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants
- **Tailwind Merge**: Efficient CSS class merging utilities