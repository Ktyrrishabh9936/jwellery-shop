import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (status === 'loading') return; // Do nothing while loading
      if (!session) {
        // Redirect to login page if not authenticated
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      }
    }, [session, status, router]);

    if (status === 'loading' ) {
      return <div className=' flex justify-center items-center'>  <div className="h-10 w-10 border-t-transparent border-solid animate-spin rounded-full border-red-400 border-4"></div></div>; // Show a loading indicator while checking authentication
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;