import { useRef, useState } from 'react';

import { className, filterClass, multiSelectClass } from './SortableList.css';

export type SortableListProps = {
  title: string;
  pluralTitle: string;
  items: Map<string, string>;
  keyFilter: Set<string>;
  onSelectedItemsChange?: (selectedItems: string[]) => void;
};

export const optionValueNoResults = '_stunes_no_results';

function SortableList({ title, pluralTitle, onSelectedItemsChange, items, keyFilter }: SortableListProps) {
  const optionValueAll = '_stunes_all';

  const [userFilter, setUserFilter] = useState('');
  const selectRef = useRef<HTMLSelectElement>(null);

  const initialSortedItems = [...items]
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => {
      const lowerA = a.value.toLocaleLowerCase();
      const lowerB = b.value.toLocaleLowerCase();
      if (lowerA < lowerB) {
        return -1;
      }

      if (lowerA > lowerB) {
        return 1;
      }

      return 0;
    });

  const originalTotal = initialSortedItems.length;
  const sortedItems =
    userFilter || keyFilter.size
      ? getSortedItemsForFilter(keyFilter, userFilter, initialSortedItems)
      : initialSortedItems;

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
          value={userFilter}
          onChange={onFilterChange}
        ></input>
      </div>
      <div>
        <select
          ref={selectRef}
          multiple
          name="list-box"
          defaultValue={[optionValueAll]}
          onChange={onSelectChange}
          className={multiSelectClass}
        >
          {filteredTotal ? (
            <option value={optionValueAll}>All ({parentheticalItems.join(', ')})</option>
          ) : (
            <option value={optionValueNoResults}>(no results)</option>
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

  function getSortedItemsForFilter(
    keyFilter: Set<string>,
    valueVilter: string,
    items: { key: string; value: string }[]
  ) {
    const filterLowerCase = valueVilter.toLocaleLowerCase();
    return items.filter((item) => {
      if (keyFilter.size && !keyFilter.has(item.key)) {
        return false;
      }

      return item.value.toLocaleLowerCase().includes(filterLowerCase);
    });
  }

  function onFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newFilter = event.target.value;
    setUserFilter(newFilter);

    const select = selectRef.current;
    if (!select) {
      return;
    }

    setSelectedValues(select, newFilter);
  }

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    if (!onSelectedItemsChange) {
      return;
    }

    const select = event.target;
    setSelectedValues(select, userFilter);
  }

  function setSelectedValues(select: HTMLSelectElement, filter: string) {
    if (!onSelectedItemsChange) {
      return;
    }

    const filtered = getSortedItemsForFilter(keyFilter, filter, initialSortedItems);
    if (!filtered.length) {
      // NO RESULTS option is selected
      onSelectedItemsChange([optionValueNoResults]);
      return;
    }

    const selectedValues = [...select.selectedOptions].map((option) => option.value);
    if (selectedValues.length === 1 && select.selectedIndex === 0) {
      // ALL option is selected
      onSelectedItemsChange(filter ? filtered.map((item) => item.key) : []);
      return;
    }

    if (selectedValues.includes(optionValueAll)) {
      // Multiple are selected but ALL option is also selected.
      // Deselect everything except ALL option.
      select.selectedIndex = 0;
      onSelectedItemsChange([]);
      //setSelectedValues(select, filter);
      return;
    }

    onSelectedItemsChange(selectedValues);
  }
}

export default SortableList;
