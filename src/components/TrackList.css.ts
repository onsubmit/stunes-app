import { style } from 'typestyle';
import { NestedCSSProperties } from 'typestyle/lib/types';

export const className = style({
  overflow: 'auto',
  borderRadius: '6px',
  borderColor: '#000',
  background: '#121212',
  margin: '0 6px 6px 0',
  padding: '6px',
});

export const innerClass = style({
  overflowY: 'auto',
});

const showPlayButton: NestedCSSProperties = {
  $nest: {
    'td:first-of-type': {
      $nest: {
        p: {
          display: 'none',
        },
        '&::after': {
          content: `'▶'`,
        },
      },
    },
  },
};

export const selectedTableRowClass = style({
  background: '#5A5A5A !important',
});

export const tableClass = style({
  width: 'calc(100% - 24px)',
  borderCollapse: 'collapse',
  margin: '12px',
  userSelect: 'none',
  $nest: {
    'thead tr': {
      borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
    },
    th: {
      textAlign: 'left',
    },
    'th, td': {
      padding: '12px',
    },
    tr: {
      $nest: {
        p: {
          margin: 0,
        },
        '&:hover': {
          ...showPlayButton,
        },
      },
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

export const indexColumnClass = style({
  minWidth: '14px',
});

export const titleColumnClass = style({
  width: '50%',
});

export const albumColumnClass = style({
  width: '50%',
});

export const titleClass = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
});

export const albumArtPhoto = style({
  width: '36px',
  height: '36px',
});
