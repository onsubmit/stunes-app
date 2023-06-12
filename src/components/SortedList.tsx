import { useEffect, useRef, useState } from 'react';

import { className, filterClass, multiSelectClass, selectContainer } from './SortedList.css';

export type SortedListProps = {
  title: string;
  pluralTitle: string;
  items: Map<string, string>;
  keyFilter?: Set<string>;
  onSelectedItemsChange?: (selectedItems: string[]) => void;
};

export const optionValueNoResults = '_stunes_no_results';
export const optionValueAll = '_stunes_all';

function SortedList({ title, pluralTitle, onSelectedItemsChange, items, keyFilter }: SortedListProps) {
  const [valueFilter, setValueFilter] = useState('');
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const select = selectRef.current;
    if (!select) {
      return;
    }

    select.selectedIndex = 0;
  }, [keyFilter]);

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
  const sortedItems = valueFilter || keyFilter?.size ? getSortedItemsForFilter(initialSortedItems) : initialSortedItems;

  const filteredTotal = sortedItems.length;
  const pluralizedTitle = originalTotal === 1 ? title : pluralTitle;
  const fullTitle =
    filteredTotal === originalTotal
      ? `All (${filteredTotal} ${pluralizedTitle.toLocaleLowerCase()})`
      : `All (${filteredTotal} of ${originalTotal} ${pluralizedTitle.toLocaleLowerCase()})`;

  return (
    <div className={className}>
      <div>
        <input
          className={filterClass}
          type="text"
          placeholder={title}
          value={valueFilter}
          onChange={onValueFilterChange}
        ></input>
      </div>
      <div className={selectContainer}>
        <select
          ref={selectRef}
          multiple
          name="list-box"
          defaultValue={[optionValueAll]}
          onChange={onSelectChange}
          className={multiSelectClass}
        >
          {filteredTotal ? (
            <option value={optionValueAll}>{fullTitle}</option>
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

  function getSortedItemsForFilter(items: { key: string; value: string }[]) {
    const filterLowerCase = valueFilter.toLocaleLowerCase();
    return items.filter((item) => {
      if (keyFilter?.size && !keyFilter.has(item.key)) {
        return false;
      }

      return item.value.toLocaleLowerCase().includes(filterLowerCase);
    });
  }

  function onValueFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValueFilter = event.target.value;
    setValueFilter(newValueFilter);

    const select = selectRef.current;
    if (!select) {
      return;
    }

    setSelectedValues(select, newValueFilter);
  }

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    if (!onSelectedItemsChange) {
      return;
    }

    const select = event.target;
    setSelectedValues(select, valueFilter);
  }

  function setSelectedValues(select: HTMLSelectElement, valueFilter: string) {
    if (!onSelectedItemsChange) {
      return;
    }

    const filtered = getSortedItemsForFilter(initialSortedItems);
    if (!filtered.length) {
      // NO RESULTS option is selected
      onSelectedItemsChange([optionValueNoResults]);
      return;
    }

    const selectedValues = [...select.selectedOptions].map((option) => option.value);
    if (selectedValues.length === 1 && select.selectedIndex === 0) {
      // ALL option is selected
      onSelectedItemsChange(keyFilter?.size || valueFilter ? filtered.map((item) => item.key) : []);
      return;
    }

    if (selectedValues.includes(optionValueAll)) {
      // Multiple are selected but ALL option is also selected.
      // Deselect everything except ALL option.
      select.selectedIndex = 0;
      onSelectedItemsChange([]);
      return;
    }

    onSelectedItemsChange(selectedValues);
  }
}

export default SortedList;
