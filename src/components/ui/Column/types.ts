// export interface ColumnData {
//   id: string;
//   title: string;
//   cardCount: number;
// }

// export interface CardData {
//   id: string;
//   title: string;
//   description?: string;
// }

// export interface ColumnUIProps {
//   column: ColumnData;
//   cards: CardData[];
//   onAddCard: () => void;
//   onCardClick: (cardId: string) => void;
// }
export interface ColumnUIProps {
  title: string;
  cardIds: string[];
  cardCount: number;
  onAddCard: () => void;
  onCardClick: (cardId: string) => void;
  className?: string;
}
