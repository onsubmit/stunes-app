import { z, ZodNumber, ZodString } from 'zod';

export type AccessTokenResult = { access_token: string };
export type AccessAndRefreshTokenResult = AccessTokenResult & { refresh_token: string };
export type TokenError =
  | { error: 'invalid_request'; message: string }
  | { error: 'invalid_status'; status: number }
  | { error: 'invalid_response'; response: string }
  | { error: 'invalid_token'; exception: string };

type AccessTokenShapeType = {
  access_token: ZodString;
  expires_in: ZodNumber;
};

type AccessTokenDetailedShapeType = AccessTokenShapeType & {
  token_type: ZodString;
  scope: ZodString;
};

type AccessAndRefreshTokenShapeType = AccessTokenDetailedShapeType & {
  refresh_token: ZodString;
};

const accessTokenSchemaShape: AccessTokenShapeType = {
  access_token: z.string(),
  expires_in: z.number(),
};

const accessTokenDetailedSchemaShape: AccessTokenDetailedShapeType = {
  ...accessTokenSchemaShape,
  token_type: z.string(),
  scope: z.string(),
};

const accessAndRefreshTokenSchemaShape: AccessAndRefreshTokenShapeType = {
  ...accessTokenDetailedSchemaShape,
  refresh_token: z.string(),
};

export const AccessTokenSchema = z.object(accessTokenSchemaShape);
export type AccessToken = z.infer<typeof AccessTokenSchema>;

export const AccessTokenDetailedSchema = z.object(accessTokenDetailedSchemaShape);
export type AccessTokenDetailed = z.infer<typeof AccessTokenDetailedSchema>;

export const AccessAndRefreshTokenSchema = z.object(accessAndRefreshTokenSchemaShape);
export type AccessAndRefreshToken = z.infer<typeof AccessAndRefreshTokenSchema>;
