import { millisecondsToTimeString } from '../utils/millisecondsToTimeString';
import { Track } from '../utils/spotifyWebApi/playlists';
import { albumArtPhoto, albumColumnClass, className, tableClass, titleClass, titleColumnClass } from './TrackList.css';

export type TrackListProps = {
  tracks: Map<string, Track>;
};

function TrackList({ tracks }: TrackListProps) {
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
          {[...tracks].map(([id, track], index) => (
            <tr key={id}>
              <td>{index + 1}</td>
              <td>
                <div className={titleClass}>
                  <div>
                    {track.album.albumArtUrl && <img className={albumArtPhoto} src={track.album.albumArtUrl}></img>}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TrackList;
