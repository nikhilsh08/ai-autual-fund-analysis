"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectHandler({ 
  status, 
  delaySeconds, 
  redirectTo 
}: { 
  status: 'SUCCESS' | 'FAILED'; 
  delaySeconds: number; 
  redirectTo: string;
}) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(delaySeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      router.push(redirectTo);
    }
  }, [countdown, router, redirectTo]);

  return (
    <div className="text-sm font-medium text-ink-secondary mt-4 animate-pulse">
      Redirecting to {status === 'SUCCESS' ? 'Portal Access Guide' : 'Home'} in {countdown}s...
    </div>
  );
}
