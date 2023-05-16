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
  borderRadius: '6px',
  borderColor: '#000',
});

export const songNameClass = style({
  fontWeight: 'bold',
});
