import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Err, Ok, Result } from 'ts-results';
import { classes } from 'typestyle';

import { getOrRefreshAccessTokenAsync } from '../utils/getOrRefreshAccessTokenAsync';
import { CurrentTrack, getCurrentlyPlayingTrackAsync } from '../utils/spotifyWebApi/player';
import { albumArtPhoto, className, songNameClass, statusClass } from './CurrentSong.css';

export type CurrentSongProps = {
  refetchCount: number;
};

function CurrentSong({ refetchCount }: CurrentSongProps) {
  const queryKey = 'getCurrentSong';
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    isLoading,
    error,
    data: currentSongResult,
  } = useQuery({
    queryKey: [queryKey, refetchCount],
    retry: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: isPlaying ? 5000 : 60000,

    queryFn: async () => {
      const propsResult = await getCurrentSongAsync();
      if (!propsResult.ok) {
        setIsPlaying(false);
        return Ok.EMPTY;
      }

      setIsPlaying(!!propsResult.val?.isCurrentlyPlaying);

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
      return <div className={classes(className, statusClass)}>Getting current song...</div>;
    }

    if (error || currentSongResult?.err) {
      return (
        <div className={classes(className, statusClass)}>
          An error occurred loading your current song. Please try again.
        </div>
      );
    }

    if (currentSongResult?.ok) {
      if (currentSongResult.val) {
        const { artists, song, songUrl, albumUrl, albumArtUrl } = currentSongResult.val;

        return (
          <div className={className} style={albumArtUrl ? { marginLeft: 0 } : undefined}>
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

    return <div className={classes(className, statusClass)}>No currently playing track</div>;
  }

  return getElement();
}

export default CurrentSong;
