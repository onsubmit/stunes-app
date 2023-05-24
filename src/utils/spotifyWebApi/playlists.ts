import { Ok, Result } from 'ts-results';

import { executeAsync } from './spotifyWebApi';

export type Track = {
  album: { name: string; href: string };
  artists: { name: string; href: string }[];
  id: string;
  song: string;
};

export async function getPlaylistItemsAsync(
  accessToken: string,
  refreshToken: string,
  playlistId: string
): Promise<Result<Track[], void>> {
  return executeAsync(accessToken, refreshToken, async (spotifyApi) => {
    const playlistTracks = await spotifyApi.getPlaylistTracks(playlistId);

    const tracks: Track[] = playlistTracks.items.map((item) => {
      const track = item.track as SpotifyApi.TrackObjectFull;
      return {
        id: track.id,
        song: track.name,
        album: { name: track.album.name, href: track.album.href },
        artists: track.artists.map((a) => {
          return { name: a.name, href: a.external_urls.spotify };
        }),
      };
    });

    return new Ok(tracks);
  });
}
