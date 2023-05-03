import Constants from './Constants';

export function getPostRequestHeaders() {
  const { client_id, client_secret } = Constants;
  return {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
  };
}
