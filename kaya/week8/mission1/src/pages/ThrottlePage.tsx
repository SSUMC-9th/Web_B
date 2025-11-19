import {useState, useEffect} from 'react';
import useThrottle from '../hooks/queries/useThrottle';

const ThrottlePage = () => {
    const [scrollY, setScrollY] = useState<number>(0);

    const handleScroll = useThrottle(() => {
        setScrollY(window.scrollY);
    }, 2000);

    // scroll 이벤트 발생 -> handleScroll_A 호출 -> scroll 이벤트 또 발생 -> cleanUp으로 A 제거, handleScroll_B 호출
    // 렌더링마다 handleScroll이 생성됨
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll])

    return (
        <div className='h-dvh flex flex-col items-center justify-center'>
            <div>
                <h1>쓰로틀링이 무엇일까요?</h1>
                <p>ScrollY: {scrollY}px</p>
            </div>
        </div>
    );
}

export default ThrottlePage;