import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AuthorizeForm from './components/AuthorizeForm';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthorizeForm />
    </QueryClientProvider>
  );
}

export default App;
