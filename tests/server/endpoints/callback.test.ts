import * as nodeFetch from 'node-fetch';
import { Response } from 'node-fetch';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import app from '../../../src/server/server';

vi.mock('node-fetch', async () => {
  const actual: typeof nodeFetch = await vi.importActual('node-fetch');

  return {
    ...actual,
    default: vi.fn(),
  };
});

const fetch = vi.mocked(nodeFetch.default);

describe('/callback', () => {
  it('Should redirect with access and refresh tokens', async () => {
    fetch.mockImplementationOnce(
      async () =>
        new Response(
          JSON.stringify({
            access_token: 'a_t',
            token_type: 'Bearer',
            scope: 's1 s2 s3',
            expires_in: 3600,
            refresh_token: 'r_t',
          })
        )
    );

    const state = 'randomstring';
    const response = await request(app)
      .get(`/callback?code=foo&state=${state}`)
      .set('Cookie', [`spotify_auth_state=${state}`]);
    expect(response.statusCode).toEqual(302);

    expect(response.headers['location']).toBe('/#access_token=a_t&refresh_token=r_t&expires_in=3600');
  });
});
