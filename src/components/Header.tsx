import AuthorizeForm from './AuthorizeForm';
import CurrentSong from './CurrentSong';
import { className } from './Header.css';
import PlaybackControls from './PlaybackControls';

function Header() {
  return (
    <div className={className}>
      <CurrentSong />
      <PlaybackControls />
      <AuthorizeForm />
    </div>
  );
}

export default Header;
