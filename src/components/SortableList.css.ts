import { style } from 'typestyle';

export const className = style({
  flex: 1,
  borderRadius: '6px',
  borderColor: '#000',
  background: '#121212',
  margin: '0 6px 6px 0px',
  padding: '6px',
});

export const filterClass = style({
  width: 'calc(100% - 16px)',
  height: '20px',
  fontSize: '16px',
  borderRadius: '6px',
  padding: '6px',
  marginBottom: '6px',
  background: '#000',
  color: '#fff',
});

export const scrollableClass = style({
  maxHeight: '380px',
  overflowY: 'auto',
});

export const listClass = style({
  listStyleType: 'none',
  padding: 0,
  margin: 0,
});
