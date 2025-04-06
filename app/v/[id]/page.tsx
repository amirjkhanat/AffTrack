'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const Page = () => {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const referrer = document.referrer;
      const url = new URL(`/api/v/${id}`, window.location.origin);
      if (referrer) {
        url.searchParams.set('referrer', referrer);
      }
      router.push(url.toString());
    }
  }, [id, router]);

  return null; // No need to render anything
};

export default Page; 