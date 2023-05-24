import { className } from './SortableList.css';

export type SortableListProps = {
  title: string;
  items: Map<string, string>;
};

function SortableList({ title, items }: SortableListProps) {
  const sortedItems = [...items]
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => {
      if (a.value < b.value) {
        return -1;
      }

      if (a.value > b.value) {
        return 1;
      }

      return 0;
    });

  return (
    <div className={className}>
      <div>{title}</div>
      <div>
        <ul>
          {sortedItems.map((item) => (
            <li key={item.key}>{item.value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SortableList;
