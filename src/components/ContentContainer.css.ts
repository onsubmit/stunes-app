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
});

export const statusClass = style({
  color: '#999',
  margin: '6px',
});

cssRaw(`
.gutter.gutter-vertical {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAGCAYAAAA13jsFAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAnSURBVEhLYxgFo2AU4AGMaWlp/6HsUTAIABOUHgWjYBSMgkEPGBgAzncCNWU7Cq4AAAAASUVORK5CYII=');
  cursor: row-resize;
}

.gutter.gutter-horizontal {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAyCAYAAAB/J6rzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAqSURBVDhPY4CBtLS0/yAM5TIwQWkMMCqBAUYlMMCoBAYYlcAAtJdgYAAAI14ExTvInrcAAAAASUVORK5CYII=');
  cursor: col-resize;
}`);
