import { Err, Ok, Result } from 'ts-results';

import { executeAsync } from './spotifyWebApi';

export async function getMeAsync(
  accessToken: string,
  refreshToken: string
): Promise<Result<{ displayName: string; profilePhotoUrl: string }, void>> {
  return executeAsync(accessToken, refreshToken, async (spotifyApi) => {
    const profile = await spotifyApi.getMe();
    if (!profile.display_name || !profile.images || !profile.images[0].url) {
      return Err.EMPTY;
    }

    return new Ok({
      displayName: profile.display_name,
      profilePhotoUrl: profile.images[0].url,
    });
  });
}
