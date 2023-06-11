import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Split from 'react-split';
import { Err, Ok, Result } from 'ts-results';

import { artistGenreMap } from '../utils/ArtistGenreMap';
import { getOrRefreshAccessTokenAsync } from '../utils/getOrRefreshAccessTokenAsync';
import { getPlaylistItemsAsync, Track } from '../utils/spotifyWebApi/playlists';
import { className, filtersClass, splitClass, statusClass } from './ContentContainer.css';
import SortedGenreList from './SortedGenreList';
import SortedList, { optionValueAll, optionValueNoResults } from './SortedList';
import TrackList, { TrackListFilter } from './TrackList';

type ContentContainerProps = {
  selectedPlaylists: string[];
};

function ContentContainer({ selectedPlaylists }: ContentContainerProps) {
  const queryKey = 'getPlaylistTracks';

  const [artistsMap, setArtistsMap] = useState<Map<string, string>>(new Map());
  const [artistsFilter, setArtistsFilter] = useState<Set<string>>(new Set());
  const [albumsFilter, setAlbumsFilter] = useState<Set<string>>(new Set());
  const [albumsMap, setAlbumsMap] = useState<Map<string, string>>(new Map());
  const [tracksMap, setTracksMap] = useState<Map<string, Track>>(new Map());
  const [trackListFilter, setTrackListFilter] = useState<TrackListFilter>({
    hideAll: false,
    genres: [],
    artists: [],
    albums: [],
  });

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
          <Split className={splitClass} direction="vertical" sizes={[30, 70]} gutterSize={6} minSize={200}>
            <Split className={filtersClass} minSize={300} gutterSize={6}>
              <SortedGenreList
                artistIds={new Set(artistsMap.keys())}
                onSelectedGenresChange={onSelectedGenresChange}
                onUpdateArtistGenreMap={onUpdateArtistGenreMap}
              />
              <SortedList
                title="Artist"
                pluralTitle="Artists"
                items={artistsMap}
                keyFilter={artistsFilter}
                onSelectedItemsChange={onSelectedArtistsChange}
              />
              <SortedList
                title="Album"
                pluralTitle="Albums"
                items={albumsMap}
                keyFilter={albumsFilter}
                onSelectedItemsChange={onSelectedAlbumsChange}
              />
            </Split>
            <TrackList tracks={tracksMap} filter={trackListFilter} />
          </Split>
        );
      }
    }

    return <div className={statusClass}>No tracks found</div>;
  }

  return <div className={className}>{getElement()}</div>;

  function onSelectedGenresChange(selectedGenres: string[]) {
    if (!playlistTracksResult?.ok || !playlistTracksResult.val) {
      return;
    }

    if (!selectedGenres.length || selectedGenres[0] === optionValueAll) {
      setArtistsFilter(new Set());
      setAlbumsFilter(new Set());

      const newTrackListFilter = {
        ...trackListFilter,
        genres: selectedGenres,
        artists: [],
        albums: [],
      };

      setTrackListFilter(newTrackListFilter);
      return;
    }

    const artistIds = new Set<string>();
    const albumIds = new Set<string>();
    if (selectedGenres[0] !== optionValueNoResults) {
      for (const track of playlistTracksResult.val) {
        if (
          selectedGenres.length &&
          !selectedGenres.some((genre) =>
            artistGenreMap.hasGenre(
              track.artists.map((artist) => artist.id),
              genre
            )
          )
        ) {
          continue;
        }

        track.artists.forEach((artist) => {
          artistIds.add(artist.id);
        });

        albumIds.add(track.album.id);
      }
    }

    setArtistsFilter(artistIds);
    setAlbumsFilter(albumIds);

    const newTrackListFilter = {
      ...trackListFilter,
      genres: selectedGenres,
      artists: [...artistIds],
      albums: [...albumIds],
    };

    setTrackListFilter(newTrackListFilter);
  }

  function onSelectedArtistsChange(selectedArtists: string[]) {
    if (!playlistTracksResult?.ok || !playlistTracksResult.val) {
      return;
    }

    if (!selectedArtists.length || selectedArtists[0] === optionValueAll) {
      setAlbumsFilter(new Set());

      const newTrackListFilter = {
        ...trackListFilter,
        artists: selectedArtists,
        albums: [],
      };

      setTrackListFilter(newTrackListFilter);
      return;
    }

    const albumIds = new Set<string>();
    if (selectedArtists[0] !== optionValueNoResults) {
      for (const track of playlistTracksResult.val) {
        if (selectedArtists.length) {
          const intersection = track.artists
            .map((artist) => artist.id)
            .filter((artistId) => selectedArtists.includes(artistId));

          if (!intersection.length) {
            continue;
          }
        }

        albumIds.add(track.album.id);
      }
    }

    setAlbumsFilter(albumIds);

    const newTrackListFilter = {
      ...trackListFilter,
      artists: selectedArtists,
      albums: [...albumIds],
    };

    setTrackListFilter(newTrackListFilter);
  }

  function onSelectedAlbumsChange(selectedAlbums: string[]) {
    setTrackListFilter({
      ...trackListFilter,
      albums: selectedAlbums,
    });
  }

  function onUpdateArtistGenreMap(artistId: string, genres: string[]) {
    artistGenreMap.add(artistId, genres);
  }
}

export default ContentContainer;
