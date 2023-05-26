import { millisecondsToTimeString } from '../utils/millisecondsToTimeString';
import { Track } from '../utils/spotifyWebApi/playlists';
import { className } from './TrackList.css';

export type TrackListProps = {
  tracks: Map<string, Track>;
};

function TrackList({ tracks }: TrackListProps) {
  return (
    <div className={className}>
      <table>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Album</th>
          <th>Date Added</th>
          <th>Duration</th>
        </tr>
        {[...tracks].map(([id, track], index) => (
          <tr key={id}>
            <td>{index + 1}</td>
            <td>
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
            </td>
            <td>{track.album.name}</td>
            <td>{track.addedAt.toLocaleDateString()}</td>
            <td>{millisecondsToTimeString(track.durationInMilliseconds)}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default TrackList;
