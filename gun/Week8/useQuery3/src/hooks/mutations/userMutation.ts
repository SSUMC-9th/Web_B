import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RequestUpdateUserDto, ResponseUserDto } from "../../type/auth";
import { updateUser } from "../../apis/auth";
// type/user 파일에 정의된 DTO 타입을 임포트합니다.
// user.ts 파일에 정의된 API 함수를 임포트합니다.


// ----------------------------------------------------------------------
// 1. 사용자 정보 수정 (PATCH /v1/users)
// ----------------------------------------------------------------------
/**
 * 사용자 정보(닉네임, 소개, 아바타)를 업데이트하는 useMutation 훅입니다.
 * 성공 시, 내 정보 쿼리를 무효화하여 모든 컴포넌트에서 새로운 정보를 자동으로 반영합니다.
 */
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    // ResponseUserDto는 type/user.ts에서 ResponseMyInfoDto와 동일하게 할당되어 사용됩니다.
    return useMutation<ResponseUserDto, Error, RequestUpdateUserDto>({
        mutationFn: updateUser,
        onSuccess: (data) => {
            // 'me' 쿼리 키를 무효화하여 모든 useGetMyInfo 호출이 새로운 정보를 가져오도록 강제합니다.
            queryClient.invalidateQueries({ queryKey: ['me'] }); 
            console.log("사용자 정보 업데이트 성공:", data);
        },
        onError: (error) => {
            console.error("사용자 정보 업데이트 실패:", error);
        },
    });
};