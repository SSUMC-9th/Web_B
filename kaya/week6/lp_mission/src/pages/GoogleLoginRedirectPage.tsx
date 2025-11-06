import {useEffect} from 'react';
import {useLocalStorage} from '../hooks/useLocalStorage.ts';
import { LOCAL_STORAGE_KEY } from '../constants/key.ts';

const GoogleLoginRedirectPage = () => {
    const {setItem: setAccessToken} = useLocalStorage(
        LOCAL_STORAGE_KEY.accessToken, // ***이거 refreshToken으로 되어있었음
    );
    const {setItem: setRefreshToken} = useLocalStorage(
        LOCAL_STORAGE_KEY.refreshToken,
    );

    useEffect(() => {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const accessToken: string | null = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
        const refreshToken: string | null = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

        if (accessToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            window.location.href = '/my';
        }
        console.log(window.location.search, urlParams);
    }, [setAccessToken, setRefreshToken]);
    return <div>구글 로그인 리다이렉션 화면</div>;
}

export default GoogleLoginRedirectPage;