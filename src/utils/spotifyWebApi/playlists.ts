import { Ok, Result } from 'ts-results';

import { executeAsync } from './spotifyWebApi';

export type Track = {
  album: { id: string; name: string; href: string; albumArtUrl: string };
  albumUrl: string;
  artists: { id: string; name: string; href: string }[];
  id: string;
  uri: string;
  song: string;
  songUrl: string;
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
          'total,limit,next,items(added_at,track(id,uri,external_urls,name,duration_ms,album(id,external_urls,name,href,images),artists(id,name,external_urls(spotify))))',
      });

      tracks.push(
        ...playlistTracks.items.map((item) => {
          const track = item.track as SpotifyApi.TrackObjectFull;
          const album = track.album;
          const albumImages = album.images;
          const albumImage = albumImages.find((image) => image.height === 64) || albumImages[0];
          return {
            id: track.id,
            uri: track.uri,
            song: track.name,
            songUrl: track.external_urls.spotify,
            addedAt: new Date(Date.parse(item.added_at)),
            durationInMilliseconds: track.duration_ms,
            album: { id: album.id, name: album.name, href: album.href, albumArtUrl: albumImage?.url || '' },
            albumUrl: album.external_urls.spotify,
            artists: track.artists.map((a) => {
              return { name: a.name, id: a.id, href: a.external_urls.spotify };
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
