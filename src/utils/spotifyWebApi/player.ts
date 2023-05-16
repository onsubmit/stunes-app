import { Err, Ok, Result } from 'ts-results';

import { executeAsync } from './spotifyWebApi';

export type CurrentTrack = {
  artists: { name: string; href: string }[];
  song: string;
  songUrl: string;
  albumUrl: string;
  albumArtUrl: string;
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

    return new Ok({
      artists: track.item.artists.map((a) => {
        return { name: a.name, href: a.external_urls.spotify };
      }),
      song: track.item.name,
      songUrl: track.item.external_urls.spotify,
      albumUrl: track.item.album.external_urls.spotify,
      albumArtUrl: track.item.album.images.at(0)?.url || '',
    });
  });
}
