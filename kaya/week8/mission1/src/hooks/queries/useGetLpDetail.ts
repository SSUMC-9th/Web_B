import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '../../constants/key.ts';
import type { RequestLpDto } from '../../type/lp.ts';
import { getLpDetail } from '../../apis/lp.ts';

function useGetLpDetail({lpId}: RequestLpDto) {
    return useQuery({
        queryKey: [QUERY_KEY.lps, lpId],
        queryFn: () => getLpDetail({lpId}),
    })
}

export default useGetLpDetail;