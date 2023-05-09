import { style } from 'typestyle';

export const className = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '10px',
});

export const albumArtPhoto = style({
  width: '64px',
  height: '64px',
});

export const songNameClass = style({
  fontWeight: 'bold',
});
