import { cssRaw, style } from 'typestyle';

const height = 'calc(100vh - 64px - 32px)';

export const className = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginRight: '6px',
  height: height,
  minHeight: height,
  maxHeight: height,
});

export const splitClass = style({
  height: '100%',
});

export const filtersClass = style({
  display: 'flex',
  flexDirection: 'row',
  $nest: {
    '> div:not(:last-child)': {
      marginRight: '6px',
    },
  },
});

export const statusClass = style({
  color: '#999',
  margin: '6px',
});

cssRaw(`
.gutter.gutter-vertical {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAGCAYAAADUtS5UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAjSURBVChTY0xLS/vPAASzZs1iBNH04jOBiFFADzDS4piBAQBtPjxpyMOXRAAAAABJRU5ErkJggg==');
  cursor: row-resize;
}`);
