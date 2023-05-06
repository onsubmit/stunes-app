import * as nodeFetch from 'node-fetch';
import { Response } from 'node-fetch';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
  beforeEach(() => {
    fetch.mockReset();
  });

  it('Should redirect with access and refresh tokens', async () => {
    mockValidResponse();

    const state = 'randomstring';
    const response = await request(app)
      .get(`/callback?code=foo&state=${state}`)
      .set('Cookie', [`spotify_auth_state=${state}`]);

    expect(response.statusCode).toEqual(302);
    expect(response.headers['location']).toBe('/#access_token=a_t&refresh_token=r_t&expires_in=3600');
  });

  it('Should clear state cookie', async () => {
    mockValidResponse();

    const state = 'randomstring';
    const response = await request(app)
      .get(`/callback?code=foo&state=${state}`)
      .set('Cookie', [`spotify_auth_state=${state}`]);

    const cookies: string[] = response.headers['set-cookie'];
    expect(cookies).to.toHaveLength(1);
    expect(cookies[0]).toEqual('spotify_auth_state=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  });

  it('Should redirect with invalid state when state cookie is missing', async () => {
    fetch.mockImplementationOnce(async () => new Response(null, { status: 400 }));

    const state = 'randomstring';
    const response = await request(app).get(`/callback?code=foo&state=${state}`);

    expect(response.statusCode).toEqual(302);
    expect(response.headers['location']).toBe('/#error=invalid_request&message=state_mismatch');
  });

  it('Should redirect with invalid state when state cookie does not match', async () => {
    const state = 'randomstring';
    const response = await request(app)
      .get(`/callback?code=foo&state=${state}`)
      .set('Cookie', [`spotify_auth_state=somethingelse`]);

    expect(response.statusCode).toEqual(302);
    expect(response.headers['location']).toBe('/#error=invalid_request&message=state_mismatch');
  });

  it('Should redirect with error', async () => {
    const state = 'randomstring';
    const response = await request(app)
      .get(`/callback?state=${state}&error=access_denied`)
      .set('Cookie', [`spotify_auth_state=${state}`]);

    expect(response.statusCode).toEqual(302);
    expect(response.headers['location']).toBe('/#error=invalid_request&message=access_denied');
  });

  it('Should redirect with missing code', async () => {
    const state = 'randomstring';
    const response = await request(app)
      .get(`/callback?state=${state}`)
      .set('Cookie', [`spotify_auth_state=${state}`]);

    expect(response.statusCode).toEqual(302);
    expect(response.headers['location']).toBe('/#error=invalid_request&message=missing_code');
  });

  it('Should redirect with invalid status', async () => {
    fetch.mockImplementationOnce(async () => new Response(null, { status: 400 }));

    const state = 'randomstring';
    const response = await request(app)
      .get(`/callback?code=foo&state=${state}`)
      .set('Cookie', [`spotify_auth_state=${state}`]);

    expect(response.statusCode).toEqual(302);
    expect(response.headers['location']).toBe('/#error=invalid_status&status=400');
  });

  it('Should redirect with invalid JSON response', async () => {
    fetch.mockImplementationOnce(
      async () =>
        new Response(JSON.stringify({ not_expected: 'hi' }), {
          headers: {
            'content-type': 'application/json',
          },
        })
    );

    const state = 'randomstring';
    const response = await request(app)
      .get(`/callback?code=foo&state=${state}`)
      .set('Cookie', [`spotify_auth_state=${state}`]);

    expect(response.statusCode).toEqual(302);
    expect(response.headers['location']).toBe(
      '/#error=invalid_response&response=%7B%22_errors%22%3A%5B%5D%2C%22access_token%22%3A%7B%22_errors%22%3A%5B%22Required%22%5D%7D%2C%22token_type%22%3A%7B%22_errors%22%3A%5B%22Required%22%5D%7D%2C%22scope%22%3A%7B%22_errors%22%3A%5B%22Required%22%5D%7D%2C%22expires_in%22%3A%7B%22_errors%22%3A%5B%22Required%22%5D%7D%2C%22refresh_token%22%3A%7B%22_errors%22%3A%5B%22Required%22%5D%7D%7D'
    );
  });

  it('Should redirect with invalid response content type', async () => {
    fetch.mockImplementationOnce(
      async () =>
        new Response('hi', {
          headers: {
            'content-type': 'application/text',
          },
        })
    );

    const state = 'randomstring';
    const response = await request(app)
      .get(`/callback?code=foo&state=${state}`)
      .set('Cookie', [`spotify_auth_state=${state}`]);

    expect(response.statusCode).toEqual(302);
    expect(response.headers['location']).toBe('/#error=invalid_response&response=hi');
  });

  function mockValidResponse() {
    fetch.mockImplementationOnce(
      async () =>
        new Response(
          JSON.stringify({
            access_token: 'a_t',
            token_type: 'Bearer',
            scope: 's1 s2 s3',
            expires_in: 3600,
            refresh_token: 'r_t',
          }),
          {
            headers: {
              'content-type': 'application/json',
            },
          }
        )
    );
  }
});
