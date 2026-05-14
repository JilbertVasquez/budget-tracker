# Budget Tracker

## Project Description
Budget Tracker is a full-stack practice project demonstrating budget, expense and period management. It includes an ASP.NET Core backend (APIs, EF Core migrations) and an Angular frontend that consumes those APIs.

Repository layout (important folders):
- `budget-tracker-client/` — ASP.NET Core backend, database context, migrations and API endpoints.
- `budget-tracker-frontend/` — Angular UI (development and production builds).

## Tech Stack
- ![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white) ASP.NET Core
- ![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white) Angular
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) TypeScript
- ![Entity Framework](https://img.shields.io/badge/EF%20Core-512BD4?style=for-the-badge&logo=microsoft&logoColor=white) Entity Framework Core

## Features
- Create, list, edit and delete budgets
- Track expenses and fixed expenses
- Manage commissions and savings
- Period management (monthly/periodic reporting)
- Role helpers and simple authorization utilities
- EF Core migrations included in `budget-tracker-client/Migrations`

## Setup Instructions
Prerequisites:
- .NET 9 SDK
- Node.js 16+ (npm) or pnpm

Start the backend API (PowerShell):

```powershell
cd .\budget-tracker-client
dotnet run --project .\budget-tracker-client.csproj
```

Start the Angular frontend in a separate terminal (PowerShell):

```powershell
cd .\budget-tracker-frontend
# Install dependencies
npm install

# Start development server
npm run start

# Or, if you prefer pnpm (pnpm lockfile present):
# pnpm install
# pnpm run start
```

Notes:
- The backend will show the Kestrel URL/port in the console output from `dotnet run` (e.g. `http://localhost:5000`). Ensure the frontend's environment config points to the correct API URL if needed.

## Usage
- Open the Angular dev server URL (typically `http://localhost:4200`) to use the UI.
- The frontend interacts with the backend APIs to manage budgets, expenses, fixed expenses and periods.

## Build Output Notes
- Backend build artifacts appear under `budget-tracker-client/bin/` when built or published.
- Angular production build output is created in `budget-tracker-frontend/dist/`. If you want the API to serve the UI, copy the production files into `budget-tracker-client/wwwroot/browser` (or configure static file serving to point to the dist folder).

## Author
- Developed by Jilbert Vasquez
