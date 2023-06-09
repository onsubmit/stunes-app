import { style } from 'typestyle';

export const className = style({
  flex: 1,
  borderRadius: '6px',
  borderColor: '#000',
  background: '#121212',
  margin: '0 6px 6px 0px',
  padding: '6px',
});

export const filterClass = style({
  width: 'calc(100% - 16px)',
  height: '20px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1px solid #333',
  padding: '6px',
  marginBottom: '6px',
  background: '#000',
  color: '#fff',
});

export const multiSelectClass = style({
  width: '100%',
  height: '380px',
  background: 'transparent',
  border: '1px solid transparent',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '14px',
  padding: 0,
  margin: 0,
  $nest: {
    '&:focus': {
      border: '1px solid #333',
    },
    option: {
      padding: '8px',
      margin: 0,
      $nest: {
        '&:checked': {
          background: '#333 -webkit-linear-gradient(bottom, #333 0%, #333 100%)',
        },
      },
    },
  },
});
