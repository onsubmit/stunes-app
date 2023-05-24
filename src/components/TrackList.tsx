import { Track } from '../utils/spotifyWebApi/playlists';
import { className } from './TrackList.css';

export type TrackListProps = {
  tracks: Track[];
};

function TrackList({ tracks }: TrackListProps) {
  return (
    <div className={className}>
      {tracks.map((track) => {
        return (
          <div key={track.id}>
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
        );
      })}
    </div>
  );
}

export default TrackList;
