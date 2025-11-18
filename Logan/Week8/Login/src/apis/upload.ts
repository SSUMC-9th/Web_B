// src/apis/upload.ts
import { axiosInstance } from "./axios";

/** 이미지를 업로드하고 imageUrl을 반환 */
export const uploadImage = async (
  file: File,
  // 인증 필요 없으면 true: /public 사용
  usePublic: boolean = false
): Promise<string> => {
  const fd = new FormData();
  fd.append("file", file); // 스웨거의 필드명과 동일!

  const url = usePublic ? "/v1/uploads/public" : "/v1/uploads";

  const res = await axiosInstance.post(url, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // 스웨거 예시: { status:true, data:{ imageUrl:"http://..." } }
  return res.data?.data?.imageUrl as string;
};
