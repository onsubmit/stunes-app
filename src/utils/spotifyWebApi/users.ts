import { Ok, Result } from 'ts-results';

import { executeAsync } from './spotifyWebApi';

export type CurrentUserProfile = { displayName: string; profilePhotoUrl: string };

/**
 * Gets detailed profile information about the current user.
 *
 * @export
 * @param {string} accessToken The access token.
 * @param {string} refreshToken The refresh token.
 * @return {*}  {Promise<Result<CurrentUserProfile, void>>} A promise that resolves to the result of the data retrieval.
 */
export async function getCurrentUserProfile(
  accessToken: string,
  refreshToken: string
): Promise<Result<CurrentUserProfile, void>> {
  return executeAsync(accessToken, refreshToken, async (spotifyApi) => {
    const profile = await spotifyApi.getMe();

    const displayName = profile.display_name || 'unknown';
    const profilePhotoUrl = profile.images?.at(0)?.url || '';

    return new Ok({
      displayName,
      profilePhotoUrl,
    });
  });
}
