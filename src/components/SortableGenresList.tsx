import { useQuery } from '@tanstack/react-query';
import { Err, Ok, Result } from 'ts-results';

import { getOrRefreshAccessTokenAsync } from '../utils/getOrRefreshAccessTokenAsync';
import { Artist, getArtistsAsync } from '../utils/spotifyWebApi/artists';
import { statusClass } from './SortableGenresList.css';
import SortableList from './SortableList';

export type SortableGenresListProps = {
  artistIds: Set<string>;
  onSelectedGenresChange?: (selectedItems: string[]) => void;
};

function SortableGenresList({ artistIds, onSelectedGenresChange }: SortableGenresListProps) {
  const queryKey = 'getArtistGenres';

  const {
    isLoading,
    error,
    data: artistsResult,
  } = useQuery({
    queryKey: [queryKey, [...artistIds].join(',')],
    retry: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,

    queryFn: async () => {
      if (!artistIds.size) {
        return Ok.EMPTY;
      }

      const propsResult = await getArtistsFromIdsAsync();
      if (!propsResult.ok) {
        return Ok.EMPTY;
      }

      return new Ok(propsResult.val);
    },
  });

  async function getArtistsFromIdsAsync(): Promise<Result<Artist[], void>> {
    if (!artistIds.size) {
      return Err.EMPTY;
    }

    const result = await getOrRefreshAccessTokenAsync();
    if (!result.ok) {
      return Err.EMPTY;
    }

    const { accessToken, refreshToken } = result.val;
    return await getArtistsAsync(accessToken, refreshToken, [...artistIds]);
  }

  function getElement(): JSX.Element {
    if (isLoading) {
      return <div className={statusClass}>Getting playlist genres...</div>;
    }

    if (error || artistsResult?.err) {
      return (
        <div className={statusClass}>An error occurred loading the genres from the playlist. Please try again.</div>
      );
    }

    if (artistsResult?.ok) {
      if (artistsResult.val) {
        const genres: Map<string, string> = new Map();

        for (const artist of artistsResult.val) {
          for (const genre of artist.genres) {
            genres.set(genre, genre);
          }
        }

        return (
          <SortableList
            title="Genre"
            pluralTitle="Genres"
            items={genres}
            onSelectedItemsChange={onSelectedGenresChange}
          />
        );
      }
    }

    return <div className={statusClass}>No genres found</div>;
  }

  return getElement();
}

export default SortableGenresList;
