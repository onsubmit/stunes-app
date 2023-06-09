import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import fetch, { Response as FetchResponse } from 'node-fetch';
import querystring, { ParsedUrlQueryInput } from 'querystring';
import { Err, Ok, Result } from 'ts-results';

import Constants from '../Constants';
import { getPostRequestHeaders } from '../getPostRequestHeaders';
import { AccessAndRefreshToken, AccessAndRefreshTokenResult, AccessAndRefreshTokenSchema, TokenError } from '../types';

export async function callback(request: ExpressRequest, response: ExpressResponse) {
  const requestResult = validateRequest(request);
  if (requestResult.err) {
    return redirect(response, requestResult.val);
  }

  response.clearCookie(Constants.stateKey);

  const accessTokenResult = await getAccessAndRefreshTokenAsync(request);
  return redirect(response, accessTokenResult.val);
}

async function getAccessAndRefreshTokenAsync(
  request: ExpressRequest
): Promise<Result<AccessAndRefreshTokenResult, TokenError>> {
  const data = {
    code: `${request.query.code || ''}`,
    redirect_uri: Constants.redirect_uri,
    grant_type: 'authorization_code',
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: getPostRequestHeaders(),
      body: new URLSearchParams(data),
    });

    const result = await validateResponseAsync(response);
    if (result.err) {
      return result;
    }

    const { access_token, refresh_token, expires_in } = result.val;

    return new Ok({
      access_token,
      refresh_token,
      expires_in,
    });
  } catch (e: unknown) {
    return new Err({
      error: 'invalid_token',
      exception: `${e}`,
    });
  }
}

function validateState(request: ExpressRequest): boolean {
  const state = `${request.query.state || ''}`;
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

  const error = `${request.query.error || ''}`;
  if (error) {
    return new Err({
      error: 'invalid_request',
      message: error,
    });
  }

  const code = `${request.query.code || ''}`;
  if (!code) {
    return new Err({
      error: 'invalid_request',
      message: 'missing_code',
    });
  }

  return Ok.EMPTY;
}

async function validateResponseAsync(response: FetchResponse): Promise<Result<AccessAndRefreshToken, TokenError>> {
  if (response.status !== 200) {
    return new Err({
      error: 'invalid_status',
      status: response.status,
    });
  }

  const contentTypeHeader = `${response.headers.get('content-type') || ''}`;
  if (!contentTypeHeader.includes('application/json')) {
    return new Err({
      error: 'invalid_response',
      response: await response.text(),
    });
  }

  const getResponseJsonResult = await getResponseJsonAsync(response);
  if (getResponseJsonResult.err) {
    return new Err({
      error: 'invalid_response',
      response: getResponseJsonResult.val,
    });
  }

  return getResponseJsonResult;
}

async function getResponseJsonAsync(response: FetchResponse): Promise<Result<AccessAndRefreshToken, string>> {
  const text = await response.text();

  try {
    const body = JSON.parse(text);
    const parsed = AccessAndRefreshTokenSchema.safeParse(body);

    if (!parsed.success) {
      return new Err(JSON.stringify(parsed.error.format()));
    }

    return new Ok(parsed.data);
  } catch {
    // ignore
  }

  return new Err(text);
}

function redirect(res: ExpressResponse, queryString: ParsedUrlQueryInput): void {
  res.redirect(`/#${querystring.stringify(queryString)}`);
}
