import { style } from 'typestyle';

const height = 'calc(100vh - 64px - 32px - 400px)';

export const className = style({
  flex: 1,
  maxHeight: height,
  overflowY: 'auto',
  borderRadius: '6px',
  borderColor: '#000',
  background: '#121212',
  margin: '0 6px 6px 0',
  padding: '6px',
});

export const tableClass = style({
  width: 'calc(100% - 24px)',
  borderCollapse: 'collapse',
  margin: '12px',
  $nest: {
    'tr:first-of-type': {
      borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
    },
    th: {
      textAlign: 'left',
    },
    'th, td': {
      padding: '12px',
    },
    'tr:not(:first-of-type)': {
      $nest: {
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
});

export const titleColumnClass = style({
  width: '50%',
});

export const albumColumnClass = style({
  width: '50%',
});
