import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { className } from './App.css';
import Header from './components/Header';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={className}>
        <Header />
      </div>
    </QueryClientProvider>
  );
}

export default App;
