// hooks/useCurrentPath.ts
import { useEffect, useState } from 'react';
import { getCurrentPath } from '../utils/utils';

export function useCurrentPath(): string {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const onChange = () => setPath(getCurrentPath());
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);

  return path;
}
