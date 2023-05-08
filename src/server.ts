import { Err, Ok, Result } from 'ts-results';

import { AccessToken, AccessTokenSchema } from './server/types';

export async function refreshAccessTokenAsync(refreshToken: string): Promise<Result<AccessToken, void>> {
  try {
    const response = await fetch(`/refresh_token?refresh_token=${refreshToken}`);
    const body = await response.json();
    const parsed = AccessTokenSchema.safeParse(body);
    if (parsed.success) {
      return new Ok(parsed.data);
    }
  } catch {
    // ignore
  }

  return Err.EMPTY;
}
