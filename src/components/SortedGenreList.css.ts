import { style } from 'typestyle';

export const className = style({
  flex: 1,
  $nest: {
    option: {
      textTransform: 'capitalize',
    },
  },
});

export const statusClass = style({
  flex: 1,
  color: '#999',
  margin: '6px',
});
