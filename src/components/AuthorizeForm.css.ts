import { style } from 'typestyle';

export const className = style({
  display: 'flex',
  margin: '0 12px',
  alignItems: 'center',
  height: '64px',
});

export const anchorClass = style({
  $nest: {
    '&:link': { color: '#1ED760' },
    '&&:visited': { color: '#1ED760' },
    '&&&:hover': { color: '#1ED760' },
    '&&&&:active': { color: '#1ED760' },
  },
});
