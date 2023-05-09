import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { className } from './App.css';
import AuthorizeForm from './components/AuthorizeForm';
import CurrentSong from './components/CurrentSong';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={className}>
        <CurrentSong />
        <AuthorizeForm />
      </div>
    </QueryClientProvider>
  );
}

export default App;
