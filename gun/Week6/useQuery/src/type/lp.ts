import type { CursorBasedResponse } from "./common";


export type Tag = {
id: number;
name: string;
};

export type Likes = {
id: number;
userId: number;
lplId: number;
};

export type ResponseLpListDto = CursorBasedResponse<{
data: { // 이 'data' 필드는 아마도 불필요한 중복으로 보이거나, CursorBasedResponse<T>의 T가 이 객체 전체를 의미하는 것일 수 있습니다. (이미지 상에서 'data:'가 중복되어 보임)
id: number;
title: string;
content: string;
thumbnail: string;
published: boolean;
authorId: number;
createdAt: Date;
updatedAt: Date;
tags: Tag[];
likes: Likes[];
}[];
}>;