export interface ColumnUIProps {
  title: string;
  cardIds: string[];
  cardCount: number;
  onAddCard: () => void;
  onCardClick: (cardId: string) => void;
  className?: string;
}
