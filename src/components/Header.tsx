import AuthorizeForm from './AuthorizeForm';
import CurrentSong from './CurrentSong';
import { className } from './Header.css';

function Header() {
  return (
    <div className={className}>
      <CurrentSong />
      <AuthorizeForm />
    </div>
  );
}

export default Header;
