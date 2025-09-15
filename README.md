# Measura Frontend

A modular web application for software measurement and estimation, providing comprehensive tools for Function Point Analysis (FPA), Goal-Question-Metric (GQM) methodologies, and measurement plan management.

## Project Overview

Measura is a sophisticated measurement platform designed for software engineering teams to standardize and streamline their estimation and measurement processes. The application supports multiple measurement methodologies and provides tools for project planning, organizational management, and data-driven decision making.

### Key Features

- **Function Point Analysis (FPA)**: Complete implementation of ISO/IEC 20926 standard for functional size measurement
- **Measurement Plans**: Comprehensive planning and tracking of software measurement initiatives
- **Goal-Question-Metric (GQM)**: Implementation of structured measurement approaches
- **Organization Management**: Multi-tenant architecture with role-based access control
- **Project Management**: Project lifecycle tracking and estimation management
- **Internationalization**: Full support for Portuguese and English languages
- **Real-time Data**: SWR-based data fetching with optimistic updates

## Technology Stack

### Frontend Framework
- **Next.js 15.3.2**: React-based framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript 5**: Type-safe development environment

### Styling & UI
- **Tailwind CSS 4.1.7**: Utility-first CSS framework
- **Custom Design System**: Modular component library with consistent theming
- **Responsive Design**: Mobile-first approach with adaptive layouts

### State Management & Data Fetching
- **SWR 2.3.3**: Data fetching with caching, revalidation, and optimistic updates
- **Zustand 5.0.5**: Lightweight state management for global application state
- **React Hook Form 7.57.0**: Performant forms with validation

### Development Tools
- **ESLint 9**: Code linting with Next.js configuration
- **Zod 3.23.8**: Schema validation and type inference
- **Axios 1.9.0**: HTTP client for API communication

### Internationalization
- **react-i18next 15.5.2**: Internationalization framework
- **i18next 25.2.1**: Core internationalization library

## Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (app)/             # Authenticated application routes
│   │   ├── overview/      # Dashboard and overview
│   │   ├── fpa/          # Function Point Analysis module
│   │   ├── plans/        # Measurement plans module
│   │   ├── projects/     # Project management
│   │   ├── organization/ # Organization settings
│   │   └── account/      # User account management
│   ├── login/            # Authentication pages
│   └── register/
├── core/                  # Business logic and utilities
│   ├── hooks/            # Custom React hooks for data fetching
│   ├── services/         # API service layer
│   ├── types/            # TypeScript type definitions
│   ├── schemas/          # Zod validation schemas
│   └── i18n/             # Internationalization configuration
└── presentation/          # UI components and views
    ├── components/       # Reusable UI components
    │   ├── primitives/   # Base UI components (Button, Input, Card)
    │   ├── common/       # Shared components
    │   └── layout/       # Layout components (Sidebar, Header)
    ├── views/            # Page-level components
    ├── assets/           # Static assets and icons
    └── styles/           # Global styles and Tailwind config
```

### Design Patterns

- **Clean Architecture**: Separation of concerns with distinct layers for presentation, business logic, and data access
- **Component Composition**: Modular component design with props-based customization
- **Custom Hooks**: Encapsulation of business logic and state management in reusable hooks
- **Type-Safe APIs**: Comprehensive TypeScript coverage with Zod schema validation
- **Internationalization-First**: All user-facing text externalized to translation files

### State Management Strategy

- **Server State**: Managed by SWR with automatic caching and revalidation
- **Client State**: Zustand for global application state (user session, UI preferences)
- **Form State**: React Hook Form for complex form handling with validation
- **URL State**: Next.js router for navigation and deep linking

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Yarn 1.22.22 (specified in packageManager)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd measura-frontend
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Configure your environment variables
```

### Development

Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

### Building for Production

Create an optimized production build:
```bash
yarn build
```

Start the production server:
```bash
yarn start
```

### Code Quality

Run ESLint for code linting:
```bash
yarn lint
```

## Development Guidelines

### Component Development
- Use TypeScript for all components with explicit prop types
- Follow the atomic design methodology (atoms, molecules, organisms)
- Implement responsive design using Tailwind CSS utilities
- Ensure accessibility compliance with ARIA attributes

### State Management
- Use SWR for server state management and caching
- Implement optimistic updates for improved user experience
- Use Zustand for client-side global state
- Prefer local state over global state when possible

### Internationalization
- All user-facing strings must be externalized to translation files
- Use semantic keys for translation strings
- Support both Portuguese (pt) and English (en) locales
- Implement proper date, number, and currency formatting per locale

### Performance Considerations
- Implement code splitting at the route level
- Use Next.js Image component for optimized image loading
- Leverage SWR caching for reduced API calls
- Implement proper loading states and error boundaries

### Testing Strategy
- Component testing with React Testing Library
- API integration testing with mock service workers
- End-to-end testing for critical user flows
- Type safety validation through TypeScript compilation

## API Integration

The frontend integrates with a RESTful API backend supporting:
- JWT-based authentication with refresh tokens
- Role-based access control (User, Analyst, Manager, Admin)
- Multi-tenant organization structure
- Real-time data synchronization

### Authentication Flow
1. User credentials validation
2. JWT token issuance and storage
3. Automatic token refresh mechanism
4. Protected route access control

## Deployment

The application is configured for deployment on modern web platforms:
- Static site generation for public pages
- Server-side rendering for authenticated routes
- Optimized asset bundling and code splitting
- Environment-specific configuration support

## Contributing

1. Follow the established coding standards and patterns
2. Ensure all new features include proper TypeScript types
3. Add internationalization support for new user-facing features
4. Implement responsive design for all new components
5. Include appropriate error handling and loading states

## License

This project is proprietary software. All rights reserved.