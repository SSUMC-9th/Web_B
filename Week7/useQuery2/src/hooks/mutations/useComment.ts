import { useMutation} from "@tanstack/react-query";
import { postComment, updateComment, deleteComment } from "../../apis/lp"; // api.ts에서 함수를 import한다고 가정합니다.
import { QUERY_KEY } from "../../constants/key"; // QUERY_KEY 추가
import { queryClient } from "../../App"; // queryClient 추가 (실제 App.tsx 등에서 가져와야 함)

// ------------------------------------------------------------------
// 📌 1. 댓글 생성 (POST) - onSuccess 무효화 적용
// ------------------------------------------------------------------
export function usePostComment() {

    return useMutation({
        mutationFn: postComment,
        
        onSuccess: (newComment, variables) => {
            // 성공 시, 해당 LP의 댓글 목록 쿼리를 무효화하여 새로고침합니다.
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.comments, { lpid: variables.lpid }],
            });
            // TODO: 댓글 입력창 초기화 등의 추가 로직을 컴포넌트에서 구현해야 합니다.
        },
        
        onError: (error) => {
            console.error("댓글 생성 실패:", error);
            // 사용자에게 오류 메시지를 표시하는 로직 추가
        },
    });
};


// ------------------------------------------------------------------
// 📌 2. 댓글 수정 (PATCH) - onSuccess 무효화 적용
// ------------------------------------------------------------------
export function useUpdateComment() {

    return useMutation({
        mutationFn: updateComment,
        
        onSuccess: (updatedCommentResponse, variables) => {
            // 성공 시, 해당 LP의 댓글 목록 쿼리를 무효화하여 수정된 내용을 반영합니다.
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.comments, { lpid: variables.lpid }],
            });
        },

        onError: (error) => {
            console.error("댓글 수정 실패:", error);
        },
    });
};


// ------------------------------------------------------------------
// 📌 3. 댓글 삭제 (DELETE) - onSuccess 무효화 적용
// ------------------------------------------------------------------
export function useDeleteComment() {

    return useMutation({
        mutationFn: deleteComment,
        
        onSuccess: (data, variables) => {
            // 성공 시, 해당 LP의 댓글 목록 쿼리를 무효화하여 삭제된 내용을 반영합니다.
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.comments, { lpid: variables.lpid }],
            });
        },

        onError: (error) => {
            console.error("댓글 삭제 실패:", error);
        },
    });
};
