import { className, filterClass, listClass, scrollableClass } from './SortableList.css';

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
      <div>
        <input className={filterClass} type="text" placeholder={title}></input>
      </div>
      <div className={scrollableClass}>
        <ul className={listClass}>
          {sortedItems.length && (
            <li>
              All ({sortedItems.length} {(sortedItems.length === 1 ? title : `${title}s`).toLocaleLowerCase()})
            </li>
          )}
          {sortedItems.map((item) => (
            <li key={item.key}>{item.value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SortableList;
