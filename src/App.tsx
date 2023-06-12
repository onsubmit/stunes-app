import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { className, mainContainer } from './App.css';
import ContentContainer from './components/ContentContainer';
import Header from './components/Header';
import Playlists from './components/Playlists';

const queryClient = new QueryClient();

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

  function updateIsConnected(value: boolean) {
    setIsConnected(value);
  }

  function updateSelectedPlaylists(newSelectedPlaylists: string[]) {
    setSelectedPlaylists(newSelectedPlaylists);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className={className}>
        <Header updateIsConnected={updateIsConnected} />
        {isConnected && (
          <div className={mainContainer}>
            <Playlists updateSelectedPlaylists={updateSelectedPlaylists} />
            <ContentContainer selectedPlaylists={selectedPlaylists} />
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
