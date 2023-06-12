import { Err, Ok, Result } from 'ts-results';

import { getOrRefreshAccessTokenAsync } from '../utils/getOrRefreshAccessTokenAsync';
import { addItemsToPlaybackQueueAsync, startPlaybackAsync } from '../utils/spotifyWebApi/player';
import { buttonClass, className } from './PlaybackControls.css';
import { selectedTableRowClass } from './TrackList.css';

export type PlaybackControlsProps = {
  onPlaybackStarted: () => void;
};

function PlaybackControls({ onPlaybackStarted }: PlaybackControlsProps) {
  async function onPlaySelectedAsync() {
    const trackUrisResult = getSelectedTrackUris();
    const trackUris = trackUrisResult.val;
    if (!trackUris) {
      return;
    }

    const refreshAccessTokenResult = await getOrRefreshAccessTokenAsync();
    if (!refreshAccessTokenResult.ok) {
      return;
    }

    const { accessToken, refreshToken } = refreshAccessTokenResult.val;
    await startPlaybackAsync(accessToken, refreshToken, trackUris);
    onPlaybackStarted();
  }

  async function onEnqueueSelectedAsync() {
    const trackUrisResult = getSelectedTrackUris();
    const trackUris = trackUrisResult.val;
    if (!trackUris) {
      return;
    }

    const refreshAccessTokenResult = await getOrRefreshAccessTokenAsync();
    if (!refreshAccessTokenResult.ok) {
      return;
    }

    const { accessToken, refreshToken } = refreshAccessTokenResult.val;
    await addItemsToPlaybackQueueAsync(accessToken, refreshToken, trackUris);
    onPlaybackStarted();
  }

  function getSelectedTrackUris(): Result<string[], void> {
    const tracks = document.getElementById('tracks');
    if (!tracks) {
      throw new Error("Can't get tracks");
    }

    const selectedTracks = tracks.querySelectorAll(`tbody > tr.${selectedTableRowClass}`);
    if (!selectedTracks?.length) {
      return Err.EMPTY;
    }

    const trackUris = [...selectedTracks].map((row) => row.getAttribute('data-track-uri') || '');
    if (!trackUris.some((uri) => uri)) {
      return Err.EMPTY;
    }

    return new Ok(trackUris);
  }

  return (
    <div className={className}>
      <button className={buttonClass} onClick={onPlaySelectedAsync}>
        Play selected
      </button>
      <button className={buttonClass} onClick={onEnqueueSelectedAsync}>
        Add selected to queue
      </button>
    </div>
  );
}

export default PlaybackControls;
