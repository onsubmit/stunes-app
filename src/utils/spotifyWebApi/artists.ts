import { Ok, Result } from 'ts-results';

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
  return executeAsync(accessToken, refreshToken, async (spotifyApi) => {
    // TODO: Chunk into 50 at a time.
    const response = await spotifyApi.getArtists(artistIds);
    return new Ok(
      response.artists.map((a) => {
        return { id: a.id, genres: a.genres };
      })
    );
  });
}
