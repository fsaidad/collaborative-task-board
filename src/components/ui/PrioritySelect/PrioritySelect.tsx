import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './PrioritySelect.module.css';
import { cn } from '@/lib/utils';
import { type Priority, PRIORITY_OPTIONS } from '@/stores/useBoardStore';
import Button from '../Button';

interface PrioritySelectProps {
  value?: Priority;
  onChange: (priority: Priority) => void;
}

export const PrioritySelect = ({ value, onChange }: PrioritySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (priority: Priority) => {
    onChange(priority);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={ref}>
      <label className={styles.label}>Приоритет</label>
      <Button
        type="button"
        variant="secondary"
        size="medium"
        icon={ChevronDown}
        iconPosition="right"
        className={cn(
          styles.trigger,
          value && styles[`priority-${value.level}`],
          isOpen && styles.open
        )}
        onClick={() => setIsOpen(!isOpen)}
        fullWidth
      >
        <span>{value ? value.label : 'Выберите приоритет'}</span>
      </Button>

      {isOpen && (
        <div className={styles.dropdown}>
          {PRIORITY_OPTIONS.map(priority => (
            <Button
              key={priority.level}
              type="button"
              variant="ghost"
              size="small"
              className={cn(
                styles.option,
                styles[`priority-${priority.level}`],
                value?.level === priority.level && styles.selected
              )}
              onClick={() => handleSelect(priority)}
              fullWidth
            >
              {priority.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
