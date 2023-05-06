import cookie from 'cookie';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../../../src/server/server';

describe('/login', () => {
  it('Should redirect to https://accounts.spotify.com/authorize', async () => {
    const response = await request(app).get('/login');

    expect(response.statusCode).toEqual(302);

    const location = `${response.headers['location'] || ''}`;
    expect(location).toBeTruthy();

    const url = new URL(location);
    expect(url.protocol).toBe('https:');
    expect(url.hostname).toBe('accounts.spotify.com');
    expect(url.pathname).toBe('/authorize');

    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('client_id')).toBe('test-client-id');

    expect(url.searchParams.get('scope')).toBe(
      [
        'playlist-read-private',
        'playlist-read-collaborative',
        'user-read-playback-state',
        'user-modify-playback-state',
      ].join(' ')
    );

    expect(url.searchParams.get('redirect_uri')).toBe('http://localhost:5001/callback');

    const state = url.searchParams.get('state');
    expect(state).toHaveLength(16);

    const setCookieHeader = `${response.headers['set-cookie'] || ''}`;
    expect(setCookieHeader).toBeTruthy();

    const cookies = cookie.parse(setCookieHeader);
    const authCookie = cookies['spotify_auth_state'];
    expect(authCookie).toBe(state);
  });
});
