'use client';

import { Toaster, toast } from 'sonner';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ToastProvider() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if URL has ?success=...
    const successMessage = searchParams.get('success');
    const errorMessage = searchParams.get('error');

    if (successMessage) {
      // Show Success Toast
      toast.success(successMessage, {
        style: { background: '#10B981', color: 'white', border: 'none' },
        icon: '✅',
      });
      // Clean URL (remove the ?success param) without refreshing
      router.replace(pathname);
    }

    if (errorMessage) {
      // Show Error Toast
      toast.error(errorMessage, {
        style: { background: '#EF4444', color: 'white', border: 'none' },
        icon: '❌',
      });
      router.replace(pathname);
    }
  }, [searchParams, pathname, router]);

  return <Toaster position="bottom-right" expand={false} richColors />;
}