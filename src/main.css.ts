import { cssRaw, cssRule } from 'typestyle';

cssRule(':root', {
  background: '#000',
  fontFamily: 'Rubik',
  color: '#fff',
});

cssRule(':root, body', {
  margin: '0',
  padding: '0',
});

cssRule('a, a:visited', {
  color: '#fff',
  textDecoration: 'none',
});

cssRule('a:hover', {
  color: '#fff',
  textDecoration: 'underline',
});

cssRule('a:active, a:visited:active', {
  color: '#fff',
  textDecoration: 'underline',
});

cssRaw(`
.gutter {
  background-repeat: no-repeat;
  background-position: 50%;
}
`);
