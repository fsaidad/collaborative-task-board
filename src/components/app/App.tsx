import '@styles/global.css';
import Button from '../ui/Button';
import { Plus } from 'lucide-react';

function App() {
  return (
    <div>
      <h1>Task Board</h1>
      <p>Проект запущен и готов к разработке!</p>
      <Button variant="primary" icon={Plus} size="large">
        Создать задачу
      </Button>
      <Button variant="ghost" icon={Plus} size="medium">
        Создать задачу
      </Button>
      <Button variant="destructive" size="small">
        Удалить задачу
      </Button>
      <Button variant="secondary" size="large">
        Создать задачу
      </Button>
    </div>
  );
}

export default App;
