import { style } from 'typestyle';

const height = 'calc(100vh - 64px - 32px)';

export const className = style({
  width: '100%',
  height: height,
  minHeight: height,
  maxHeight: height,
  background: '#121212',
  borderRadius: '6px',
  borderColor: '#000',
  margin: '0 6px 6px 0px',
  overflowY: 'auto',
  padding: '6px',
});

export const statusClass = style({
  color: '#999',
  margin: '6px',
});
