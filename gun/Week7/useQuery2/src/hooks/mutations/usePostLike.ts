import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";

function usePostLike() {
    return useMutation( {
        mutationFn: postLike,
        onSuccess: (data) => {
            queryClient.invalidateQueries( {
                queryKey: [QUERY_KEY.lps, data.data.lpId],
                exact:true,
            });
        },
    });
}

export default usePostLike;