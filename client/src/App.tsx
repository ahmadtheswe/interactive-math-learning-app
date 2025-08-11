import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LessonsPage from "./pages/LessonsPage";
import LessonPage from "./pages/LessonPage";
import ResultsPage from "./pages/ResultsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LessonsPage />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
