import { cssRule } from 'typestyle';

cssRule(':root', {
  margin: '0',
  padding: '0',
  background: '#000',
  fontFamily: 'Rubik',
  color: '#fff',
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
