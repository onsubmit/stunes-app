import { style } from 'typestyle';

export const className = style({
  width: '400px',
  maxHeight: 'calc(100vh - 64px - 18px)',
  background: '#121212',
  borderRadius: '6px',
  borderColor: '#000',
  margin: '0 6px 6px 6px',
  overflowY: 'scroll',
});

export const playlistInfo = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
  margin: '12px',
});

export const playlistPhoto = style({
  width: '44px',
  height: '44px',
  borderRadius: '2px',
  borderColor: '#000',
});
