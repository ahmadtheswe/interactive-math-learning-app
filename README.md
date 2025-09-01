# Interactive Math Learning App

A comprehensive PERN (PostgreSQL, Express, React, Node.js) stack application for interactive mathematics education with gamification features.

## 📢 Latest Updates (September 2025)

- **Modular Monolith Architecture**: Refactored backend to domain-driven modular design
- **Dependency Injection**: Added TSyringe for improved dependency management and testability
- **Type Safety Enhancements**: Improved TypeScript interfaces across all components
- **AI Hint System Optimizations**: Enhanced teen-friendly hint generation
- **Submission System Fixes**: Implemented composite keys to prevent duplicate submissions
- **Database Indexing**: Added performance indexes for faster query times
- **Environment Configuration**: Enhanced validation with fallback values
- **Results Page Fixes**: Fixed AI hint response handling and UI improvements

## 🚀 Features

### Core Functionality

- **Interactive Lessons**: Dynamic math problems with instant feedback
- **AI-Powered Hints**: Intelligent, teen-friendly hints for incorrect answers using OpenAI GPT-3.5-turbo
- **Progress Tracking**: XP system with animated progress reveals
- **Streak System**: Daily learning streaks with bonus rewards
- **Results Analytics**: Comprehensive performance metrics and celebrations
- **Profile/Stats Dashboard**: Personal progress tracking with achievements and statistics
- **Responsive Design**: Mobile-first approach with modern UI/UX

### Gamification Elements

- **XP Points**: Earn experience points for correct answers
- **Streak Bonuses**: Daily streak multipliers for consistent learning
- **Performance Celebrations**: Animated feedback based on lesson performance
- **Progress Visualization**: Dynamic progress bars and achievement displays

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)

- **React 19+** with TypeScript for type safety
- **React Router DOM v7.8.0** for navigation with state management
- **Vite** for fast development and building
- **Component Architecture**: Page-based routing with data bridge patterns

### Backend (Node.js + Express)

- **Express.js** server with TypeScript
- **Modular Monolith Architecture** with domain-based organization
- **Dependency Injection** with TSyringe for loose coupling and testability
- **Prisma ORM** with PostgreSQL database
- **OpenAI Integration** with GPT-3.5-turbo for intelligent hint generation
- **Type-Safe API Responses** with standardized ApiResponse format
- **RESTful API** design with comprehensive error handling
- **Indexed Database** with optimized query performance

### Database (PostgreSQL)

- **Prisma Schema** with user progress tracking
- **Submission System** with streak calculations
- **Optimized Transactions** with 15-second timeout configuration

## 📁 Project Structure

```
interactive-math-learning-app/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   │   ├── LessonPage.tsx      # Main lesson interface
│   │   │   ├── LessonInterface.tsx # Data bridge orchestrator
│   │   │   ├── ResultsPage.tsx     # Results display with animations
│   │   │   └── ProfilePage.tsx     # Profile/stats dashboard
│   │   ├── services/          # API integration
│   │   └── types/             # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Express backend
│   ├── src/
│   │   ├── modules/           # Business domain modules
│   │   │   ├── ai/                # AI hint system with OpenAI integration
│   │   │   │   ├── handlers/          # HTTP request handlers
│   │   │   │   ├── interfaces/        # TypeScript interfaces
│   │   │   │   ├── models/            # Response models
│   │   │   │   └── services/          # Business logic services
│   │   │   ├── profile/           # User profile and statistics
│   │   │   ├── lesson/            # Lesson management
│   │   │   └── submission/        # Answer submission and grading
│   │   ├── routes/            # API route definitions
│   │   ├── container.ts       # TSyringe dependency container
│   │   ├── db.ts              # Prisma client configuration
│   │   └── index.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn package manager

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp env.example .env
   ```

   Required backend environment variables (.env in server directory):

   ```env
   # Database connection
   DATABASE_URL="postgresql://username:password@localhost:5432/math_learning"

   # Server configuration
   PORT=3000
   NODE_ENV=development

   # OpenAI configuration
   OPENAI_API_KEY="your-openai-api-key"
   OPENAI_MODEL="gpt-3.5-turbo"

   # Security (if using authentication)
   JWT_SECRET="your-secret-key"
   CORS_ORIGIN="http://localhost:5173"
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🎯 Usage

### For Students

1. **Access Lessons**: Navigate to available math lessons
2. **Complete Problems**: Solve interactive math problems with instant feedback
3. **Get AI Hints**: Request intelligent, personalized hints for incorrect answers
4. **Track Progress**: Monitor XP gains and streak status
5. **View Results**: See detailed performance analytics after each lesson
6. **Check Profile**: Review personal statistics, achievements, and overall progress

### For Developers

1. **Component Architecture**: Use the data bridge pattern for component communication
2. **API Integration**: Leverage the submission service for progress tracking
3. **Database Operations**: Utilize the global Prisma client for consistent transactions
4. **State Management**: Implement React Router navigation state for data flow

## 🧮 Technical Highlights

### Modular Monolith Architecture

The backend follows a domain-driven modular monolith approach:

- **Module Independence**: Each module (profile, lesson, submission, ai) is self-contained
- **Dependency Injection**: TSyringe provides loose coupling between modules
- **Clean Interfaces**: Every module exposes defined interfaces for type safety
- **Standard Response Format**: Consistent ApiResponse pattern across all endpoints

### Data Bridge Architecture

The frontend uses a sophisticated data bridge pattern:

- **LessonPage.tsx**: Presents lesson content and collects user responses
- **LessonInterface.tsx**: Acts as data orchestrator, handling API calls and navigation
- **ResultsPage.tsx**: Displays comprehensive results with animations

### Database Optimizations

- **Indexed Queries**: Strategic indexes on frequently queried columns
- **Composite Keys**: Prevent duplicate submissions with attempt_id + problem_id constraints
- **Transaction Management**: Controlled transaction scope for data integrity
- **Streak Calculations**: Automated daily streak tracking with bonus multipliers

## 🔧 Development

### Running in Development

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### Building for Production

```bash
# Build frontend
cd client && npm run build

# Build backend
cd server && npm run build
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database (development only)
npx prisma migrate reset
```

## 📊 API Endpoints

### Lessons

- `GET /api/lessons` - Get available lessons
- `GET /api/lessons/:id` - Get specific lesson content

### Submissions

- `POST /api/lessons/:id/submit` - Submit lesson answers
- `GET /api/submissions/:userId` - Get user submission history

### Profile

- `GET /api/profile/:userId` - Get user profile stats and achievements

### AI Hints

- `POST /api/ai/hint` - Get AI-generated hints for incorrect answers

## 🎨 UI/UX Features

### Results Screen

- **Animated XP Counter**: Smooth counting animations for engagement
- **Performance Celebrations**: Dynamic emojis and colors based on scores
- **Streak Tracking**: Visual streak status with bonus indicators
- **Progress Analytics**: Detailed breakdown of lesson performance

### Profile/Stats Dashboard

- **Comprehensive Statistics**: Total XP, current streak, best streak, and progress percentages
- **Achievement System**: Unlockable badges based on learning milestones
- **Visual Progress**: Animated progress bars and level indicators
- **Activity Tracking**: Last activity dates and motivational messaging

### Responsive Design

- **Mobile-First**: Optimized for mobile devices with touch interactions
- **Progressive Enhancement**: Enhanced features for larger screens
- **Accessibility**: ARIA labels and keyboard navigation support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the excellent framework and tooling
- Prisma team for the outstanding ORM experience
- Vite team for the lightning-fast development experience
- PostgreSQL community for the robust database system

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the code comments for implementation details

---

Built with ❤️ using the PERN stack for interactive mathematics education.

---

## 👨🏻‍💻 Tech Lead Focus Areas

### 1. Team Development Strategy

#### Codebase Structure for 2–3 Developers

- `client/` → Frontend (React) — separate feature folders per module (lessons/, problems/, users/)

- `server/` → Backend API (Express) — modular structure by domain:

```bash
server/
  src/
    modules/
      lessons/
      problems/
      users/
      submissions/
    common/
    prisma/
```

- Database Migrations handled in prisma/ (single source of truth)
- Feature Branches — each developer owns 1–2 features at a time

#### Git Workflow & Code Review Process (Trunk-Based Development)

- **Single main branch** — always production-ready.
- Developers branch from `master` for small, short-lived features (`feature/lesson-progress`, `fix/option-rendering`).
- Commit **small**, **atomic** changes multiple times a day.
- Open a PR into main as soon as the feature is functional (often within hours, never more than 1–2 days).
- Merge only after:
  - Passing automated tests & linting
  - Peer review approval

#### Code Review

- Reviews happen quickly (within 1–4 hours) to keep work flowing.
- Focus areas:
  - Maintainability & readability
  - Consistent coding standards (ESLint, Prettier, StyleCop)
  - Adequate test coverage
- Encourage pair reviews for tricky changes.

#### Merge Conflict Prevention

- Keep branches alive for <2 days
- Pull `master` frequently before pushing
- Use clear ownership of files/folders
- Automate formatting to eliminate style-related conflicts

### 2. AI/ML Integration Strategy

#### Where to Integrate

- **Adaptive Lesson Recommendation** — Suggest next lessons based on accuracy, time-to-answer, and hint usage.
- **AI-Generated Hints** — ✅ **IMPLEMENTED**: LLM generates short, teen-friendly hints for wrong answers using OpenAI GPT-3.5-turbo.
- **Dynamic Problem Generation** — Create new problems in topics where the student struggles.

#### Data to Collect

| Data                        | Purpose                         |
| --------------------------- | ------------------------------- |
| `topic`, `difficulty_level` | Adjust challenge level          |
| `is_correct`, `user_answer` | Detect misconceptions           |
| `time_to_answer_ms`         | Measure engagement & confidence |
| `hint_requested`            | Track reliance on AI assistance |
| `attempt_id`                | Group problems into sessions    |
| `accuracy per topic`        | Feed recommendation engine      |

#### How to Use the Data

- Short-term: Rule-based recommendations
- Medium-term: ML classification to predict probability of success
- Long-term: Reinforcement Learning to optimize lesson paths

### 3. Technical Communication

**Complex Decision:** Choosing Prisma ORM over raw SQL

- **Business Impact**: Faster development & fewer database bugs → shorter time-to-market
- **Trade-offs**: Slight overhead in complex queries vs raw SQL
- **Timeline**:
  - Setup & migrations → <1 day
  - Initial models → <2 hours
  - Faster onboarding for new devs → reduces future training cost
