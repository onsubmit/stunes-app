import { Ok, Result } from 'ts-results';

import { chunkArray } from '../chunkArray';
import { executeAsync } from './spotifyWebApi';

export type Artist = {
  id: string;
  genres: string[];
};

export async function getArtistsAsync(
  accessToken: string,
  refreshToken: string,
  artistIds: string[]
): Promise<Result<Artist[], void>> {
  const limit = 50;

  return executeAsync(accessToken, refreshToken, async (spotifyApi) => {
    debugger;
    const getArtistsPromises: ReturnType<typeof spotifyApi.getArtists>[] = [];
    const chunkedArtistIds = chunkArray(artistIds, limit);
    for (const artistIdsChunk of chunkedArtistIds) {
      getArtistsPromises.push(spotifyApi.getArtists(artistIdsChunk));
    }

    const responses = await Promise.all(getArtistsPromises);
    const artists: Artist[] = [];
    for (const response of responses) {
      artists.push(
        ...response.artists.map((a) => {
          return { id: a.id, genres: a.genres };
        })
      );
    }

    return new Ok(artists);
  });
}
