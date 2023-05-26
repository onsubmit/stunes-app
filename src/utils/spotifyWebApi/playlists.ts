import { Ok, Result } from 'ts-results';

import { executeAsync } from './spotifyWebApi';

export type Track = {
  album: { name: string; href: string };
  artists: { name: string; href: string }[];
  id: string;
  song: string;
  addedAt: Date;
  durationInMilliseconds: number;
};

export async function getPlaylistItemsAsync(
  accessToken: string,
  refreshToken: string,
  playlistId: string
): Promise<Result<Track[], void>> {
  return executeAsync(accessToken, refreshToken, async (spotifyApi) => {
    const tracks: Track[] = [];

    let offset = 0;
    let limit = 100;
    let moreTracksRemain = true;

    while (moreTracksRemain) {
      const playlistTracks = await spotifyApi.getPlaylistTracks(playlistId, {
        offset,
        limit,
        fields:
          'total,limit,next,items(added_at,track(id,name,duration_ms,album(name,href),artists(name,external_urls(spotify))))',
      });

      tracks.push(
        ...playlistTracks.items.map((item) => {
          const track = item.track as SpotifyApi.TrackObjectFull;
          return {
            id: track.id,
            song: track.name,
            addedAt: new Date(Date.parse(item.added_at)),
            durationInMilliseconds: track.duration_ms,
            album: { name: track.album.name, href: track.album.href },
            artists: track.artists.map((a) => {
              return { name: a.name, href: a.external_urls.spotify };
            }),
          };
        })
      );

      if (!playlistTracks.next) {
        moreTracksRemain = false;
        break;
      }

      const nextUrl = new URL(playlistTracks.next);
      const offsetStr = nextUrl.searchParams.get('offset');
      const limitStr = nextUrl.searchParams.get('limit');
      if (!offsetStr || !limitStr) {
        moreTracksRemain = false;
        break;
      }

      offset = parseInt(offsetStr, 10);
      limit = parseInt(limitStr, 10);
    }

    return new Ok(tracks);
  });
}
