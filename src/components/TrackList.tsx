import { ArtistGenreMap } from '../utils/artistGenreMap';
import { millisecondsToTimeString } from '../utils/millisecondsToTimeString';
import { Track } from '../utils/spotifyWebApi/playlists';
import { albumArtPhoto, albumColumnClass, className, tableClass, titleClass, titleColumnClass } from './TrackList.css';

export type TrackListFilter = {
  hideAll: boolean;
  genres: string[];
  artists: string[];
  albums: string[];
};

export type TrackListProps = {
  tracks: Map<string, Track>;
  filter: TrackListFilter;
  artistGenreMap: ArtistGenreMap;
};

function TrackList({ tracks, filter, artistGenreMap }: TrackListProps) {
  console.log(artistGenreMap);
  console.log(filter);

  let trackIndex = 1;
  return (
    <div className={className}>
      <table className={tableClass}>
        <thead>
          <tr>
            <th>#</th>
            <th className={titleColumnClass}>Title</th>
            <th className={albumColumnClass}>Album</th>
            <th>Date Added</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {filter.hideAll
            ? undefined
            : [...tracks].map(([id, track]) => {
                const hideRow =
                  (filter.artists.length && !track.artists.some((artist) => filter.artists.includes(artist.id))) ||
                  (filter.albums.length && !filter.albums.some((album) => album === track.album.id));
                return hideRow ? undefined : (
                  <tr key={id}>
                    <td>{trackIndex++}</td>
                    <td>
                      <div className={titleClass}>
                        <div>
                          {track.album.albumArtUrl && (
                            <img className={albumArtPhoto} src={track.album.albumArtUrl}></img>
                          )}
                        </div>
                        <div>
                          <div>{track.song}</div>
                          <div>
                            {track.artists?.map((a, i) => {
                              return (
                                <span key={`artist${i}`}>
                                  <a href={a.href} target="_blank" rel="noreferrer">
                                    {a.name}
                                  </a>
                                  {i < track.artists.length - 1 ? <span>, </span> : undefined}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{track.album.name}</td>
                    <td>{track.addedAt.toLocaleDateString()}</td>
                    <td>{millisecondsToTimeString(track.durationInMilliseconds)}</td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}

export default TrackList;
