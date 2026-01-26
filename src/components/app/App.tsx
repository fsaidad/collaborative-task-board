import '@styles/global.css';
import Button from '../ui/Button';
import { Plus } from 'lucide-react';
import { Card } from '../ui/Card';

function App() {
  return (
    <div style={{ display: 'flex', padding: '50px', flexDirection: 'column' }}>
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
      <div style={{ width: `40%`, display: 'flex', flexDirection: 'column' }}>
        <Card title="new" description="Очень сложная задача" commentsCount={5}></Card>
        <Card title="new" description="Очень сложная задача"></Card>
        <Card
          priority={{ level: 'high', label: 'пваыпвап' }}
          title="new"
          description="Очень сложная задача"
          assignee={{ name: 'gsfgdg' }}
          commentsCount={5}
          dueDateText="21.12.25"
          isOverdue={false}
          status="В работе"
        >
          <Button variant="ghost" size={'medium'}>
            БЕДА
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default App;
