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

describe('/refresh_token', () => {
  it('Should respond with access token and expiration', async () => {
    mockValidResponse();

    const response = await request(app).get(`/refresh_token?refresh_token=foo`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({ access_token: 'a_t', expires_in: 3600 });
  });

  it('Should respond with error when refresh_token is missing', async () => {
    const response = await request(app).get(`/refresh_token?refresh_token=`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({ error: 'invalid_request', message: 'missing_refresh_token' });
  });

  it('Should respond with invalid status', async () => {
    fetch.mockImplementationOnce(async () => new Response(null, { status: 400 }));

    const response = await request(app).get(`/refresh_token?refresh_token=foo`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({ error: 'invalid_status', status: 400 });
  });

  it('Should respond with invalid JSON response', async () => {
    fetch.mockImplementationOnce(
      async () =>
        new Response(JSON.stringify({ not_expected: 'hi' }), {
          headers: {
            'content-type': 'application/json',
          },
        })
    );

    const response = await request(app).get(`/refresh_token?refresh_token=foo`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      error: 'invalid_response',
      response:
        '{"_errors":[],"access_token":{"_errors":["Required"]},"token_type":{"_errors":["Required"]},"scope":{"_errors":["Required"]},"expires_in":{"_errors":["Required"]}}',
    });
  });

  it('Should respond with invalid response content type', async () => {
    fetch.mockImplementationOnce(
      async () =>
        new Response('hi', {
          headers: {
            'content-type': 'application/text',
          },
        })
    );

    const response = await request(app).get(`/refresh_token?refresh_token=foo`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      error: 'invalid_response',
      response: 'hi',
    });
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
