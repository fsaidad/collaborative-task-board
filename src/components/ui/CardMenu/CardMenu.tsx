import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import styles from './CardMenu.module.css';

interface CardMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const CardMenu = ({ onEdit, onDelete, className }: CardMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        setPosition({
          top: rect.bottom + window.scrollY + 4,
          right: window.innerWidth - rect.right,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      });
    }

    setIsOpen(!isOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
    setIsOpen(false);
  };

  return (
    <div className={`${styles.menuContainer} ${className || ''}`} ref={buttonRef}>
      <Button
        variant="ghost"
        size="small"
        icon={MoreVertical}
        onClick={handleToggle}
        className={styles.menuButton}
        aria-label="Действия"
        aria-expanded={isOpen}
      />

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={styles.menuDropdownPortal}
            style={{
              position: 'absolute',
              top: position.top,
              right: position.right,
              zIndex: 99999,
            }}
          >
            {onEdit && (
              <Button
                variant="ghost"
                size="small"
                icon={Edit2}
                onClick={handleEdit}
                className={styles.menuItem}
                fullWidth
              >
                Редактировать
              </Button>
            )}

            {onDelete && (
              <Button
                variant="ghost"
                size="small"
                icon={Trash2}
                onClick={handleDelete}
                className={`${styles.menuItem} ${styles.deleteItem}`}
                fullWidth
              >
                Удалить
              </Button>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};
