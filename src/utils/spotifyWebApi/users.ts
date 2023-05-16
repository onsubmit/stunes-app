import { Err, Ok, Result } from 'ts-results';

import localStorageManager from '../LocalStorage';
import { executeAsync } from './spotifyWebApi';

export type CurrentUserProfile = { id: string; displayName: string; profilePhotoUrl: string };
export type Playlist = { id: string; name: string; playlistPhotoUrl: string };

/**
 * Gets detailed profile information about the current user.
 *
 * @export
 * @param {string} accessToken The access token.
 * @param {string} refreshToken The refresh token.
 * @return {*}  {Promise<Result<CurrentUserProfile, void>>} A promise that resolves to the result of the data retrieval.
 */
export async function getCurrentUserProfileAsync(
  accessToken: string,
  refreshToken: string
): Promise<Result<CurrentUserProfile, void>> {
  return executeAsync(accessToken, refreshToken, async (spotifyApi) => {
    const profile = await spotifyApi.getMe();

    const id = profile.id;
    const displayName = profile.display_name || 'unknown';
    const profilePhotoUrl = profile.images?.at(0)?.url || '';

    return new Ok({
      id,
      displayName,
      profilePhotoUrl,
    });
  });
}

export async function getUserPlaylistsAsync(
  accessToken: string,
  refreshToken: string
): Promise<Result<Playlist[], void>> {
  return executeAsync(accessToken, refreshToken, async (spotifyApi) => {
    const userIdResult = localStorageManager.get<string>('userId');
    if (!userIdResult.ok) {
      return Err.EMPTY;
    }

    const userId = userIdResult.val;
    const userPlaylists = await spotifyApi.getUserPlaylists(userId);

    const playlists: Playlist[] = userPlaylists.items.map((playlist) => {
      return {
        id: playlist.id,
        name: playlist.name,
        playlistPhotoUrl: playlist.images?.at(0)?.url || '',
      };
    });

    return new Ok(playlists);
  });
}
