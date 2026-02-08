import '@styles/global.css';
import Button from '../ui/Button';
import { Plus } from 'lucide-react';
import { TaskUI } from '../ui/Task';
import { useBoardStore } from '@/stores/useBoardStore';

function App() {
  const { taskCards, cardsByColumn, columnOrder, columns } = useBoardStore();

  return (
    <div style={{ display: 'flex', padding: '50px', flexDirection: 'column' }}>
      {Object.values(taskCards).map(task => (
        <TaskUI key={task.id} title={task.title} description={task.description} />
      ))}
    </div>
  );
}

export default App;
