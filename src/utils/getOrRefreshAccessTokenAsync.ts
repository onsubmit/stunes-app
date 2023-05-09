import { Err, Ok, Result } from 'ts-results';

import { refreshAccessTokenAsync } from '../server';
import localStorageManager from './LocalStorage';

export async function getOrRefreshAccessTokenAsync(): Promise<
  Result<{ accessToken: string; refreshToken: string }, void>
> {
  const localStorageResult = getAccessTokenFromLocalStorage();
  if (!localStorageResult.ok) {
    return Err.EMPTY;
  }

  const { accessToken, refreshToken, expires } = localStorageResult.val;
  const isAccessTokenExpired = new Date().getTime() > expires;
  if (!isAccessTokenExpired) {
    return new Ok({ accessToken, refreshToken });
  }

  const refreshAccessTokenResult = await refreshAccessTokenAsync(refreshToken);
  if (!refreshAccessTokenResult.ok) {
    return Err.EMPTY;
  }

  const { access_token, expires_in: expiresInSeconds } = refreshAccessTokenResult.val;
  localStorageManager.set('access_token', access_token);
  localStorageManager.set<number>('expires', new Date().getTime() + 1000 * expiresInSeconds);

  return new Ok({ accessToken, refreshToken });
}

function getAccessTokenFromLocalStorage(): Result<
  { accessToken: string; refreshToken: string; expires: number },
  void
> {
  const accessTokenResult = localStorageManager.get<string>('access_token');
  const refreshTokenResult = localStorageManager.get<string>('refresh_token');
  const expiresResult = localStorageManager.get<number>('expires');

  if (!accessTokenResult.ok || !refreshTokenResult.ok || !expiresResult.ok) {
    return Err.EMPTY;
  }

  return new Ok({
    accessToken: accessTokenResult.val,
    refreshToken: refreshTokenResult.val,
    expires: expiresResult.val,
  });
}
