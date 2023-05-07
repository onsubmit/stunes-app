import { useQuery } from '@tanstack/react-query';
import SpotifyWebApi from 'spotify-web-api-js';
import { Err, Ok, Result } from 'ts-results';

import { AccessToken, AccessTokenSchema } from '../server/types';
import localStorageManager, { LocalStorage } from '../utils/LocalStorage';
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
    data: profileBadgeProps,
  } = useQuery({
    queryKey: ['currentUserProfile'],
    retry: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const propsResult = await getProfileBadgePropsAsync();
      if (propsResult.ok) {
        return propsResult.val;
      }
    },
  });

  function setLocalStorageFromHash() {
    const getHashDataResult = getHashData();
    if (getHashDataResult.ok) {
      // Remove the hash so the tokens aren't shown directly to the user.
      history.pushState('', document.title, window.location.pathname);

      const { accessToken, refreshToken, expiresIn } = getHashDataResult.val;
      localStorageManager.set('access_token', accessToken);
      localStorageManager.set('refresh_token', refreshToken);
      localStorageManager.set<number>('expires', new Date().getTime() + expiresIn);
    }
  }

  async function getProfileBadgePropsAsync(): Promise<Result<ProfileBadgeProps, void>> {
    const result = await getOrRefreshAccessTokenAsync();
    if (!result.ok) {
      return Err.EMPTY;
    }

    const accessToken = result.val;
    return await getMeAsync(accessToken);
  }

  function getLocalStorageData(): Result<{ accessToken: string; refreshToken: string; expires: number }, void> {
    const accessTokenResult = localStorageManager.get<string>('access_token');
    const refreshTokenResult = localStorageManager.get<string>('refresh_token');
    const expiresResult = localStorageManager.get<number>('expires');

    if (accessTokenResult.ok && refreshTokenResult.ok && expiresResult.ok) {
      return new Ok({
        accessToken: accessTokenResult.val,
        refreshToken: refreshTokenResult.val,
        expires: expiresResult.val,
      });
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

  async function getOrRefreshAccessTokenAsync(): Promise<Result<string, void>> {
    const localStorageResult = getLocalStorageData();
    if (!localStorageResult.ok) {
      return Err.EMPTY;
    }

    const { accessToken, refreshToken, expires } = localStorageResult.val;
    const isAccessTokenExpired = new Date().getTime() > expires;
    if (!isAccessTokenExpired) {
      return new Ok(accessToken);
    }

    const refreshAccessTokenResult = await refreshAccessTokenAsync(refreshToken);
    if (!refreshAccessTokenResult.ok) {
      return Err.EMPTY;
    }

    const { access_token, expires_in } = refreshAccessTokenResult.val;
    localStorageManager.set('access_token', access_token);
    localStorageManager.set<number>('expires', new Date().getTime() + expires_in);

    return new Ok(access_token);
  }

  async function refreshAccessTokenAsync(refreshToken: string): Promise<Result<AccessToken, void>> {
    try {
      const response = await fetch(`/refresh_token?refresh_token=${refreshToken}`);
      const body = await response.json();
      const parsed = AccessTokenSchema.safeParse(body);
      if (parsed.success) {
        return new Ok(parsed.data);
      }
    } catch {
      // ignore
    }

    return Err.EMPTY;
  }

  async function getMeAsync(
    accessToken: string
  ): Promise<Result<{ displayName: string; profilePhotoUrl: string }, void>> {
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(accessToken);

    const profile = await spotifyApi.getMe();
    if (!profile.display_name || !profile.images || !profile.images[0].url) {
      return Err.EMPTY;
    }

    return new Ok({
      displayName: profile.display_name,
      profilePhotoUrl: profile.images[0].url,
    });
  }

  return (
    <div className={className}>
      {isLoading && <p>Loading...</p>}
      {error ? <p>An error occurred</p> : undefined}
      {profileBadgeProps ? (
        <ProfileBadge {...profileBadgeProps}></ProfileBadge>
      ) : (
        <a href="/login">Connect to Spotify</a>
      )}
    </div>
  );
}

export default AuthorizeForm;
