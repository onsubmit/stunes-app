import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import fetch, { Response as FetchResponse } from 'node-fetch';
import querystring, { ParsedUrlQueryInput } from 'querystring';
import { Err, Ok, Result } from 'ts-results';
import { z } from 'zod';

import Constants from '../Constants';
import { getPostRequestHeaders } from './getPostRequestHeaders';

const TokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  scope: z.string(),
  expires_in: z.string(),
  refresh_token: z.string(),
});

type Token = z.infer<typeof TokenSchema>;
type TokenSuccess = { access_token: string; refresh_token: string };
type TokenError =
  | { error: 'invalid_request'; message: string }
  | { error: 'invalid_status'; status: number }
  | { error: 'invalid_response'; message: string }
  | { error: 'invalid_token'; exception: string };

export async function callback(request: ExpressRequest, response: ExpressResponse) {
  const code = `${request.query.code}`;

  const requestResult = validateRequest(request);
  if (requestResult.err) {
    return redirect(response, requestResult.val);
  }

  response.clearCookie(Constants.stateKey);

  const accessTokenResult = await getAccessTokenAsync(code);
  return redirect(response, accessTokenResult.val);
}

async function getAccessTokenAsync(code: string): Promise<Result<TokenSuccess, TokenError>> {
  const { redirect_uri } = Constants;

  const data = {
    code,
    redirect_uri,
    grant_type: 'authorization_code',
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: getPostRequestHeaders(),
      body: new URLSearchParams(data),
    });

    const result = validateResponse(response);
    if (result.err) {
      return result;
    }

    const body: Token = await response.json();
    const { access_token, refresh_token } = body;

    return new Ok({
      access_token,
      refresh_token,
    });
  } catch (e: unknown) {
    return new Err({
      error: 'invalid_token',
      exception: `${e}`,
    });
  }
}

function validateState(request: ExpressRequest): boolean {
  const state = `${request.query.state}`;
  if (!state) {
    return false;
  }

  const storedState: string = request.cookies ? request.cookies[Constants.stateKey] : null;
  if (state !== storedState) {
    return false;
  }

  return true;
}

function validateRequest(request: ExpressRequest): Result<void, TokenError> {
  if (!validateState(request)) {
    return new Err({
      error: 'invalid_request',
      message: 'state_mismatch',
    });
  }

  const error = `${request.query.error}`;
  if (error) {
    return new Err({
      error: 'invalid_request',
      message: error,
    });
  }

  return Ok.EMPTY;
}

function validateResponse(response: FetchResponse): Result<void, TokenError> {
  if (response.status !== 200) {
    return new Err({
      error: 'invalid_status',
      status: response.status,
    });
  }

  try {
    TokenSchema.parse(response);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Err({
        error: 'invalid_response',
        message: err.message,
      });
    }
  }

  return Ok.EMPTY;
}

function redirect(res: ExpressResponse, queryString: ParsedUrlQueryInput): void {
  res.redirect(`/#${querystring.stringify(queryString)}`);
}
