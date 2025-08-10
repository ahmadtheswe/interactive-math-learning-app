# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2025-08-10] - Type Safety & Architectural Improvements

### Added
- Comprehensive mapper pattern for data transformation:
  - Created dedicated `mapper.ts` files for each module (profile, lesson, submission)
  - Centralized all data mapping logic for better maintainability
  - Separated concerns between data access, transformation, and presentation layers
- Comprehensive interface definitions for database query results and API responses

### Changed
- Enhanced type safety across all modules with explicit return types for all service and handler methods
- Eliminated all 'any' type usage throughout the codebase
- Extracted inline type declarations to proper interfaces in module `types.ts` files
- Resolved TypeScript naming conflicts between modules:
  - Renamed interfaces to be module-specific (e.g., `UserFromDatabase` → `ProfileUserFromDatabase`)
  - Fixed export conflicts in main modules index file
  - Ensured unique naming conventions across all domain modules
- Improved code readability and maintainability with proper type organization

## [2025-08-09] - Modular Architecture & Documentation

### Added
- Comprehensive README.md for server setup
- Documented database migration steps
- Added Prisma Studio usage instructions
- Documented seeding process
- Added SQL schema documentation
- Documented new modular monolith architecture in README.md

### Changed
- Refactored server codebase to modular monolith architecture:
  - Moved all business logic and request handlers into `src/modules` by domain (profile, lesson, submission)
  - Each module contains its own `service.ts`, `handler.ts`, and `types.ts`
  - Updated all routes to use new handlers from modules
  - Created module index files for clean imports
- Separated all request/response/result models into dedicated `types.ts` files per module
- Improved type safety and maintainability

### Removed
- Legacy `controllers` and `services` directories

## [2025-08-08] - Database Schema & API Implementation

### Added
- API endpoints for profile, lessons, and submission functionality
- Database seeding capability
- Integrated Prisma Studio for database management

### Changed
- Database Schema Improvements:
  - Added snake_case mapping for database columns while maintaining camelCase in ORM
  - Updated table names to follow plural convention (e.g., user → users)
  - Added proper indexes for foreign keys
  - Implemented cascading deletes for related records

## [2025-08-07] - Initial Project Setup

### Added
- Initial project setup with PERN stack (PostgreSQL, Express, React, Node.js)
- Setup Vite + React + TypeScript for client
- Setup Express + TypeScript for server
- Added `.gitignore` for both client and server
- Implemented Prisma as ORM
- Created initial database schema with models:
  - User
  - Lesson
  - Problem
  - ProblemOption
  - Submission
  - UserProgress
- Added database migrations
- Added seed data for initial testing
- Configured Prisma Client generation
- Added TypeScript configuration for both client and server
- Configured development scripts in package.json
- Added core dependencies:
  - Client:
    - React
    - TypeScript
    - Vite
  - Server:
    - Express
    - TypeScript
    - Prisma
    - CORS
    - dotenv

[Unreleased]: https://github.com/ahmadtheswe/interactive-math-learning-app/compare/master...HEAD
[2025-08-10]: https://github.com/ahmadtheswe/interactive-math-learning-app/compare/2025-08-09...2025-08-10
[2025-08-09]: https://github.com/ahmadtheswe/interactive-math-learning-app/compare/2025-08-08...2025-08-09
[2025-08-08]: https://github.com/ahmadtheswe/interactive-math-learning-app/compare/2025-08-07...2025-08-08
[2025-08-07]: https://github.com/ahmadtheswe/interactive-math-learning-app/releases/tag/2025-08-07