Student Management System - Frontend

A modern Angular 19 web application for managing student information, courses, and academic marks. Built with the latest Angular features and best practices for a responsive, component-driven user experience.

OVERVIEW

The Student Management System is a full-featured web application designed to manage student records, courses and marks. It provides an intuitive interface for administrative operations including creating, reading, updating, and deleting student information.

TECH STACK

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 19.2.27 | Frontend framework |
| TypeScript | 5.7.2 | Language |
| RxJS | 7.8.0 | Reactive programming |
| Node.js | Latest LTS | Runtime |
| Express.js | 4.18.2 | Backend server |
| Angular SSR | 19.2.27 | Server-side rendering |

FEATURES

- Student Management - Create, read, update, and delete student records
- Course Assignment - Assign courses to students 
- Marks Tracking - Record and display student  marks
- Responsive Design - Works seamlessly on desktop and mobile devices
- Real-time Updates - Automatic UI refresh when data changes
- Server-Side Rendering - SSR support for better performance and SEO
- API Integration - Proxy configuration for backend communication

PREREQUISITES

Before you begin, ensure you have the following installed:

- Node.js (v18+ recommended) - Download from https://nodejs.org/
- npm (v9+) or yarn (v3+)
- Git (for version control)
- Angular CLI (optional, but recommended)

To check your versions:
```bash
node --version
npm --version
```

INSTALLATION

Clone the Repository

```bash
git clone https://github.com/yourusername/student-crud.git
cd student-crud
```

Install Dependencies

```bash
npm install
```

This will install all required packages from package.json.

USAGE

Start Development Server

```bash
npm start
```

The application will run on http://localhost:4200/ with hot-reload enabled. Your browser will automatically refresh when you make changes to the code.

Start Backend Server

PROJECT STRUCTURE

```
student-crud/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── student-list/          # Display and manage student list
│   │   │   ├── student-form/          # Form for creating/editing students
│   │   │   ├── student-courses/       # Manage student course assignments
│   │   │   └── student-marks/         # Track and display student marks
│   │   ├── models/
│   │   │   ├── student.ts             # Student interface
│   │   │   ├── course.ts              # Course interface
│   │   │   └── marks.ts               # Marks interface
│   │   ├── services/
│   │   │   └── student.service.ts     # API communication service
│   │   ├── app.component.ts           # Root component
│   │   ├── app.routes.ts              # Application routes
│   │   └── app.config.ts              # Angular configuration
│   ├── main.ts                         # Application entry point
│   ├── server.ts                       # SSR server setup
│   └── styles.css                      # Global styles
├── backend/                            # Backend API server
├── public/                             # Static assets
├── angular.json                        # Angular CLI configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies and scripts
├── proxy.conf.json                     # Development proxy configuration
└── README.md                           # This file
```

DEVELOPMENT

Generate a New Component

```bash
ng generate component components/component-name
```

Generate a New Service

```bash
ng generate service services/service-name
```

View All Available Schematics

```bash
ng generate --help
```

Code Architecture

- Components: Reusable UI building blocks with own templates and styles
- Services: Handle API calls and business logic using dependency injection
- Models: TypeScript interfaces defining data structures
- Routes: Define application navigation paths

TESTING

Run Unit Tests

```bash
npm test
```

This runs all unit tests using Karma and Jasmine framework. Tests watch for file changes and re-run automatically.

View Test Coverage

```bash
ng test --code-coverage
```

Test reports are generated in the coverage/ directory.

Test Files Location

- Component tests: src/app/components/**/*.spec.ts
- Service tests: src/app/services/**/*.spec.ts

BUILDING FOR PRODUCTION

Create Production Build

```bash
npm run build
```
Serve Production Build Locally

```bash
npm run serve:ssr:STUDENT_CRUD
```

CONFIGURATION

API Proxy Configuration

Edit proxy.conf.json to configure API endpoints:

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

Environment-Specific Settings

Update src/app/app.config.ts for environment-specific configuration.

Build Configuration

Modify angular.json to customize build settings.

AVAILABLE SCRIPTS

| Command | Description |
|---------|-------------|
| npm start | Start development server |
| npm test | Run unit tests |
| npm run build | Create production build |
| npm run watch | Build in watch mode for development |
| npm run serve:ssr:STUDENT_CRUD | Serve production build with SSR |

---

TROUBLESHOOTING

Port Already in Use

If port 4200 is already in use:
```bash
ng serve --port 4300
```

Clear Dependencies

If you encounter package issues:
```bash
rm -rf node_modules package-lock.json
npm install
```

Module Not Found Errors

Ensure all dependencies are installed:
```bash
npm install --save-dev @types/node
```

Last Updated: June 2026 | Angular Version: 19.2.27
