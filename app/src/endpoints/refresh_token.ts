import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import fetch, { Response as FetchResponse } from 'node-fetch';
import { Err, Ok, Result } from 'ts-results';
import { z } from 'zod';

import { getPostRequestHeaders } from '../getPostRequestHeaders';
import { AccessToken, AccessTokenResult, AccessTokenSchema, TokenError } from '../types';

export async function refresh_token(request: ExpressRequest, response: ExpressResponse) {
  const refresh_token = `${request.query.refresh_token || ''}`;
  const requestResult = validateRequest(refresh_token);
  if (requestResult.err) {
    response.send(requestResult.val);
    return;
  }

  const accessTokenResult = await getAccessTokenAsync(refresh_token);
  response.send(accessTokenResult.val);
}

async function getAccessTokenAsync(refresh_token: string): Promise<Result<AccessTokenResult, TokenError>> {
  const data = {
    grant_type: 'refresh_token',
    refresh_token,
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: new URLSearchParams(data),
      headers: getPostRequestHeaders(),
    });

    const result = await validateResponseAsync(response);
    if (result.err) {
      return result;
    }

    const { access_token } = result.val;

    return new Ok({
      access_token,
    });
  } catch (e: unknown) {
    return new Err({
      error: 'invalid_token',
      exception: `${e}`,
    });
  }
}

function validateRequest(refresh_token: string): Result<void, TokenError> {
  if (!refresh_token) {
    return new Err({
      error: 'invalid_request',
      message: 'missing_refresh_token',
    });
  }

  return Ok.EMPTY;
}

async function validateResponseAsync(response: FetchResponse): Promise<Result<AccessToken, TokenError>> {
  if (response.status !== 200) {
    return new Err({
      error: 'invalid_status',
      status: response.status,
    });
  }

  const body: AccessToken = await response.json();

  try {
    AccessTokenSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Err({
        error: 'invalid_response',
        response: await response.text(),
      });
    }
  }

  return new Ok(body);
}
