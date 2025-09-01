# Interactive Math ## 🗄️ Database Setup and Migrationearning App - Server

The Express.js backend server for the Interactive Math Learning App, built with TypeScript and Prisma ORM.

## 📢 Latest Updates (September 2025)eractive Math Learning App - Server

The Express.js backend server for the Interactive Math Learning App, built with TypeScript and Prisma ORM.

## � Latest Updates (September 2025)

- **Modular Architecture**: Refactored to a fully modular monolith architecture with separate modules for profile, lesson, submission, and AI features
- **AI Hint System**: Implemented advanced OpenAI-powered hint generation with teen-friendly language
- **Dependency Injection**: Added tsyringe for improved dependency management and testability
- **Type Safety**: Enhanced TypeScript types throughout all modules
- **Composite Keys**: Fixed duplicate submission issues with composite keys on attempt_id and problem_id
- **Performance Optimization**: Added database indexes for faster querying of lesson and submission data
- **Error Handling**: Improved error handling across all modules with standardized ApiResponse format
- **Documentation**: Comprehensive documentation for all modules and API endpoints

## �🗄️ Database Setup and Migration

This section covers how to set up your database using Prisma. Make sure your database is running before executing these commands.

### Initial Setup and Migration

1. Generate the migration files:

```bash
npx prisma migrate dev --name init
```

This creates a new migration based on your schema changes.

2. Apply the migration to the database:

```bash
npx prisma migrate deploy
```

This applies pending migrations to your database.

3. Generate Prisma Client:

```bash
npx prisma generate
```

This command is crucial as it:

- Generates the Prisma Client based on your schema
- Creates TypeScript types for your models
- Must be run after any changes to `schema.prisma`
- Must be run before running seeds or starting the server
- Creates the `@prisma/client` package in your `node_modules`

If you see errors about missing `PrismaClient`, run this command to fix them.

Note: Make sure your database is running before executing these commands.

### Prisma Studio

To interact with your database using a GUI:

```bash
npx prisma studio
```

Prisma Studio provides:

- Visual interface to view and edit data
- Table relationships visualization
- Easy CRUD operations
- Data filtering and sorting
- Real-time updates
- Access at `http://localhost:5555` by default

### Database Seeding

To populate your database with initial test data:

```bash
npm run seed
```

The seed will create:

- Three users with clean stats (0 XP, 0 streaks)
- Five comprehensive lessons covering different math topics:
  - Basic Arithmetic (addition, subtraction)
  - Multiplication Mastery (times tables)
  - Division Basics (simple division)
  - Fractions Fun (basic fractions)
  - Algebra Basics (intro to algebra)
- Multiple problems for each lesson with various types (multiple choice and input)
- Problem options for multiple choice questions
- **Clean state**: No submissions or user progress (users start fresh)

### Database Management Scripts

The following npm scripts are available for database management:

```bash
# Reset database (clear all data but keep users with reset stats)
npm run db:reset

# Seed database with fresh data
npm run seed

# Reset and reseed in one command
npm run db:fresh
```

### Database Reset

To clean your database and start fresh:

```bash
npm run db:reset
```

This will:

- Clear all submissions (empty submissions table)
- Clear all user progress (empty user_progress table)
- Clear all problems and options
- Clear all lessons
- Reset all user stats (totalXp: 0, currentStreak: 0, bestStreak: 0)
- Keep users but reset their activity data

### Fresh Start

For a complete fresh start:

```bash
npm run db:fresh
```

This combines reset + seed to give you a clean database with fresh lesson data and users starting from zero.

## Development Workflow

### Quick Start

1. **Set up database**: Ensure PostgreSQL is running
2. **Install dependencies**: `npm install`
3. **Apply migrations**: `npx prisma migrate dev`
4. **Generate Prisma client**: `npx prisma generate`
5. **Seed database**: `npm run seed`
6. **Start development server**: `npm run dev`

### Daily Development

- **Start server**: `npm run dev` (auto-restarts on changes)
- **View database**: `npx prisma studio`
- **Reset when needed**: `npm run db:fresh`
- **Debug with VS Code**: Use "Debug Server (ts-node)" configuration

### Available Scripts

```bash
# Development
npm run dev        # Start development server with hot reload using ts-node-dev
npm run lint       # Run ESLint to check code quality
npm run lint:fix   # Fix ESLint issues automatically
npm run format     # Format code with Prettier

# Database
npm run seed       # Populate database with test data
npm run db:reset   # Clear database and reset user stats
npm run db:fresh   # Reset + seed (complete refresh)
npm run prisma:generate # Generate Prisma client from schema
npm run prisma:migrate  # Run pending migrations
npm run prisma:studio   # Open Prisma Studio GUI

# Production
npm run build      # Compile TypeScript to JavaScript
npm run start      # Run compiled server in production mode
npm run clean      # Remove build artifacts

# Testing
npm run test       # Run unit tests with Jest
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Architecture

The server follows a modular monolith architecture pattern, organizing code by business domains rather than technical layers.

### Project Structure

```
src/
├── modules/                 # Business domain modules
│   ├── profile/
│   │   ├── profile-service.ts      # ProfileService - business logic
│   │   ├── profile-handler.ts      # ProfileHandler - HTTP request handling
│   │   └── index.ts        # Module exports
│   ├── lesson/
│   │   ├── lesson-service.ts      # LessonService - business logic
│   │   ├── lesson-handler.ts      # LessonHandler - HTTP request handling
│   │   └── index.ts        # Module exports
│   ├── submission/
│   │   ├── submission-service.ts      # SubmissionService - business logic
│   │   ├── submission-handler.ts      # SubmissionHandler - HTTP request handling
│   │   └── index.ts        # Module exports
│   ├── ai/
│   │   ├── lesson-service.ts      # AIService - OpenAI integration & hint generation
│   │   ├── lesson-handler.ts      # AIHandler - HTTP request handling for hints
│   │   ├── mapper.ts       # AIMapper - response formatting
│   │   ├── types.ts        # AI-related type definitions
│   │   └── index.ts        # Module exports
│   └── index.ts            # Main modules export
├── routes/
│   ├── profileRoutes.ts    # Profile API routes
│   ├── lessonRoutes.ts     # Lesson & submission API routes
│   └── aiRoutes.ts         # AI hint API routes
├── generated/              # Prisma generated client
│   └── prisma/
└── index.ts                # Main application entry point
```

### Architecture Principles

1. **Domain-Driven Design**: Each module represents a business domain
2. **Separation of Concerns**: Services handle business logic, handlers manage HTTP concerns
3. **Modular Organization**: Related functionality is grouped together
4. **Clean Imports**: Index files provide clean module exports
5. **Scalability**: New modules can be added without affecting existing ones

### Dependency Injection System

The application uses TSyringe for dependency injection, which provides:

1. **Testability**: Easy mocking of dependencies for unit tests
2. **Loose Coupling**: Modules don't directly depend on concrete implementations
3. **Maintainability**: Dependencies are declared explicitly at injection points
4. **Configuration**: Module-specific containers for service registration

**Container Setup** (`src/container.ts`):

```typescript
import { container } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import * as modules from "./modules";

// Register global database client
container.registerInstance("PrismaClient", new PrismaClient());

// Register module-specific containers
modules.registerContainers(container);

export { container };
```

**Module Registration** (example for submission module):

```typescript
// src/modules/submission/container.ts
import { DependencyContainer } from "tsyringe";
import { SubmissionService } from "./submission-service";
import { SubmissionHandlerInterface } from "./interfaces/submission-handler-interface";
import { SubmissionHandler } from "./handlers/submission-handler";

export function register(container: DependencyContainer): void {
  container.register("SubmissionService", {
    useClass: SubmissionService,
  });

  container.register<SubmissionHandlerInterface>("SubmissionHandler", {
    useClass: SubmissionHandler,
  });
}
```

### API Endpoints

#### Profile Module

- `GET /api/profile` - Get user profile stats
- `GET /api/profile/:userId` - Get specific user profile stats
- `GET /api/profile/user/:userId` - Get full user profile

#### Lesson Module

- `GET /api/lessons` - Get lessons with completion/progress status
- `GET /api/lessons/:lessonId` - Get specific lesson with problems
- `PUT /api/lessons/:lessonId/progress` - Update user progress

#### Submission Module

- `POST /api/lessons/:id/submit` - Submit answers with XP and streak calculation

#### AI Module

- `POST /api/ai/hint` - Get AI-generated hints for incorrect answers

### Recent Updates & Changes

#### Lesson Interface Redesign

**Sequential Problem Display**: Changed from list-based to one-by-one problem presentation

- **Navigation**: Forward-only navigation (no previous button)
- **Answer Validation**: Must answer current problem before proceeding
- **Progress Tracking**: Real-time progress indicators without numbered problem jumps
- **Submit Flow**: Submit button only appears on the final problem

**UX Improvements**:

- **Focused Learning**: Single problem display reduces cognitive load
- **Forced Progression**: Prevents skipping problems, ensures engagement
- **Visual Feedback**: Clear "Answer this problem to continue" messaging
- **Simplified Navigation**: Removed confusing problem numbering and backward navigation

#### Results Screen Enhancements

**Celebration Effects**: Removed dropping stars animation for cleaner UX

- **Performance Celebrations**: Dynamic emojis and colors based on scores
- **Animated Counters**: Smooth XP counting animations with streak bonuses
- **Progress Analytics**: Detailed breakdown with level progression visualization

#### Environment Configuration

**Dynamic API Configuration**: Moved from hardcoded URLs to environment variables

- **VITE_API_URL**: Configurable API base URL with validation
- **VITE_APP_NAME**: Application name configuration
- **TypeScript Support**: Full type definitions for environment variables
- **Validation**: Runtime validation with fallback values

### Key Features

- **XP System**: Each correct answer awards XP based on problem difficulty (typically 10 XP per correct answer)
- **Streak Tracking**: Daily streak system with UTC-based calculations and bonus rewards
- **UUID-based Attempt System**: Mandatory UUID v4 attempt IDs for secure session tracking
- **Idempotent Submissions**: Using attempt_id + problem_id composite key to prevent duplicate submissions
- **Progress Tracking**: Real-time lesson completion and progress percentages
- **AI Hint System**: OpenAI-powered personalized hints for incorrect answers with teen-friendly language
- **Type Safety**: Full TypeScript integration with Prisma-generated types
- **Clean Start**: Users begin with zero stats for authentic progression
- **Comprehensive Seeding**: Five lesson categories covering various math topics

## 🎯 XP and Streak System

### XP Calculation

**Base XP**: Each problem has an `xpValue` (default: 10 XP)

- Users earn XP only for **correct answers**
- No XP penalty for wrong answers
- XP is awarded immediately upon submission

**Streak Bonus**: Additional XP for maintaining daily streaks

- **Streak > 3 days**: 10% bonus XP on total earned XP
- Formula: `finalXP = baseXP + (baseXP * 0.1)` when streak > 3
- Bonus applies to the entire lesson submission

**Example XP Calculation**:

```
Lesson: 5 problems × 10 XP each = 50 base XP
User gets 4/5 correct = 40 base XP
Current streak: 5 days (> 3) = 10% bonus
Streak bonus: 40 × 0.1 = 4 XP
Total XP awarded: 40 + 4 = 44 XP
```

### Streak System

**Daily Streak Logic** (UTC-based):

1. **First submission**: Streak starts at 1
2. **Same day**: No streak change (maintains current)
3. **Next day (consecutive)**: Streak increments by 1
4. **Missed day(s)**: Streak resets to 1

**Streak Calculation Algorithm**:

```typescript
const daysDifference = Math.floor(
  (todayUTC - lastActivityDateUTC) / (1000 * 60 * 60 * 24)
);

if (daysDifference === 0) {
  newStreak = currentStreak; // Same day
} else if (daysDifference === 1) {
  newStreak = currentStreak + 1; // Consecutive day
} else {
  newStreak = 1; // Reset after missed day(s)
}
```

**Best Streak**: Automatically tracks the highest streak ever achieved

### Level Progression System

**Level Calculation**: Based on total XP with 1000 XP per level

- **Level Formula**: `Math.floor(totalXP / 1000) + 1`
- **Progress to Next Level**: `(totalXP % 1000) / 1000 * 100%`
- **XP to Next Level**: `1000 - (totalXP % 1000)`

**Examples**:

- 0-999 XP = Level 1
- 1000-1999 XP = Level 2
- 2500 XP = Level 3 (50% to Level 4, needs 500 more XP)

## 🤖 AI Hint System

### Teen-Friendly Learning Assistant

**AI-Powered Hints**: Integrated OpenAI GPT-3.5-turbo to provide personalized hints for incorrect answers

- **Smart Context Awareness**: AI analyzes the problem question, user's incorrect answer, and problem type
- **Teen-Friendly Language**: Hints are crafted with casual, encouraging language and emojis
- **No Answer Spoiling**: AI guides students toward the correct thinking process without revealing answers
- **Fallback Support**: Graceful degradation with encouraging messages when AI is unavailable

### API Integration

**Endpoint**: `POST /api/ai/hint`

**Request Body**:

```json
{
  "lessonId": 1,
  "problemId": 5,
  "userAnswer": "wrong_answer"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "hint": "Let's think about this step by step. What's the first thing you need to do to solve this problem? 🤔",
    "problemQuestion": "What is 2 + 3?"
  }
}
```

**Headers**: Requires `userid` or `x-user-id` header for user identification

### AI Service Architecture

**OpenAI Integration**:

- **Model**: Configurable via `OPENAI_MODEL` environment variable (defaults to GPT-3.5-turbo)
- **Context-Aware**: Includes problem details, user answer, and available options
- **Token Limit**: 150 tokens max to keep hints concise and focused
- **Temperature**: 0.7 for balanced creativity and consistency

**Security & Validation**:

- **Server-Side Only**: Correct answers never exposed to frontend
- **Answer Verification**: Validates if user's answer is actually incorrect
- **Input Sanitization**: Validates all request parameters before processing
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Environment Configuration

**Required Environment Variables**:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# OpenAI API Configuration
OPENAI_API_KEY="your_openai_api_key_here"
OPENAI_MODEL="gpt-3.5-turbo"  # Optional, defaults to gpt-3.5-turbo
```

**Setup Instructions**:

1. Obtain OpenAI API key from https://platform.openai.com/
2. Add key and optional model selection to both `.env` and `.env.example` files
3. Ensure sufficient API credits for hint generation
4. Model selection is configurable via `OPENAI_MODEL` environment variable

### Hint Generation Logic

**Smart Answer Checking**:

```typescript
// Normalizes and compares answers case-insensitively
const isCorrect = normalizedCorrect === normalizedUser;
if (isCorrect) {
  return "Great job! Your answer is actually correct! 🎉";
}
```

**Contextual Prompt Engineering**:

- **System Prompt**: Defines AI as a helpful math tutor for teenagers
- **User Prompt**: Includes problem context, user answer, and available options
- **Guidelines**: Keep hints encouraging, concise, and process-focused

**Fallback Strategies**:

1. **OpenAI Failure**: Returns encouraging generic hint
2. **Problem Not Found**: User-friendly error message
3. **Invalid Input**: Clear validation error messages

### Usage Examples

**Multiple Choice Problem**:

```
Problem: "What is 5 × 3?"
User Answer: "12"
AI Hint: "Close! Remember, multiplication is repeated addition. Try counting 5 + 5 + 5 or use your times tables! ✨"
```

**Input Problem**:

```
Problem: "Solve: x + 4 = 10"
User Answer: "5"
AI Hint: "You're on the right track! Remember to check your work by substituting your answer back into the equation. Does 5 + 4 = 10? 🧮"
```

**Fraction Problem**:

```
Problem: "1/2 + 1/4 = ?"
User Answer: "2/6"
AI Hint: "Great thinking about fractions! Remember to find a common denominator first. What number can both 2 and 4 divide into evenly? 🤔"
```

## 🔒 UUID-based Attempt System

### Security & Session Management

**Mandatory UUID Requirement**: All lesson attempts require a valid UUID v4

- **Route**: `/lesson/:lessonId?attempt-id=<uuid-v4>`
- **Validation**: UUID format validated on both client and server
- **Security**: Prevents session hijacking and ensures unique attempts

**UUID Generation & Validation**:

```typescript
// Client-side generation
const attemptId = crypto.randomUUID(); // UUID v4

// Validation regex
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
```

**Access Control**:

- Missing attempt-id → Redirect to 404
- Invalid UUID format → Redirect to 404
- Valid UUID → Allow lesson access

**Navigation Flow**:

1. User clicks lesson card → Auto-generate UUID → Navigate with attempt-id
2. LessonPage validates UUID → Allow/deny access
3. LessonInterface uses UUID for submission tracking

### Frontend Integration

#### UUID-based Session Management

**Client-Side Components**:

1. **LessonCard.tsx**: Generates UUID and navigates with attempt-id

   ```typescript
   const attemptId = generateUUID();
   navigate(`/lesson/${lesson.id}?attempt-id=${attemptId}`);
   ```

2. **LessonPage.tsx**: Validates UUID and manages access control

   ```typescript
   const attemptId = searchParams.get("attempt-id");
   if (!attemptId || !isValidUUID(attemptId)) {
     navigate("/404", { replace: true });
   }
   ```

3. **LessonInterface.tsx**: Uses UUID for submission tracking
   ```typescript
   const submissionData = {
     attemptId: attemptId, // From props
     answers: submissionAnswers,
   };
   ```

**Utility Functions** (`src/utils/uuid.ts`):

- `generateUUID()`: Creates UUID v4 using `crypto.randomUUID()`
- `isValidUUID(str)`: Validates UUID v4 format with regex

#### Environment Configuration

**Client Environment Variables** (`.env` in client folder):

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Interactive Math Learning
```

**Configuration Files**:

- `src/config/env.ts`: Centralized environment validation
- `src/vite-env.d.ts`: TypeScript definitions for VITE\_ variables
- Runtime validation with fallback values for production safety

### Troubleshooting

#### Common Issues

1. **PrismaClient Import Errors**

   ```bash
   npx prisma generate
   ```

   Run this after any schema changes.

2. **Submission Unique Constraint Errors**
   This was fixed by changing from single `attempt_id` constraint to composite `(attempt_id, problem_id)` constraint.

3. **UUID Validation Errors**

   **Symptoms**: Redirected to 404 when accessing lessons
   **Causes**:

   - Missing `attempt-id` query parameter
   - Invalid UUID v4 format
   - Browser cached old URLs without attempt-id

   **Solutions**:

   ```bash
   # Clear browser cache and localStorage
   # Ensure navigation goes through LessonCard component
   # Check that generateUUID() is working in browser console
   ```

4. **Database Connection Issues**

   - Ensure PostgreSQL is running on port 5432
   - Check `.env` file has correct `DATABASE_URL`
   - Verify database exists and is accessible

5. **Seeding Errors**

   ```bash
   npm run db:fresh
   ```

   This resets and reseeds everything.

6. **Environment Variable Issues**

   **Frontend (.env in client folder)**:

   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_APP_NAME=Interactive Math Learning
   ```

   **Backend (.env in server folder)**:

```env
# Database connection
DATABASE_URL="postgresql://username:password@localhost:5432/math_learning"

# Server configuration
PORT=3000
NODE_ENV=development

# OpenAI configuration
OPENAI_API_KEY="sk-proj-your-actual-openai-key-here"
OPENAI_MODEL="gpt-3.5-turbo"  # Optional, defaults to gpt-3.5-turbo

# Security options
JWT_SECRET="your-jwt-secret-key"
SESSION_SECRET="your-session-secret"
CORS_ORIGIN="http://localhost:5173"  # Your frontend URL
```

7. **Attempt ID Session Issues**

   **Symptoms**: Can't submit lessons, UUID errors
   **Solutions**:

   - Always navigate through lesson cards (don't bookmark lesson URLs)
   - Clear browser session storage if stuck
   - Ensure `crypto.randomUUID()` is supported (modern browsers only)

8. **VS Code Debug Issues**

   - Use the provided `.vscode/launch.json` configurations
   - Try "Debug Server (ts-node)" for development
   - Ensure `.env` file exists before debugging

9. **AI Hint System Issues**

   **Symptoms**: AI hints not working, generic fallback messages
   **Causes**:

   - Missing or invalid `OPENAI_API_KEY` in `.env`
   - Insufficient OpenAI API credits
   - Network connectivity issues
   - Invalid request format

   **Solutions**:

   ```bash
   # Check environment variables
   echo $OPENAI_API_KEY  # Should not be empty

   # Verify API key is valid
   # Test with a simple OpenAI API call

   # Check OpenAI account credits
   # Visit https://platform.openai.com/usage

   # Test hint endpoint manually
   curl -X POST http://localhost:3000/api/ai/hint \
     -H "Content-Type: application/json" \
     -H "userid: 1" \
     -d '{"lessonId": 1, "problemId": 1, "userAnswer": "wrong"}'
   ```

   **Environment Setup**:

   ```env
   # Required in .env file
   OPENAI_API_KEY="sk-proj-your-actual-key-here"
   DATABASE_URL="postgresql://username:password@localhost:5432/database"
   ```

## 🔄 Recent Refactoring and Improvements

### AI Module Enhancements

The AI module has been refactored for better maintainability and type safety:

- **Structured Response Format**: Added dedicated AIHintResponse model for type-safe responses
- **Improved Error Handling**: Comprehensive error handling with fallback hints
- **Module-Local Imports**: Fixed cross-module dependencies by using local imports
- **Enhanced Prompt Engineering**: Improved teen-friendly language instructions
- **Response Normalization**: Standardized response format for consistency

### Dependency Injection Improvements

- **Proper Registration**: Fixed handler registration in container
- **Interface-based Injection**: All handlers now implement interfaces for testing
- **Scoped Services**: Services are properly scoped to their modules
- **Clean API Boundaries**: Modules expose only necessary interfaces

### Performance Optimizations

- **Database Indexing**: Added strategic indexes for common query patterns
- **Composite Keys**: Implemented composite key constraints to prevent duplicate data
- **Query Optimization**: Refactored queries for better performance
- **Response Caching**: Added caching for frequently accessed data

For more details on these improvements, check the source code comments in each module.
