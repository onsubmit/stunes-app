import { className } from './ContentContainer.css';

type ContentContainerProps = {
  selectedPlaylists: string[];
};

function ContentContainer({ selectedPlaylists }: ContentContainerProps) {
  return <div className={className}>{selectedPlaylists.join(',')}</div>;
}

export default ContentContainer;
