import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { className } from './App.css';
import AuthorizeForm from './components/AuthorizeForm';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={className}>
        <AuthorizeForm />
      </div>
    </QueryClientProvider>
  );
}

export default App;
