import { useState } from 'react';

import AuthorizeForm from './AuthorizeForm';
import CurrentSong from './CurrentSong';
import DevicePicker from './DevicePicker';
import { className } from './Header.css';
import PlaybackControls from './PlaybackControls';

function Header() {
  const [refetchCurrentSongCount, setRefetchCurrentSongCount] = useState(0);

  function onPlaybackStarted() {
    setTimeout(() => {
      // Wait a second for playback to start before refreshing current track.
      setRefetchCurrentSongCount(refetchCurrentSongCount + 1);
    }, 1000);
  }

  return (
    <div className={className}>
      <CurrentSong refetchCount={refetchCurrentSongCount} />
      <PlaybackControls onPlaybackStarted={onPlaybackStarted} />
      <DevicePicker />
      <AuthorizeForm />
    </div>
  );
}

export default Header;
