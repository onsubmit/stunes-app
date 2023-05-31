import { style } from 'typestyle';

const height = 'calc(100vh - 64px - 32px)';

export const className = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: height,
  minHeight: height,
  maxHeight: height,
  background: '#121212',
  borderRadius: '6px',
  borderColor: '#000',
  margin: '0 6px 6px 0px',
  padding: '6px',
});

export const filtersClass = style({
  display: 'flex',
  flexDirection: 'row',
});

export const statusClass = style({
  color: '#999',
  margin: '6px',
});
