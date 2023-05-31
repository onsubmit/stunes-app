import { style } from 'typestyle';

const height = 'calc(100vh - 64px - 32px - 400px)';

export const className = style({
  flex: 1,
  maxHeight: height,
  overflowY: 'auto',
});

export const tableClass = style({
  width: '100%',
  borderCollapse: 'collapse',
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
