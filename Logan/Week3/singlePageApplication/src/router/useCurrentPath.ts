import { useEffect, useState } from 'react';
import { getCurrentPath, PUSHSTATE_EVENT } from './utils';

//  현재 경로를 상태로 관리하고,
//  - 뒤/앞으로 가기(popstate)
//  - 프로그래매틱 이동(pushstate: 우리가 쏜 커스텀 이벤트) 를 모두 감지해 리렌더링을 유도한다.
export const useCurrentPath = () => {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const handleChange = () => setPath(getCurrentPath());

    window.addEventListener('popstate', handleChange);
    window.addEventListener(PUSHSTATE_EVENT, handleChange);

    return () => {
      window.removeEventListener('popstate', handleChange);
      window.removeEventListener(PUSHSTATE_EVENT, handleChange);
    };
  }, []);

  return path;
};
