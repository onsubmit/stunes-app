import request from 'supertest';

import app from '../../app/src/app';

describe('Post Endpoints', () => {
  it('should create a new post', async () => {
    const response = await request(app).get('/login');

    expect(response.statusCode).toEqual(302);

    const location = `${response.headers['location'] || ''}`;
    expect(location).toBeTruthy();

    const url = new URL(location);
    expect(url.protocol).toBe('https:');
    expect(url.hostname).toBe('accounts.spotify.com');
    expect(url.pathname).toBe('/authorize');

    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('client_id')).toBe('foo');

    expect(url.searchParams.get('scope')).toBe(
      [
        'playlist-read-private',
        'playlist-read-collaborative',
        'user-read-playback-state',
        'user-modify-playback-state',
      ].join(' ')
    );

    expect(url.searchParams.get('redirect_uri')).toBe('http://localhost:5001/callback');
    expect(url.searchParams.get('state')).toHaveLength(16);
  });
});
