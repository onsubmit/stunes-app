import { useQuery } from '@tanstack/react-query';
import { Err, Ok, Result } from 'ts-results';
import { classes } from 'typestyle';

import { getOrRefreshAccessTokenAsync } from '../utils/getOrRefreshAccessTokenAsync';
import { getUserPlaylistsAsync, Playlist } from '../utils/spotifyWebApi/users';
import {
  anchorClass,
  className,
  playlistInfo,
  playlistPhoto,
  selectedPlaylistClass,
  statusClass,
} from './Playlists.css';

type PlaylistsProps = {
  updateSelectedPlaylists: (newSelectedPlaylists: string[]) => void;
};

function Playlists({ updateSelectedPlaylists }: PlaylistsProps) {
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

      if (propsResult.val[0]) {
        updateSelectedPlaylists([propsResult.val[0].id]);
      }

      return new Ok(propsResult.val);
    },
  });

  function onClickPlaylist(anchor: HTMLAnchorElement, newSelectedPlaylists: string[]) {
    anchor.parentElement
      ?.querySelectorAll(`.${selectedPlaylistClass}`)
      .forEach((sibling) => sibling.classList.remove(selectedPlaylistClass));

    anchor.classList.toggle(selectedPlaylistClass);

    updateSelectedPlaylists(newSelectedPlaylists);
  }

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
      return <div className={statusClass}>Getting playlists...</div>;
    }

    if (error || currentPlaylistsResult?.err) {
      return <div className={statusClass}>An error occurred loading your playlists. Please try again.</div>;
    }

    if (currentPlaylistsResult?.ok) {
      if (currentPlaylistsResult.val) {
        return (
          <>
            {currentPlaylistsResult.val.map((playlist, index) => {
              return (
                <a
                  key={playlist.id}
                  href="#"
                  className={index === 0 ? classes(anchorClass, selectedPlaylistClass) : anchorClass}
                  onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
                    onClickPlaylist(event.currentTarget, [playlist.id])
                  }
                >
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
          </>
        );
      }
    }

    return <div className={statusClass}>No playlists found</div>;
  }

  return <div className={className}>{getElement()}</div>;
}

export default Playlists;
