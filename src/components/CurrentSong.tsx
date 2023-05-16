import { useQuery } from '@tanstack/react-query';
import { Err, Ok, Result } from 'ts-results';

import { getOrRefreshAccessTokenAsync } from '../utils/getOrRefreshAccessTokenAsync';
import { CurrentTrack, getCurrentlyPlayingTrackAsync } from '../utils/spotifyWebApi/player';
import { albumArtPhoto, className, songNameClass } from './CurrentSong.css';

function CurrentSong() {
  const queryKey = 'getCurrentSong';
  const {
    isLoading,
    error,
    data: currentSongResult,
  } = useQuery({
    queryKey: [queryKey],
    retry: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,

    queryFn: async () => {
      const propsResult = await getCurrentSongAsync();
      if (!propsResult.ok) {
        return Ok.EMPTY;
      }

      return new Ok(propsResult.val);
    },
  });

  async function getCurrentSongAsync(): Promise<Result<CurrentTrack | void, void>> {
    const result = await getOrRefreshAccessTokenAsync();
    if (!result.ok) {
      return Err.EMPTY;
    }

    const { accessToken, refreshToken } = result.val;
    return await getCurrentlyPlayingTrackAsync(accessToken, refreshToken);
  }

  function getElement(): JSX.Element {
    if (isLoading) {
      return <p>Getting current song...</p>;
    }

    if (error || currentSongResult?.err) {
      return <p>An error occurred loading your current song. Please try again.</p>;
    }

    if (currentSongResult?.ok) {
      if (currentSongResult.val) {
        const { artists, song, songUrl, albumUrl, albumArtUrl } = currentSongResult.val;

        return (
          <div className={className}>
            {albumArtUrl && (
              <a href={albumUrl} className={albumArtPhoto} target="_blank" rel="noreferrer">
                <img className={albumArtPhoto} src={albumArtUrl}></img>
              </a>
            )}
            <div>
              <div className={songNameClass}>
                <a href={songUrl} target="_blank" rel="noreferrer">
                  {song}
                </a>
              </div>
              <div>
                {artists.map((a, i) => {
                  return (
                    <span key={`artist${i}`}>
                      <a href={a.href} target="_blank" rel="noreferrer">
                        {a.name}
                      </a>
                      {i < artists.length - 1 ? <span>, </span> : undefined}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }
    }

    return <div className={className}>No currently playing track.</div>;
  }

  return getElement();
}

export default CurrentSong;
