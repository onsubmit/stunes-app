import { style } from 'typestyle';

const height = 'calc(100vh - 64px - 14px)';

export const className = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: height,
  minHeight: height,
  maxHeight: height,
});

export const filtersClass = style({
  display: 'flex',
  flexDirection: 'row',
});

export const statusClass = style({
  color: '#999',
  margin: '6px',
});
