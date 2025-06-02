# Measura – WebApp UI Architecture Proposal

## Overview

Measura is a modular, multi-role web application designed to support teams and organizations in performing accurate software measurement and estimation. It is not a marketing website, but a functional app for real users to execute Function Point Analysis (FPA), Goal-Question-Metric (GQM) modeling, and structured measurement plans.

Built with:

- **Next.js** for full-stack capabilities and routing
- **React** for component-based UI
- **Tailwind CSS** for utility-first styling

## UI Composition

- clean and modern UI
  dark and light modes
  github ui inspired

## Application Shell

**Global Elements:**

- **Header/Nav Bar:** Present across all screens (logo, navigation links, user menu, role-specific access)
- **Sidebar (for logged-in users):** Navigation to functional modules: Dashboard, FPA, GQM, Plans, Docs
- **Main Content Area:** Varies by route
- **Footer (only on auth/login screens):** Legal links and support contacts

---

## Auth Flow (Pre-Login)

**Screens:**

- Welcome / Introduction
- Sign Up / Log In
- Role-specific onboarding (User, Analyst, Manager, Admin)

---

## App Module 1 – Dashboard

### Purpose

Main landing screen after login. Summary of recent activity, active estimates, linked plans, and personal tasks.

### Components

- Measurement Activity Feed
- Task Reminders (e.g., finalize estimate, submit plan)
- Shortcuts to recent artifacts
- Role-based quick actions

---

## App Module 2 – FPA (Function Point Analysis)

### Purpose

Allow users to create, manage, and export Function Point estimates.

### Key Views

- Estimate List View
- Estimate Creation Form (Zod validated)
- Historical Version View

### Components

- useCreateEstimate(), useEstimateHistory()
- Input/Output/Inquiry categorization
- Automatic point calculation based on standard weights

---

## App Module 3 – GQM (Goal-Question-Metric)

### Purpose

Define strategic measurement goals and derive actionable metrics.

### Key Views

- GQM Tree Builder
- Goal Assignment View
- Metric Result Collection Table

### Components

- useGoals(), useMetrics()
- Template gallery (e.g., productivity, quality, delivery)
- Versioned goal trees

---

## App Module 4 – Measurement Plans

### Purpose

Create strategic plans that unify FPA and GQM components.

### Key Views

- Plan List & Detail View
- Plan Creation Flow (wizard)
- Version Comparison Tool

### Components

- Link metrics/goals/estimates by project
- Assign team members and deadlines
- Export plan as PDF or JSON

---

## App Module 5 – Documentation & Developer Tools

### Purpose

Support developer extensions and system understanding.

### Key Views

- API Reference
- Hook Integration Guide
- Folder Structure & Module Guide

### Components

- Auto-generated schemas from Zod
- Code examples with Axios and Zustand
- Environment & setup walkthroughs

---

## System Roles & Permissions

| Role                | Key Capabilities                               |
| ------------------- | ---------------------------------------------- |
| User                | Submit estimates, track own metrics            |
| Project Manager     | Assign goals, approve estimates, oversee plans |
| Measurement Analyst | Configure templates, analyze data              |
| Admin               | Manage users, system config, full access       |

---

## Project Folder Structure

```markdown
src/
├── app/ # Next.js App Router pages
│ ├── layout.tsx # Root layout with providers
│ ├── page.tsx # Entry screen for authenticated users (dashboard redirect)
│ ├── auth/ # Login, register, onboarding flows
│ ├── dashboard/ # Dashboard module route
│ ├── fpa/ # FPA module routes
│ ├── gqm/ # GQM module routes
│ ├── plans/ # Measurement plan routes
│ └── docs/ # Developer tools & API info
│
├── components/ # Reusable UI components
│ ├── common/ # Domain-agnostic components (buttons, lists, modals)
│ ├── layout/ # Layout-specific components (headers, sidebars)
│ └── primitives/ # Base building blocks (inputs, cards, toggles)
│
├── views/ # Feature-specific screen components
│ ├── Dashboard/
│ ├── FPA/
│ ├── GQM/
│ └── Plans/
│
├── assets/ # Static assets and icon components
│ └── icons/ # SVG icon components (e.g., Theme, Email)
│
├── core/ # Application core logic
│ ├── hooks/ # Custom hooks (e.g., useTheme, useMediaQuery)
│ ├── utils/ # Utility functions (e.g., className merge)
│ ├── i18n/ # Internationalization config and translations (PT as default but also EN)
│ └── types/ # Shared TypeScript types and enums
│
└── styles/
└── globals.css # Tailwind global styles and CSS variables
```

---

## Contribution & Origin (Optional Module)

### Purpose

Provide background and encourage academic or industry collaboration.

### Highlights

- Developed as part of a Final Undergraduate Project
- Grounded in academic models: FPA, GQM, MR-MPS-SW
- Built with extensibility, clarity, and documentation in mind

---

## Footer (Only on Auth & Entry Screens)

**Measura** – Software Estimation & Measurement, Evolved
Privacy Policy | Terms of Use | Support Contact

# Package JSON

{
  "name": "web-landing",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@tailwindcss/postcss": "^4.1.7",
    "autoprefixer": "^10.4.21",
    "clsx": "^2.1.1",
    "i18next": "^25.2.0",
    "next": "15.3.2",
    "next-i18next": "^15.4.2",
    "postcss": "^8.5.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-i18next": "^15.5.1",
    "tailwind-merge": "^3.3.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.3.2",
    "tailwindcss": "^4.1.7",
    "typescript": "^5"
  }
}

# eslint config .mjs

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;

# next config .ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['react-i18next', 'i18next'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;

# prettier 

    module.exports = {
    singleQuote: true,
    trailingComma: "all",
    arrowParens: "avoid",
    plugins: ["prettier-plugin-tailwindcss"],
    };


# globals css

@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

/* System colors */
:root {
  --white: #ffffff;
  --black: #0e0c1d;

  /* Purple palette */
  --purple-950: #1e1b4b;
  --purple-900: #312e81;
  --purple-800: #4338ca;
  --purple-700: #6366f1;
  --purple-600: #818cf8;
  --purple-500: #a5b4fc;
  --purple-400: #c7d2fe;
  --purple-300: #e0e7ff;
  --purple-200: #e8edff;
  --purple-100: #f1f5ff;
  --purple-50:  #f8faff;

  /* Light theme colors */
  --bg-primary: var(--white);
  --bg-secondary: #f3f4f6;
  --bg-tertiary: #f3f4f6;
  --bg-purple: var(--purple-600);
  
  --color-default: var(--black);
  --color-secondary: #4b5563;
  --color-tertiary: #6b7280;
  --color-button: var(--white);
  
  --primary: var(--purple-700);
  --primary-light: var(--purple-500);
  --primary-dark: var(--purple-900);
  --secondary: var(--purple-600);
  --secondary-light: var(--purple-400);
  --secondary-dark: var(--purple-800);
  --secondary-button: var(--white);
  
  --border-primary: #e5e7eb;
  --border-secondary: #d1d5db;
}

/* Dark theme colors */
:root.dark {
  --bg-primary: var(--black);
  --bg-secondary: var(--purple-950);
  --bg-tertiary:  rgba(255, 255, 255, 0.035);
  --bg-purple: var(--purple-900);
  
  --color-default: var(--white);
  --color-secondary: var(--white);
  --color-tertiary: #94a3b8;
  --color-button: var(--white);
  
  --primary: var(--purple-600);
  --primary-light: var(--purple-400);
  --primary-dark: var(--purple-800);
  --secondary: var(--purple-600);
  --secondary-light: var(--purple-400);
  --secondary-dark: var(--purple-800);
  --secondary-button: var(--white);
  
  --border-primary: #1e293b;
  --border-secondary: #334155;
}

@theme {
  /* Background colors */
  --color-background: var(--bg-primary);
  --color-background-secondary:  linear-gradient(180deg, var(--primary), var(--secondary));
  --color-background-tertiary: var(--bg-tertiary);

  /* Text colors */
  --color-default: var(--color-default);
  --color-secondary: var(--color-secondary);
  --color-tertiary: var(--color-tertiary);
  --color-button: var(--color-button);

  /* Theme colors */
  --color-primary: var(--primary);
  --color-primary-light: var(--primary-light);
  --color-primary-dark: var(--primary-dark);
  --color-secondary: var(--secondary);
  --color-secondary-light: var(--secondary-light);
  --color-secondary-dark: var(--secondary-dark);
  --color-secondary-button: var(--secondary-button);
  
  /* Border colors */
  --color-border: var(--border-primary);
  --color-border-secondary: var(--border-secondary);



 
}

/* Input component styles */
.input-base {
  @apply flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-default placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors;
}

.input-error {
  @apply border-red-500 focus:ring-red-500;
}

.gradient-secondary {
  background-image: linear-gradient(rgba(42, 42, 121, 0.88), rgba(40, 40, 93, 0.56)), linear-gradient(rgb(0, 0, 0), rgb(0, 0, 0));
}

.gradient-purple {
  background-image: linear-gradient(var(--primary), var(--secondary));
}

follow this pattern for globals (just the structure), but change the colors accordingly to the following pattern
- clean and modern UI
  dark and light modes
  github ui inspired
