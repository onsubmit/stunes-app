import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Err, Ok, Result } from 'ts-results';

import { ArtistGenreMap } from '../utils/artistGenreMap';
import { getOrRefreshAccessTokenAsync } from '../utils/getOrRefreshAccessTokenAsync';
import { getPlaylistItemsAsync, Track } from '../utils/spotifyWebApi/playlists';
import { className, filtersClass, statusClass } from './ContentContainer.css';
import SortableGenresList from './SortableGenresList';
import SortableList, { optionValueNoResults } from './SortableList';
import TrackList, { TrackListFilter } from './TrackList';

type ContentContainerProps = {
  selectedPlaylists: string[];
};

function ContentContainer({ selectedPlaylists }: ContentContainerProps) {
  const queryKey = 'getPlaylistTracks';

  const [artistsMap, setArtistsMap] = useState<Map<string, string>>(new Map());
  const [albumsMap, setAlbumsMap] = useState<Map<string, string>>(new Map());
  const [tracksMap, setTracksMap] = useState<Map<string, Track>>(new Map());
  const [trackListFilter, setTrackListFilter] = useState<TrackListFilter>({
    hideAll: false,
    genres: [],
    artists: [],
    albums: [],
  });

  const artistGenreMap = new ArtistGenreMap();

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

      const artists: Map<string, string> = new Map();
      const albums: Map<string, string> = new Map();
      const tracks: Map<string, Track> = new Map();

      for (const track of propsResult.val) {
        tracks.set(track.id, track);

        track.artists.forEach((artist) => {
          artists.set(artist.id, artist.name);
        });

        albums.set(track.album.id, track.album.name);
      }

      setArtistsMap(artists);
      setAlbumsMap(albums);
      setTracksMap(tracks);

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
            <div className={filtersClass}>
              <SortableGenresList
                artistIds={new Set(artistsMap.keys())}
                onSelectedGenresChange={onSelectedGenresChange}
                onUpdateArtistGenreMap={onUpdateArtistGenreMap}
              />
              <SortableList
                title="Artist"
                pluralTitle="Artists"
                items={artistsMap}
                onSelectedItemsChange={onSelectedArtistsChange}
              />
              <SortableList
                title="Album"
                pluralTitle="Albums"
                items={albumsMap}
                onSelectedItemsChange={onSelectedAlbumsChange}
              />
            </div>

            <TrackList tracks={tracksMap} filter={trackListFilter} artistGenreMap={artistGenreMap} />
          </>
        );
      }
    }

    return <div className={statusClass}>No tracks found</div>;
  }

  return <div className={className}>{getElement()}</div>;

  function onSelectedGenresChange(selectedGenres: string[]) {
    setTrackListFilter({
      ...trackListFilter,
      genres: selectedGenres,
    });
  }

  function onSelectedArtistsChange(selectedArtists: string[]) {
    setTrackListFilter({
      ...trackListFilter,
      artists: selectedArtists,
    });

    if (!playlistTracksResult?.ok || !playlistTracksResult.val) {
      return;
    }

    const albums: Map<string, string> = new Map();
    for (const track of playlistTracksResult.val) {
      if (selectedArtists[0] === optionValueNoResults) {
        continue;
      }

      if (selectedArtists.length) {
        const intersection = track.artists
          .map((artist) => artist.id)
          .filter((artistId) => selectedArtists.includes(artistId));

        if (!intersection.length) {
          continue;
        }
      }

      albums.set(track.album.id, track.album.name);
    }

    setAlbumsMap(albums);
  }

  function onSelectedAlbumsChange(selectedAlbums: string[]) {
    setTrackListFilter({
      ...trackListFilter,
      albums: selectedAlbums,
    });

    if (!playlistTracksResult?.ok || !playlistTracksResult.val) {
      return;
    }

    const artists: Map<string, string> = new Map();
    for (const track of playlistTracksResult.val) {
      if (selectedAlbums[0] === optionValueNoResults) {
        continue;
      }

      if (selectedAlbums.length && !selectedAlbums.includes(track.album.id)) {
        continue;
      }

      track.artists.forEach((artist) => {
        artists.set(artist.id, artist.name);
      });
    }

    setArtistsMap(artists);
  }

  function onUpdateArtistGenreMap(artistId: string, genres: string[]) {
    artistGenreMap.add(artistId, genres);
  }
}

export default ContentContainer;
