import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import {Heart} from "lucide-react";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AutoContext";
import type { Likes } from "../type/lp";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import usePostLike from "../hooks/mutations/usePostLike";

const LpDetailPage = () => {
    const {lpid} = useParams();
    const {accessToken} = useAuth();
    const {
        data:lp, 
        isPending, 
        isError}  = useGetLpDetail({lpid: Number(lpid)})
    const {data: me} = useGetMyInfo(accessToken);

    const {mutate:likeMutate} = usePostLike();
    const {mutate:disLikeMutate} = useDeleteLike();

    const isLiked = lp?.data.likes.some((like:Likes)=>like.userId === me?.data.id);

    const handleLikeLp = async() => {
        await likeMutate({lpid:Number(lpid)});
    }

    
    const handleDislikeLp = async() => {
        await disLikeMutate({lpid:Number(lpid)});
    }
    
if(isPending && isError) {
    return <></>;
}


  return (
    <div className="mt-12 p-4 max-w-4xl mx-auto bg-white shadow-2xl rounded-xl">
        
        {/* 🖼️ 썸네일 이미지 섹션 */}
        <div className="relative mb-6">
            <img 
                src={lp?.data.thumbnail} 
                alt={lp?.data.title} 
                className="w-full h-96 object-cover rounded-t-xl"
            />
            
            {/* 좋아요 버튼 (이미지 위에 배치) */}
            <button onClick = {isLiked ? handleDislikeLp : handleLikeLp} 
            className="absolute top-4 right-4 p-3 bg-white/70 hover:bg-white rounded-full shadow-lg transition duration-200 backdrop-blur-sm">
                <Heart color={isLiked ? "red" : "black"} fill = {isLiked ? "red" : "transparent"}/>
            </button>
        </div>

        {/* 📝 제목 및 ID 섹션 */}
        <div className="p-6 border-b border-gray-100">
            {/* LP ID (작은 텍스트) */}
            <p className="text-sm font-semibold text-indigo-500 mb-1">
                LP ID: #{lp?.data.id}
            </p>
            
            {/* 제목 */}
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                {lp?.data.title}
            </h1>
        </div>

        {/* 📖 내용 섹션 */}
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-3">내용</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {lp?.data.content}
            </p>
        </div>
        
    </div>
);
}

export default LpDetailPage
