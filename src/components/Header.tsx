import AuthorizeForm from './AuthorizeForm';
import CurrentSong from './CurrentSong';
import DevicePicker from './DevicePicker';
import { className } from './Header.css';
import PlaybackControls from './PlaybackControls';

function Header() {
  return (
    <div className={className}>
      <CurrentSong />
      <PlaybackControls />
      <DevicePicker />
      <AuthorizeForm />
    </div>
  );
}

export default Header;
