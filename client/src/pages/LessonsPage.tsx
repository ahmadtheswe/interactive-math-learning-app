import { useNavigate } from 'react-router-dom';
import LessonsList from '../components/LessonsList';

export default function LessonsPage() {
  const navigate = useNavigate();

  const handleLessonClick = (lessonId: number) => {
    navigate(`/lesson/${lessonId}`);
  };

  return (
    <LessonsList onLessonClick={handleLessonClick} />
  );
}
