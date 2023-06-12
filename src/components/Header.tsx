import { useState } from 'react';

import AuthorizeForm from './AuthorizeForm';
import CurrentSong from './CurrentSong';
import DevicePicker from './DevicePicker';
import { className } from './Header.css';
import PlaybackControls from './PlaybackControls';

export type HeaderProps = {
  updateIsConnected: (isConnected: boolean) => void;
};

function Header({ updateIsConnected }: HeaderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [refetchCurrentSongCount, setRefetchCurrentSongCount] = useState(0);

  function onPlaybackStarted() {
    setTimeout(() => {
      // Wait a second for playback to start before refreshing current track.
      setRefetchCurrentSongCount(refetchCurrentSongCount + 1);
    }, 1000);
  }

  return (
    <div className={className}>
      {isConnected && (
        <>
          <CurrentSong refetchCount={refetchCurrentSongCount} />
          <PlaybackControls onPlaybackStarted={onPlaybackStarted} />
          <DevicePicker />
        </>
      )}
      <AuthorizeForm
        updateIsConnected={(value: boolean) => {
          setIsConnected(value);
          updateIsConnected(value);
        }}
      />
    </div>
  );
}

export default Header;
