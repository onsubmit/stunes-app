import { artistGenreMap } from '../utils/ArtistGenreMap';
import { millisecondsToTimeString } from '../utils/millisecondsToTimeString';
import { Track } from '../utils/spotifyWebApi/playlists';
import {
  albumArtPhoto,
  albumColumnClass,
  className,
  innerClass,
  tableClass,
  titleClass,
  titleColumnClass,
} from './TrackList.css';

export type TrackListFilter = {
  hideAll: boolean;
  genres: string[];
  artists: string[];
  albums: string[];
};

export type TrackListProps = {
  tracks: Map<string, Track>;
  filter: TrackListFilter;
};

function TrackList({ tracks, filter }: TrackListProps) {
  let trackIndex = 1;
  return (
    <div className={className}>
      <div className={innerClass}>
        {/* <div>
          <pre>{JSON.stringify(filter, null, 2)}</pre>
        </div> */}
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
                  let hideRow = false;
                  if (filter.artists.length) {
                    hideRow = !track.artists.some((artist) => filter.artists.includes(artist.id));
                  }

                  if (!hideRow && filter.albums.length) {
                    hideRow = !filter.albums.some((album) => album === track.album.id);
                  }

                  if (!hideRow && filter.genres.length) {
                    const artistsGenres = artistGenreMap.getGenresForArtists(track.artists.map((artist) => artist.id));
                    const intersection = artistsGenres.filter((artistGenre) => filter.genres.includes(artistGenre));
                    hideRow = !intersection.length;
                  }

                  return hideRow ? undefined : (
                    <tr key={id}>
                      <td>{trackIndex++}</td>
                      <td>
                        <div className={titleClass}>
                          <div>
                            {track.album.albumArtUrl &&
                              (track.albumUrl ? (
                                <a href={track.albumUrl} target="_blank" rel="noreferrer">
                                  <img className={albumArtPhoto} src={track.album.albumArtUrl}></img>
                                </a>
                              ) : (
                                <img className={albumArtPhoto} src={track.album.albumArtUrl}></img>
                              ))}
                          </div>
                          <div>
                            <div>
                              <a href={track.songUrl} target="_blank" rel="noreferrer">
                                {track.song}
                              </a>
                            </div>
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
                      <td>
                        {track.albumUrl ? (
                          <a href={track.albumUrl} target="_blank" rel="noreferrer">
                            {track.album.name}
                          </a>
                        ) : (
                          track.album.name
                        )}
                      </td>
                      <td>{track.addedAt.toLocaleDateString()}</td>
                      <td>{millisecondsToTimeString(track.durationInMilliseconds)}</td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrackList;
