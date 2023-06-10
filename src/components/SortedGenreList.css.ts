import { style } from 'typestyle';

export const className = style({
  flex: 1,
  $nest: {
    // Don't captitalize the first <option>
    'option:not(:first-child)': {
      textTransform: 'capitalize',
    },
  },
});

export const statusClass = style({
  flex: 1,
  color: '#999',
  margin: '6px',
});
