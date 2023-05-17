import { style } from 'typestyle';

export const className = style({
  display: 'flex',
  height: '64px',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
  marginRight: '12px',
});

export const profilePhoto = style({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
});

export const anchorClass = style({
  $nest: {
    '&:link': { color: '#1ED760' },
    '&&:visited': { color: '#1ED760' },
    '&&&:hover': { color: '#1ED760' },
    '&&&&:active': { color: '#1ED760' },
  },
});
