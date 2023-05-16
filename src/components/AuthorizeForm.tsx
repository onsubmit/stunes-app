import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Err, Ok, Result } from 'ts-results';

import Deferred from '../utils/Deferred';
import { getOrRefreshAccessTokenAsync } from '../utils/getOrRefreshAccessTokenAsync';
import localStorageManager from '../utils/LocalStorage';
import { getCurrentUserProfileAsync } from '../utils/spotifyWebApi/users';
import { className } from './AuthorizeForm.css';
import ProfileBadge, { ProfileBadgeProps } from './ProfileBadge';

function AuthorizeForm() {
  const queryKey = 'currentUserProfile';
  const queryClient = useQueryClient();

  const hash = window.location.hash;
  const deferredLogin = new Deferred<void>();

  let loginPopup: Window | null = null;
  window.spotifyCallback = () => {
    if (loginPopup) {
      loginPopup.close();
    } else {
      // Remove the hash from the location bar so the tokens aren't shown directly to the user.
      history.pushState('', document.title, window.location.pathname);
    }

    deferredLogin.resolve();
  };

  if (hash) {
    setLocalStorageFromHash();
  }

  const {
    isLoading,
    error,
    data: profileBadgePropsResult,
  } = useQuery({
    queryKey: [queryKey],
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
    const getHashDataResult = getAccessTokenFromHash();
    if (!getHashDataResult.ok) {
      const errorResult = getHashDataResult.val;
      if (!errorResult) {
        // Nothing on the hash.
        return;
      }

      // Something on the hash, likely an error.
      callSpotifyCallback();
      return;
    }

    const { accessToken, refreshToken, expiresInMs } = getHashDataResult.val;
    localStorageManager.set('access_token', accessToken);
    localStorageManager.set('refresh_token', refreshToken);
    localStorageManager.set<number>('expires', new Date().getTime() + expiresInMs);

    callSpotifyCallback();
  }

  function getAccessTokenFromHash(): Result<
    { accessToken: string; refreshToken: string; expiresInMs: number },
    { error: string; message: string } | void
  > {
    const accessTokenResult = getHashValue('access_token');
    const refreshTokenResult = getHashValue('refresh_token');
    const expiresInResult = getHashValue('expires_in');

    if (!accessTokenResult.ok || !refreshTokenResult.ok || !expiresInResult.ok) {
      const errorResult = getHashValue('error');
      const messageResult = getHashValue('message');

      if (!errorResult.ok || !messageResult.ok) {
        return Err.EMPTY;
      }

      return new Err({
        error: errorResult.val,
        message: messageResult.val,
      });
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

  function callSpotifyCallback() {
    if (window.opener) {
      window.opener.spotifyCallback();
    } else {
      window.spotifyCallback();
    }
  }

  async function getProfileBadgePropsAsync(): Promise<Result<ProfileBadgeProps | void, void>> {
    const result = await getOrRefreshAccessTokenAsync();
    if (!result.ok) {
      // If the user isn't signed in, don't treat it as an error.
      return Ok.EMPTY;
    }

    const { accessToken, refreshToken } = result.val;
    return await getCurrentUserProfileAsync(accessToken, refreshToken);
  }

  async function handleLogin(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    loginPopup = window.open('/login', 'loginWindow', 'popup=yes,width=800,height=1000');
    if (!loginPopup) {
      // Popup blocked, try a new tab.
      loginPopup = window.open('/login', 'loginWindow');
    }

    if (!loginPopup) {
      // New tab blocked, open in same tab.
      window.location.href = '/login';
    }

    await deferredLogin.promise;
    queryClient.invalidateQueries();

    return false;
  }

  function getElement(): JSX.Element {
    if (isLoading) {
      return <p>Loading Spotify profile...</p>;
    }

    if (error || profileBadgePropsResult?.err) {
      return <p>An error occurred loading your Spotify profile. Please try again.</p>;
    }

    if (profileBadgePropsResult?.ok && profileBadgePropsResult.val) {
      return <ProfileBadge {...profileBadgePropsResult.val}></ProfileBadge>;
    }

    return (
      <a href="/login" onClick={handleLogin}>
        Connect to Spotify
      </a>
    );
  }

  return <div className={className}>{getElement()}</div>;
}

export default AuthorizeForm;
