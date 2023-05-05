import { Err, Ok, Result } from 'ts-results';

import localStorageManager, { LocalStorage } from '../utils/LocalStorage';
import { className } from './AuthorizeForm.css';

function AuthorizeForm() {
  const hash = window.location.hash;

  const getHashDataResult = getHashData();
  if (getHashDataResult.ok) {
    const { accessToken, refreshToken, expiresIn } = getHashDataResult.val;
    localStorageManager.set('access_token', accessToken);
    localStorageManager.set('refresh_token', refreshToken);
    localStorageManager.set<number>('expires', expiresIn);
  }

  const localStorageResult = getLocalStorageData();
  const showConnectButton = !localStorageResult.ok;

  function getLocalStorageData(): Result<{ accessToken: string; refreshToken: string }, void> {
    const accessTokenResult = localStorageManager.get<string>('access_token');
    const refreshTokenResult = localStorageManager.get<string>('refresh_token');
    const expiresResult = localStorageManager.get<number>('expires');

    if (accessTokenResult.ok && refreshTokenResult.ok && expiresResult.ok) {
      if (new Date().getTime() <= expiresResult.val) {
        return new Ok({
          accessToken: accessTokenResult.val,
          refreshToken: refreshTokenResult.val,
        });
      }
    }

    return Err.EMPTY;
  }

  function getHashData(): Result<{ accessToken: string; refreshToken: string; expiresIn: number }, void> {
    const accessTokenResult = getHashValue('access_token');
    const refreshTokenResult = getHashValue('refresh_token');
    const expiresInResult = getHashValue('expires_in');

    if (accessTokenResult.ok && refreshTokenResult.ok && expiresInResult.ok) {
      const expiresIn = parseInt(expiresInResult.val, 10);
      return new Ok({
        accessToken: accessTokenResult.val,
        refreshToken: refreshTokenResult.val,
        expiresIn: new Date().getTime() + expiresIn,
      });
    }

    return Err.EMPTY;
  }

  function getHashValue(key: keyof Omit<LocalStorage, 'expires'> | 'expires_in'): Result<string, void> {
    const hashParams = new URLSearchParams(hash.slice(1));
    const value = hashParams.get(key);
    if (value) {
      return new Ok(value);
    }

    return Err.EMPTY;
  }

  return <div className={className}>{showConnectButton && <a href="/login">Connect to Spotify</a>}</div>;
}

export default AuthorizeForm;
