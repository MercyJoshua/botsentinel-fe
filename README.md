# BotSentinel — Frontend

**Machine Learning-Based Botnet Traffic Detection**

BotSentinel is a web-based interface for analyzing network traffic using a machine learning model trained to detect botnet traffic.

This repository contains the **frontend application** for BotSentinel. The machine learning model and inference service are developed separately and communicate with the frontend through an API.

## Overview

BotSentinel provides an interface for:

* Submitting network traffic data for analysis
* Interacting with the botnet detection model
* Viewing prediction results and confidence scores
* Visualizing traffic and detection statistics
* Presenting model analysis in an accessible security dashboard

Authentication is intentionally not required for this project. The frontend is focused on providing a clear interface for interacting with the machine learning detection system.

## Tech Stack

* **Next.js** — React framework for the application
* **TypeScript** — Type-safe application development
* **Tailwind CSS** — Utility-first styling
* **React Context** — Global theme management
* **Next Font** — Font optimization and loading
* **REST API** — Communication with the machine learning inference service

## Project Structure

The project follows a component-based architecture to keep pages and features modular and maintainable.

```text
app/
├── layout.tsx
├── page.tsx
├── globals.css
│
├── dashboard/
│   └── page.tsx
│
├── analyze/
│   └── page.tsx
│
└── results/
    └── page.tsx

components/
├── layout/
├── dashboard/
├── analysis/
├── results/
└── ui/

contexts/
└── ThemeContext.tsx

hooks/
├── useAnalysis.ts
└── useTheme.ts

lib/
├── api.ts
├── constants.ts
├── types.ts
└── utils.ts

public/
└── ...
```

### Directory responsibilities

| Directory     | Purpose                                              |
| ------------- | ---------------------------------------------------- |
| `app/`        | Routes, layouts, and page-level composition          |
| `components/` | Reusable UI and feature-specific components          |
| `contexts/`   | Global React contexts such as theme configuration    |
| `hooks/`      | Reusable React hooks and client-side logic           |
| `lib/`        | API clients, types, constants, and utility functions |
| `public/`     | Static assets                                        |

Pages should primarily compose components rather than contain large amounts of UI logic.

## Design System

BotSentinel uses a custom visual identity built around a clean security-monitoring interface.

### Brand Palette

| Token         | Color     | Usage                                    |
| ------------- | --------- | ---------------------------------------- |
| Primary       | `#2EC4B6` | Primary actions and interactive elements |
| Primary Light | `#CBF3F0` | Backgrounds and subtle accents           |
| Background    | `#FFFFFF` | Main application background              |
| Warning       | `#FFBF69` | Warnings and suspicious activity         |
| Danger        | `#FF9F1C` | High-risk and botnet detection states    |

Supporting semantic colors are defined centrally in the application's theme rather than being hardcoded throughout individual components.

### Typography

The application uses a display typeface for major headings and a readable UI font for interface elements, body text, forms, tables, and data visualizations.

Typography is configured centrally so components do not need to manage font definitions individually.

## Machine Learning Integration

The frontend does not contain the machine learning model itself.

Instead, BotSentinel follows a decoupled architecture:

```text
┌──────────────────────────┐
│      BotSentinel UI      │
│                          │
│       Next.js            │
│       TypeScript         │
│       Tailwind CSS       │
└────────────┬─────────────┘
             │
             │ HTTP / REST API
             ▼
┌──────────────────────────┐
│      Detection API       │
│                          │
│   Prediction / Inference │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│     ML Detection Model   │
│                          │
│   Botnet / Non-Botnet    │
└──────────────────────────┘
```

This separation allows the machine learning pipeline to evolve independently from the frontend application.

The frontend communicates with the inference service through the API client located in:

```text
lib/api.ts
```

API response and request structures should be represented using TypeScript types in:

```text
lib/types.ts
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The API URL should point to the machine learning inference service.

Do not commit `.env.local` or other files containing environment-specific secrets to version control.

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm, yarn, pnpm, or Bun
* Git

### Installation

Clone the repository:

```bash
git clone https://github.com/MercyJoshua/botsentinel-fe.git
cd botsentinel
```

Install dependencies:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

The application will automatically reload as you make changes.

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Next.js development server.

### Production Build

```bash
npm run build
```

Creates an optimized production build.

### Production Server

```bash
npm run start
```

Starts the application using the production build.

### Linting

```bash
npm run lint
```

Runs the project's linting checks.

## Development Guidelines

### Component-based development

Keep components focused on a single responsibility.

For example:

```text
components/
└── results/
    ├── DetectionResult.tsx
    ├── ConfidenceScore.tsx
    ├── ThreatBadge.tsx
    └── PredictionSummary.tsx
```

Avoid creating large components that contain unrelated UI, state, API calls, and business logic.

### Theme usage

Use semantic theme tokens instead of hardcoding brand colors:

```tsx
className="bg-primary text-white"
```

rather than:

```tsx
className="bg-[#2EC4B6]"
```

This keeps the design system centralized and makes future theme changes easier.

### API separation

Components should not contain duplicated API request logic.

API communication should be handled through the API layer and reusable hooks where appropriate.

```text
Component
    ↓
Custom Hook
    ↓
API Client
    ↓
Detection API
```

### Type safety

Avoid using `any` unless there is a specific reason to do so.

Request and response structures from the detection API should have explicit TypeScript types.

## Development Workflow

A typical feature should follow this structure:

```text
1. Define the feature
        ↓
2. Define required types
        ↓
3. Implement API interaction
        ↓
4. Create reusable components
        ↓
5. Compose components into a page
        ↓
6. Test loading / success / error states
        ↓
7. Run lint and production build
```

## Current Scope

The frontend is currently focused on the core BotSentinel detection workflow.

### In scope

* Traffic analysis interface
* Dataset/file input
* Model prediction requests
* Prediction results
* Detection confidence
* Traffic statistics
* Threat visualization
* Responsive interface
* Theme system

### Intentionally out of scope

* User authentication
* User account management
* Role-based access control
* Training the machine learning model from the frontend
* Persistent user profiles
* Complex application state management unless required by the product

## Future Improvements

Potential future additions include:

* Model explainability and feature importance
* SHAP-based visualizations
* Historical analysis
* Detection history
* Exportable analysis reports
* Dark mode
* Real-time traffic monitoring
* Additional machine learning models
* Model performance monitoring

These features should only be introduced when they support the project's requirements rather than adding unnecessary complexity.

## Deployment

The frontend can be deployed to platforms that support Next.js applications, including Vercel.

Before deployment, configure the production API endpoint:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.example
```

Then create the production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Project Context

BotSentinel is developed as a **Machine Learning-Based Botnet Traffic Detection** project.

The system combines:

* Network traffic analysis
* Machine learning-based classification
* Cybersecurity concepts
* Web-based data visualization
* Secure software development principles

The frontend serves as the interaction and visualization layer between the user and the machine learning detection system.
