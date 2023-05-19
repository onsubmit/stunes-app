import { useQuery } from '@tanstack/react-query';
import { Err, Ok, Result } from 'ts-results';

import { getOrRefreshAccessTokenAsync } from '../utils/getOrRefreshAccessTokenAsync';
import { getPlaylistItemsAsync, Track } from '../utils/spotifyWebApi/playlists';
import { className, statusClass } from './ContentContainer.css';

type ContentContainerProps = {
  selectedPlaylists: string[];
};

function ContentContainer({ selectedPlaylists }: ContentContainerProps) {
  const queryKey = 'getPlaylistTracks';

  const {
    isLoading,
    error,
    data: playlistTracksResult,
  } = useQuery({
    queryKey: [queryKey, selectedPlaylists],
    retry: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,

    queryFn: async () => {
      if (!selectedPlaylists[0]) {
        return Ok.EMPTY;
      }

      const propsResult = await getPlaylistTracksAsync();
      if (!propsResult.ok) {
        return Ok.EMPTY;
      }

      return new Ok(propsResult.val);
    },
  });

  async function getPlaylistTracksAsync(): Promise<Result<Track[], void>> {
    if (!selectedPlaylists[0]) {
      return Err.EMPTY;
    }

    const result = await getOrRefreshAccessTokenAsync();
    if (!result.ok) {
      return Err.EMPTY;
    }

    const { accessToken, refreshToken } = result.val;
    return await getPlaylistItemsAsync(accessToken, refreshToken, selectedPlaylists[0]);
  }

  function getElement(): JSX.Element {
    if (isLoading) {
      return <div className={statusClass}>Getting playlist tracks...</div>;
    }

    if (error || playlistTracksResult?.err) {
      return (
        <div className={statusClass}>An error occurred loading the track from the playlist. Please try again.</div>
      );
    }

    if (playlistTracksResult?.ok) {
      if (playlistTracksResult.val) {
        return (
          <>
            {playlistTracksResult.val.map((track) => {
              return (
                <div key={track.id}>
                  <div>{track.song}</div>
                </div>
              );
            })}
          </>
        );
      }
    }

    return <div className={statusClass}>No tracks found</div>;
  }

  return <div className={className}>{getElement()}</div>;
}

export default ContentContainer;
