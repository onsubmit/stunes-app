import { Request, Response } from 'express';
import fetch from 'node-fetch';

import Constants from '../constants';

export async function refresh_token(req: Request, res: Response) {
  const { client_id, client_secret } = Constants;

  const refresh_token = `${req.query.refresh_token}`;
  const data = {
    grant_type: 'refresh_token',
    refresh_token,
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: new URLSearchParams(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = await response.json();

    if (response.status !== 200) {
      res.send({
        error: body,
      });

      return;
    }

    const access_token = body.access_token;
    res.send({
      access_token,
    });
  } catch (error) {
    res.send({
      error,
    });
  }
}
