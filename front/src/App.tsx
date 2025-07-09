import { Router } from './Router.tsx';
import { MessageListener } from './components/MessageListener.tsx';

export function App() {
  return (
    <>
      <MessageListener />
      <Router />
    </>
  );
}
