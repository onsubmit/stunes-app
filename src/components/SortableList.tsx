import { useState } from 'react';

import { className, filterClass, multiSelectClass } from './SortableList.css';

export type SortableListProps = {
  title: string;
  pluralTitle: string;
  items: Map<string, string>;
  onSelectedItemsChange?: (selectedItems: string[]) => void;
};

function SortableList({ title, pluralTitle, onSelectedItemsChange, items }: SortableListProps) {
  const [filter, setFilter] = useState('');

  let sortedItems = [...items]
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

  const originalTotal = sortedItems.length;
  if (filter) {
    const filterLowerCase = filter.toLocaleLowerCase();
    sortedItems = sortedItems.filter((item) => item.value.toLocaleLowerCase().includes(filterLowerCase));
  }

  const filteredTotal = sortedItems.length;
  const pluralizedTitle = filteredTotal === 1 ? title : pluralTitle;
  const parentheticalItems = [`${filteredTotal} ${pluralizedTitle.toLocaleLowerCase()}`];
  if (filteredTotal !== originalTotal) {
    parentheticalItems.push(`${originalTotal} total`);
  }

  return (
    <div className={className}>
      <div>
        <input
          className={filterClass}
          type="text"
          placeholder={title}
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        ></input>
      </div>
      <div>
        <select
          multiple
          name="list-box"
          onChange={(event) => onSelectedItemsChange?.([...event.target.selectedOptions].map((option) => option.value))}
          className={multiSelectClass}
        >
          {filteredTotal ? (
            <option value="_stunes_all">All ({parentheticalItems.join(', ')})</option>
          ) : (
            <option value="_stunes_no_results">(no results)</option>
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
