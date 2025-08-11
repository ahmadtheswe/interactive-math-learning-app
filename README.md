# Interactive Math Learning App

A comprehensive PERN (PostgreSQL, Express, React, Node.js) stack application for interactive mathematics education with gamification features.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🚀 Features

### Core Functionality

- **Interactive Lessons**: Dynamic math problems with instant feedback
- **Progress Tracking**: XP system with animated progress reveals
- **Streak System**: Daily learning streaks with bonus rewards
- **Results Analytics**: Comprehensive performance metrics and celebrations
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
- **Prisma ORM** with PostgreSQL database
- **Global database configuration** with optimized transaction timeouts
- **RESTful API** design with comprehensive error handling

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
│   │   │   └── ResultsPage.tsx     # Results display with animations
│   │   ├── services/          # API integration
│   │   └── types/             # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Express backend
│   ├── src/
│   │   ├── db.ts              # Global Prisma client configuration
│   │   ├── index.ts           # Server entry point
│   │   └── services/          # Business logic services
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
   # Edit .env with your database configuration
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
3. **Track Progress**: Monitor XP gains and streak status
4. **View Results**: See detailed performance analytics after each lesson

### For Developers

1. **Component Architecture**: Use the data bridge pattern for component communication
2. **API Integration**: Leverage the submission service for progress tracking
3. **Database Operations**: Utilize the global Prisma client for consistent transactions
4. **State Management**: Implement React Router navigation state for data flow

## 🧮 Technical Highlights

### Data Bridge Architecture

The application uses a sophisticated data bridge pattern:

- **LessonPage.tsx**: Presents lesson content and collects user responses
- **LessonInterface.tsx**: Acts as data orchestrator, handling API calls and navigation
- **ResultsPage.tsx**: Displays comprehensive results with animations

### Database Optimizations

- **Global Prisma Client**: Centralized database configuration with connection pooling
- **Transaction Timeouts**: Extended to 15 seconds for complex operations
- **Streak Calculations**: Automated daily streak tracking with bonus multipliers

### Performance Features

- **Animated Feedback**: Smooth XP counter animations and progress reveals
- **Optimistic Updates**: Immediate UI feedback with server synchronization
- **Error Handling**: Comprehensive error boundaries and fallback states

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

- `POST /api/submissions` - Submit lesson answers
- `GET /api/submissions/:userId` - Get user submission history

### Progress

- `GET /api/progress/:userId` - Get user progress and streaks

## 🎨 UI/UX Features

### Results Screen

- **Animated XP Counter**: Smooth counting animations for engagement
- **Performance Celebrations**: Dynamic emojis and colors based on scores
- **Streak Tracking**: Visual streak status with bonus indicators
- **Progress Analytics**: Detailed breakdown of lesson performance

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

This project is licensed under the MIT License - see the LICENSE file for details.

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
