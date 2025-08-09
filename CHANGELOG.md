# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with PERN stack (PostgreSQL, Express, React, Node.js)
- Setup Vite + React + TypeScript for client
- Setup Express + TypeScript for server
- Added `.gitignore` for both client and server

### Database Setup
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

### Database Schema Improvements
- Added snake_case mapping for database columns while maintaining camelCase in ORM
- Updated table names to follow plural convention (e.g., user → users)
- Added proper indexes for foreign keys
- Implemented cascading deletes for related records

### Documentation
- Added comprehensive README.md for server setup
- Documented database migration steps
- Added Prisma Studio usage instructions
- Documented seeding process
- Added SQL schema documentation

### Development Tools
- Added TypeScript configuration for both client and server
- Configured development scripts in package.json
- Added database seeding capability
- Integrated Prisma Studio for database management

### Dependencies
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