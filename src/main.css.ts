import { cssRule } from 'typestyle';

cssRule(':root', {
  margin: '0',
  padding: '0',
  background: '#000',
  fontFamily: 'Rubik',
  color: '#fff',
});

cssRule('a, a:visited', {
  color: '#1ED760',
  textDecoration: 'none',
});

cssRule('a:hover', {
  color: '#1ED760',
  textDecoration: 'underline',
});

cssRule('a:active, a:visited:active', {
  color: '#169C46',
  textDecoration: 'underline',
});
