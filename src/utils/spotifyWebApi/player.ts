import { Err, Ok, Result } from 'ts-results';

import { executeAsync } from './spotifyWebApi';

export type CurrentTrack = {
  artists: { name: string; href: string }[];
  song: string;
  songUrl: string;
  isCurrentlyPlaying: boolean;
  albumUrl: string;
  albumArtUrl: string;
};

export type AvailableDevice = {
  id: string | null;
  isActive: boolean;
  isRestricted: boolean;
  name: string;
  type: string;
};

export async function getCurrentlyPlayingTrackAsync(
  accessToken: string,
  refreshToken: string
): Promise<Result<CurrentTrack, void>> {
  return executeAsync(accessToken, refreshToken, async (spotifyApi) => {
    const track = await spotifyApi.getMyCurrentPlayingTrack();

    if (!track.item) {
      // Nothing currently playing.
      return Err.EMPTY;
    }

    const item = track.item;
    const album = item.album;
    const albumImages = album.images;
    const image = albumImages.find((image) => image.height === 64) || albumImages[0];

    return new Ok({
      artists: item.artists.map((a) => {
        return { name: a.name, href: a.external_urls.spotify };
      }),
      song: item.name,
      songUrl: item.external_urls.spotify,
      isCurrentlyPlaying: track.is_playing,
      albumUrl: album.external_urls.spotify,
      albumArtUrl: image?.url || '',
    });
  });
}

export async function getAvailableDevicesAsync(
  accessToken: string,
  refreshToken: string
): Promise<Result<AvailableDevice[], void>> {
  return executeAsync(accessToken, refreshToken, async (spotifyApi) => {
    let devices: SpotifyApi.UserDevicesResponse;
    try {
      devices = await spotifyApi.getMyDevices();
    } catch {
      return Err.EMPTY;
    }

    return new Ok(
      devices.devices.map((device) => {
        return {
          id: device.id,
          isActive: device.is_active,
          isRestricted: device.is_restricted,
          name: device.name,
          type: device.type,
        };
      })
    );
  });
}

export async function startPlaybackAsync(
  accessToken: string,
  refreshToken: string,
  trackUris: string[]
): Promise<Result<void, void>> {
  return executeAsync(accessToken, refreshToken, async (spotifyApi) => {
    try {
      await spotifyApi.play({ uris: trackUris });
    } catch {
      return Err.EMPTY;
    }

    return Ok.EMPTY;
  });
}

export async function transferPlaybackAsync(
  accessToken: string,
  refreshToken: string,
  deviceIds: string[]
): Promise<Result<void, void>> {
  return executeAsync(accessToken, refreshToken, async (spotifyApi) => {
    try {
      await spotifyApi.transferMyPlayback(deviceIds);
    } catch {
      return Err.EMPTY;
    }

    return Ok.EMPTY;
  });
}
