import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const EnhancedHomeRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page since enhanced design is now the main home page
    router.replace('/');
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirecting... | Taylor Movers</title>
        <meta name="description" content="Redirecting to Taylor Movers main page" />
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🚛</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Redirecting...</h1>
          <p className="text-gray-600">Taking you to our main page</p>
        </div>
      </div>
    </>
  );
};

export default EnhancedHomeRedirect;
