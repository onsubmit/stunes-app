import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { className, mainContainer } from './App.css';
import ContentContainer from './components/ContentContainer';
import Header from './components/Header';
import Playlists from './components/Playlists';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={className}>
        <Header />
        <div className={mainContainer}>
          <Playlists />
          <ContentContainer />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
