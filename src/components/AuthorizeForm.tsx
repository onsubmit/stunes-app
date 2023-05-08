import { useQuery } from '@tanstack/react-query';
import { Err, Ok, Result } from 'ts-results';

import { refreshAccessTokenAsync } from '../server';
import localStorageManager from '../utils/LocalStorage';
import { getCurrentUserProfile } from '../utils/spotifyWebApi/users';
import { className } from './AuthorizeForm.css';
import ProfileBadge, { ProfileBadgeProps } from './ProfileBadge';

function AuthorizeForm() {
  const hash = window.location.hash;
  if (hash) {
    setLocalStorageFromHash();
  }

  const {
    isLoading,
    error,
    data: profileBadgePropsResult,
  } = useQuery({
    queryKey: ['currentUserProfile'],
    retry: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,

    queryFn: async () => {
      const propsResult = await getProfileBadgePropsAsync();
      if (!propsResult.ok) {
        return Err.EMPTY;
      }

      return new Ok(propsResult.val);
    },
  });

  function setLocalStorageFromHash() {
    const getHashDataResult = getHashData();
    if (!getHashDataResult.ok) {
      // Nothing on the hash.
      return;
    }

    // Remove the hash from the location bar so the tokens aren't shown directly to the user.
    history.pushState('', document.title, window.location.pathname);

    const { accessToken, refreshToken, expiresInMs } = getHashDataResult.val;
    localStorageManager.set('access_token', accessToken);
    localStorageManager.set('refresh_token', refreshToken);
    localStorageManager.set<number>('expires', new Date().getTime() + expiresInMs);
  }

  function getHashData(): Result<{ accessToken: string; refreshToken: string; expiresInMs: number }, void> {
    const accessTokenResult = getHashValue('access_token');
    const refreshTokenResult = getHashValue('refresh_token');
    const expiresInResult = getHashValue('expires_in');

    if (!accessTokenResult.ok || !refreshTokenResult.ok || !expiresInResult.ok) {
      return Err.EMPTY;
    }

    const expiresInSeconds = parseInt(expiresInResult.val, 10);
    return new Ok({
      accessToken: accessTokenResult.val,
      refreshToken: refreshTokenResult.val,
      expiresInMs: 1000 * (isNaN(expiresInSeconds) ? 3600 : expiresInSeconds),
    });
  }

  function getHashValue(key: string): Result<string, void> {
    const hashParams = new URLSearchParams(hash.slice(1));
    const value = hashParams.get(key);
    return value ? new Ok(value) : Err.EMPTY;
  }

  async function getProfileBadgePropsAsync(): Promise<Result<ProfileBadgeProps | void, void>> {
    const result = await getOrRefreshAccessTokenAsync();
    if (!result.ok) {
      // If the user isn't signed in, don't treat it as an error.
      return Ok.EMPTY;
    }

    const { accessToken, refreshToken } = result.val;
    return await getCurrentUserProfile(accessToken, refreshToken);
  }

  async function getOrRefreshAccessTokenAsync(): Promise<Result<{ accessToken: string; refreshToken: string }, void>> {
    const localStorageResult = getLocalStorageData();
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

  function getLocalStorageData(): Result<{ accessToken: string; refreshToken: string; expires: number }, void> {
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

  function getElement(): JSX.Element {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (error || profileBadgePropsResult?.err) {
      return <p>An error occurred</p>;
    }

    if (profileBadgePropsResult?.ok && profileBadgePropsResult.val) {
      return <ProfileBadge {...profileBadgePropsResult.val}></ProfileBadge>;
    }

    // TODO: Do this in a popup window.
    return <a href="/login">Connect to Spotify</a>;
  }

  return <div className={className}>{getElement()}</div>;
}

export default AuthorizeForm;
