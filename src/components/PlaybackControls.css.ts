import { style } from 'typestyle';

export const className = style({
  margin: 'auto',
});

export const buttonClass = style({
  border: '1px solid #1ED760',
  borderRadius: '6px',
  color: '#fff',
  fontFamily: 'Rubik',
  background: '#1E1E1E',
  fontSize: '16px',
  padding: '12px',
  cursor: 'pointer',
  $nest: {
    '&:hover': { background: '#121212' },
    '&:active': { background: '#000', transform: 'scale(0.98)' },
  },
});
