# Interactive Math Learning App - Server

The Express.js backend server for the Interactive Math Learning App, built with TypeScript and Prisma ORM.

## 🗄️ Database Setup and Migration

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

Note: Make sure your database is running before executing these commands.gration

This section covers how to set up your database using Prisma. Make sure your database is running before executing these commands.

### Initial Setup and Migration

1. Generate the migration files:

```bash
npx prisma migrate dev --name init
```

2. Apply the migration to the database:

```bash
npx prisma migrate deploy
```

3. Generate Prisma Client:

```bash
npx prisma generate
```

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
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript to JavaScript
npm run start      # Run compiled server
npm run seed       # Populate database with test data
npm run db:reset   # Clear database and reset user stats
npm run db:fresh   # Reset + seed (complete refresh)
```

## Architecture

The server follows a modular monolith architecture pattern, organizing code by business domains rather than technical layers.

### Project Structure

```
src/
├── modules/                 # Business domain modules
│   ├── profile/
│   │   ├── service.ts      # ProfileService - business logic
│   │   ├── handler.ts      # ProfileHandler - HTTP request handling
│   │   └── index.ts        # Module exports
│   ├── lesson/
│   │   ├── service.ts      # LessonService - business logic
│   │   ├── handler.ts      # LessonHandler - HTTP request handling
│   │   └── index.ts        # Module exports
│   ├── submission/
│   │   ├── service.ts      # SubmissionService - business logic
│   │   ├── handler.ts      # SubmissionHandler - HTTP request handling
│   │   └── index.ts        # Module exports
│   └── index.ts            # Main modules export
├── routes/
│   ├── profileRoutes.ts    # Profile API routes
│   └── lessonRoutes.ts     # Lesson & submission API routes
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

   - Ensure PostgreSQL is running on port 5400
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
   DATABASE_URL="postgresql://username:password@localhost:5432/math_learning"
   PORT=3000
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

### Database Schema

The database schema has been updated to include the following models:

- **User**: Represents a user in the system.
- **Lesson**: Represents a lesson containing multiple problems.
- **Problem**: Represents a problem within a lesson, which can have multiple options.
- **ProblemOption**: Represents an option for a problem, indicating whether it is correct or not.
- **Submission**: Represents a user's submission for a problem.
- **UserProgress**: Represents the progress of a user in a lesson.

This is the sql migration script that will be generated by Prisma:

```sql
-- ==============================
-- 1. USERS
-- ==============================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    total_xp INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    best_streak INT DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- 2. LESSONS
-- ==============================
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- 3. PROBLEMS
-- ==============================
CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- e.g. multiple_choice, input
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL, -- never sent to frontend
    xp_value INT DEFAULT 10,
    order_index INT DEFAULT 0
);

CREATE INDEX idx_problems_lesson ON problems(lesson_id);

-- ==============================
-- 4. PROBLEM OPTIONS
-- ==============================
CREATE TABLE problem_options (
    id SERIAL PRIMARY KEY,
    problem_id INT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_problem_options_problem ON problem_options(problem_id);

-- ==============================
-- 5. SUBMISSIONS
-- ==============================
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    attempt_id VARCHAR(255) NOT NULL, -- UUID v4 format required
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    problem_id INT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    user_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    xp_awarded INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Composite unique constraint: one submission per problem per attempt
-- This allows multiple problems per UUID attempt but prevents duplicates
CREATE UNIQUE INDEX idx_submissions_attempt_problem
ON submissions(attempt_id, problem_id);

-- Index for performance on attempt-based queries
CREATE INDEX idx_submissions_attempt_id ON submissions(attempt_id);

-- ==============================
-- 6. USER PROGRESS
-- ==============================
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    problems_completed INT DEFAULT 0,
    total_problems INT DEFAULT 0,
    progress_percent NUMERIC(5,2) DEFAULT 0.00,
    completed BOOLEAN DEFAULT FALSE,
    last_attempt_at TIMESTAMP
);

CREATE UNIQUE INDEX idx_user_progress_user_lesson
ON user_progress(user_id, lesson_id);

-- ==============================
-- 7. TRIGGERS & UPDATED_AT HANDLING (optional)
-- ==============================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```
