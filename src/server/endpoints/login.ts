import { Request, Response } from 'express';
import querystring from 'querystring';

import Constants from '../Constants';
import { generateRandomString } from '../generateRandomString';

export function login(_req: Request, res: Response) {
  const { client_id, redirect_uri } = Constants;

  const state = generateRandomString(16);
  res.cookie(Constants.stateKey, state);

  const scopes = [
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-playback-state',
    'user-modify-playback-state',
  ];

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id,
        scope: scopes.join(' '),
        redirect_uri,
        state,
      })
  );
}
