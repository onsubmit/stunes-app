import SpotifyWebApi from 'spotify-web-api-js';
import { Err, Result } from 'ts-results';

import { refreshAccessTokenAsync } from '../../server';
import localStorageManager from '../LocalStorage';

import SpotifyWebApiJs = SpotifyWebApi.SpotifyWebApiJs;

/**
 * Executes a Spotify Web API. Will attempt to refresh the access token if needed.
 *
 * @export
 * @template T The type of the response.
 * @param {string} accessToken The access token.
 * @param {string} refreshToken The refresh token.
 * @param {(spotifyApi: SpotifyWebApiJs) => Promise<Result<T, void>>} fnAsync An asynchronous function that invokes a single Spotify Web API.
 * @return {*}  {Promise<Result<T, void>>} A promise that resolves to the result of the function that invokes a single Spotify Web API.
 */
export async function executeAsync<T>(
  accessToken: string,
  refreshToken: string,
  fnAsync: (spotifyApi: SpotifyWebApiJs) => Promise<Result<T, void>>
): Promise<Result<T, void>> {
  return await executeAsyncInternal<T>(accessToken, refreshToken, fnAsync, true /* allowTokenRefresh */);
}

async function executeAsyncInternal<T>(
  accessToken: string,
  refreshToken: string,
  fnAsync: (spotifyApi: SpotifyWebApiJs) => Promise<Result<T, void>>,
  allowTokenRefresh: boolean
): Promise<Result<T, void>> {
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    return await fnAsync(spotifyApi);
  } catch (err: unknown) {
    if (err instanceof XMLHttpRequest) {
      const request = err;

      // The response is 401: Unauthorized when the access token has expired.
      if (request.status !== 401 || !request.response) {
        return Err.EMPTY;
      }

      try {
        const response = JSON.parse(request.response);
        if (!allowTokenRefresh || response?.error?.message !== 'The access token expired') {
          return Err.EMPTY;
        }

        const refreshAccessTokenResult = await refreshAccessTokenAsync(refreshToken);
        if (!refreshAccessTokenResult.ok) {
          return Err.EMPTY;
        }

        const { access_token, expires_in } = refreshAccessTokenResult.val;
        localStorageManager.set('access_token', access_token);
        localStorageManager.set<number>('expires', new Date().getTime() + 1000 * expires_in);

        return await executeAsyncInternal<T>(access_token, refreshToken, fnAsync, false /* allowTokenRefresh */);
      } catch {
        return Err.EMPTY;
      }
    }

    return Err.EMPTY;
  }
}
