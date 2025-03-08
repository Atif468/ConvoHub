import { useLogto } from '@logto/react';

const Home = () => {
  const { signIn, signOut, isAuthenticated } = useLogto();

  return isAuthenticated ? (
    <button onClick={() => signOut('http://localhost:5173/')}>Sign Out</button>
  ) : (
    <button onClick={() => signIn('http://localhost:5173/')}>Sign In</button>
  );
};