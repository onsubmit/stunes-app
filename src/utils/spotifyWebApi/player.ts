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
