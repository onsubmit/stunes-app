import { useQuery } from '@tanstack/react-query';
import { Err, Ok, Result } from 'ts-results';

import { getOrRefreshAccessTokenAsync } from '../utils/getOrRefreshAccessTokenAsync';
import { getUserPlaylistsAsync, Playlist } from '../utils/spotifyWebApi/users';
import { anchorClass, className, playlistInfo, playlistPhoto } from './Playlists.css';

function Playlists() {
  const queryKey = 'getPlaylists';
  const {
    isLoading,
    error,
    data: currentPlaylistsResult,
  } = useQuery({
    queryKey: [queryKey],
    retry: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,

    queryFn: async () => {
      const propsResult = await getPlaylistsAsync();
      if (!propsResult.ok) {
        return Ok.EMPTY;
      }

      return new Ok(propsResult.val);
    },
  });

  async function getPlaylistsAsync(): Promise<Result<Playlist[], void>> {
    const result = await getOrRefreshAccessTokenAsync();
    if (!result.ok) {
      return Err.EMPTY;
    }

    const { accessToken, refreshToken } = result.val;
    return await getUserPlaylistsAsync(accessToken, refreshToken);
  }

  function getElement(): JSX.Element {
    if (isLoading) {
      return <p>Getting playlists...</p>;
    }

    if (error || currentPlaylistsResult?.err) {
      return <p>An error occurred loading your playlists. Please try again.</p>;
    }

    if (currentPlaylistsResult?.ok) {
      if (currentPlaylistsResult.val) {
        return (
          <div className={className}>
            {currentPlaylistsResult.val.map((playlist) => {
              return (
                <a key={playlist.id} href="#" className={anchorClass}>
                  <div className={playlistInfo}>
                    <div>
                      {playlist.playlistPhotoUrl && (
                        <img className={playlistPhoto} src={playlist.playlistPhotoUrl}></img>
                      )}
                    </div>
                    <div>{playlist.name}</div>
                  </div>
                </a>
              );
            })}
          </div>
        );
      }
    }

    return <div className={className}>No playlists.</div>;
  }

  return getElement();
}

export default Playlists;
