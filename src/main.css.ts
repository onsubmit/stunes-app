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
  transition: box-shadow 0.25s ease;
}

.gutter:hover {
  box-shadow: inset 20px 20px 20px #333;
  background-image: none;
}
`);
