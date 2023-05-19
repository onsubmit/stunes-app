import { style } from 'typestyle';

const sideBarWidth = '350px';
const sideBarHeight = 'calc(100vh - 64px - 32px)';

export const className = style({
  width: sideBarWidth,
  minWidth: sideBarWidth,
  maxWidth: sideBarWidth,
  height: sideBarHeight,
  minHeight: sideBarHeight,
  maxHeight: sideBarHeight,
  background: '#121212',
  borderRadius: '6px',
  borderColor: '#000',
  margin: '0 6px 6px 6px',
  overflowY: 'auto',
  padding: '6px',
});

export const statusClass = style({
  color: '#999',
  margin: '6px',
});

export const playlistInfo = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
});

export const playlistPhoto = style({
  width: '44px',
  height: '44px',
  borderRadius: '2px',
  borderColor: '#000',
});

export const anchorClass = style({
  display: 'block',
  borderRadius: '2px',
  height: '44px',
  marginBottom: '6px',
  padding: '6px',
  $nest: {
    '&:link': { color: '#fff', textDecoration: 'none' },
    '&&:visited': { color: '#fff' },
    '&&&:hover': { color: '#fff', background: '#181818' },
    '&&&&:active': { color: '#fff' },
  },
});
