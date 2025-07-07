import { Router } from './Router.tsx';
import { MessageProvider } from './providers/MessageProvider.tsx';
import { UserProvider } from './providers/UserProvider.tsx';

export function App() {
  return (
    <MessageProvider>
      <UserProvider>
        <Router />
      </UserProvider>
    </MessageProvider>
  );
}
