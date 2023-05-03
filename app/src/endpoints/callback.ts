import { Request, Response } from 'express';
import fetch from 'node-fetch';
import querystring from 'querystring';

import Constants from '../constants';
import { stateKey } from '../stateKey';

export async function callback(req: Request, res: Response) {
  const { client_id, client_secret, redirect_uri } = Constants;

  const code = `${req.query.code}`;
  const state = `${req.query.state}`;
  const storedState: string = req.cookies ? req.cookies[stateKey] : null;

  if (!state || state !== storedState) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );

    return;
  }

  res.clearCookie(stateKey);

  const data = {
    code: code,
    redirect_uri,
    grant_type: 'authorization_code',
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
      },
      body: new URLSearchParams(data),
    });

    if (response.status !== 200) {
      res.redirect(
        '/#' +
          querystring.stringify({
            error: 'invalid_token',
            status: response.status,
          })
      );

      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = await response.json();
    const access_token = body.access_token;
    const refresh_token = body.refresh_token;

    // we can also pass the token to the browser to make requests from there
    res.redirect(
      '/#' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token,
        })
    );
  } catch (e: unknown) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'invalid_token',
          exception: `${e}`,
        })
    );
  }
}
