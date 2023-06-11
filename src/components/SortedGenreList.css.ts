import { style } from 'typestyle';

export const className = style({
  //flex: 1,
  height: '100%',
  $nest: {
    '> div': {
      height: 'calc(100% - 12px)',
    },
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
