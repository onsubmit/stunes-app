import { Ok, Result } from 'ts-results';

import { executeAsync } from './spotifyWebApi';

export type Track = {
  //artists: { name: string; href: string }[];
  id: string;
  song: string;
  //songUrl: string;
  //albumUrl: string;
};

export async function getPlaylistItemsAsync(
  accessToken: string,
  refreshToken: string,
  playlistId: string
): Promise<Result<Track[], void>> {
  return executeAsync(accessToken, refreshToken, async (spotifyApi) => {
    debugger;
    const playlistTracks = await spotifyApi.getPlaylistTracks(playlistId);

    const tracks: Track[] = playlistTracks.items.map((track) => {
      return {
        id: track.track.id,
        song: track.track.name,
      };
    });

    return new Ok(tracks);
  });
}
