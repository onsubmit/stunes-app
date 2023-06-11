import { getOrRefreshAccessTokenAsync } from '../utils/getOrRefreshAccessTokenAsync';
import { startPlaybackAsync } from '../utils/spotifyWebApi/player';
import { className } from './PlaybackControls.css';
import { selectedTableRowClass } from './TrackList.css';

function PlaybackControls() {
  async function onPlaySelectedAsync() {
    const tracks = document.getElementById('tracks');
    if (!tracks) {
      throw new Error("Can't get tracks");
    }

    const selectedTracks = tracks.querySelectorAll(`tbody > tr.${selectedTableRowClass}`);
    if (!selectedTracks?.length) {
      return;
    }

    const trackUris = [...selectedTracks].map((row) => row.getAttribute('data-track-uri') || '');
    if (!trackUris.some((uri) => uri)) {
      return;
    }

    const result = await getOrRefreshAccessTokenAsync();
    if (!result.ok) {
      return;
    }

    const { accessToken, refreshToken } = result.val;
    await startPlaybackAsync(accessToken, refreshToken, trackUris);
  }

  return (
    <div className={className}>
      <button onClick={onPlaySelectedAsync}>Play selected</button>
    </div>
  );
}

export default PlaybackControls;
