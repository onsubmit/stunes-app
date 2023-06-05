import { className, filterClass, multiSelectClass } from './SortableList.css';

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
      <div>
        <select multiple name="list-box" className={multiSelectClass}>
          {sortedItems.length && (
            <option value="All">
              All ({sortedItems.length} {(sortedItems.length === 1 ? title : `${title}s`).toLocaleLowerCase()})
            </option>
          )}
          {sortedItems.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SortableList;
