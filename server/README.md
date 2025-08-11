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

### Key Features

- **XP System**: Each correct answer awards XP based on problem difficulty
- **Streak Tracking**: Daily streak system with UTC-based calculations
- **Idempotent Submissions**: Using attempt_id + problem_id composite key to prevent duplicate submissions
- **Progress Tracking**: Real-time lesson completion and progress percentages
- **Type Safety**: Full TypeScript integration with Prisma-generated types
- **Clean Start**: Users begin with zero stats for authentic progression
- **Comprehensive Seeding**: Five lesson categories covering various math topics

### Troubleshooting

#### Common Issues

1. **PrismaClient Import Errors**

   ```bash
   npx prisma generate
   ```

   Run this after any schema changes.

2. **Submission Unique Constraint Errors**  
   This was fixed by changing from single `attempt_id` constraint to composite `(attempt_id, problem_id)` constraint.

3. **Database Connection Issues**

   - Ensure PostgreSQL is running on port 5400
   - Check `.env` file has correct `DATABASE_URL`
   - Verify database exists and is accessible

4. **Seeding Errors**

   ```bash
   npm run db:fresh
   ```

   This resets and reseeds everything.

5. **VS Code Debug Issues**
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
    attempt_id VARCHAR(255) NOT NULL, -- Removed UNIQUE constraint
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    problem_id INT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    user_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    xp_awarded INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Composite unique constraint: one submission per problem per attempt
CREATE UNIQUE INDEX idx_submissions_attempt_problem
ON submissions(attempt_id, problem_id);

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
