import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import {useInView} from 'react-intersection-observer'
import {useState, useEffect} from 'react';
import {LpCard} from '../components/LpCard/LpCard.tsx'
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList.tsx";
import { FloatingCreateButton } from "../components/FloatingCreateButton.tsx";
import CreateLpModal  from '../components/CreateLpModal.tsx';
import { QUERY_KEY } from "../constants/key";

const HomePage = () => {
    const [search, setSearch] = useState('');
    // lp 추가 버튼때문에 추가함
    const order = PAGINATION_ORDER.desc;

    const {
        data:lps, 
        isFetching, 
        hasNextPage, 
        isPending, 
        fetchNextPage, 
        isError
    } = useGetInfiniteLpList(1, search, PAGINATION_ORDER.desc);

    // ref, inView
    // ref -> 특정한 HTML 요소를 감시할 수 있다.
    // inView -> 그 요소가 화면에 보이면 true
    const {ref, inView} = useInView({threshold: 0,})

    useEffect(() => {
        if (inView) {
            !isFetching && hasNextPage && fetchNextPage();
        }
    }, [inView, isFetching, hasNextPage, fetchNextPage]);

    console.log(lps);

    // lp 추가 버튼
    const [open, setOpen] = useState(false)

    return (
        <div className='container mx-auto px-4 py-6'>
            <input value={search} onChange={(e)=>setSearch(e.target.value)}/>

            <div className={'grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4'}>
                {lps?.pages
                ?.map((page) => page.data.data)
                ?.flat()
                ?.map((lp) => <LpCard key={lp.id} lp={lp}/>)}
                {isFetching && <LpCardSkeletonList count={20}/>}
            </div>
            <div ref={ref} className='h-2'></div>
            
            {/* 화면 하단 lp 추가 버튼 */}
            <FloatingCreateButton onClick={() => setOpen(true)} />
            <CreateLpModal isOpen={open} onClose={() => setOpen(false)} invalidateKey={[QUERY_KEY.lps, search, order]} />
        </div>
    )
}

export default HomePage;