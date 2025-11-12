import { type CursorBasedResponse, type CommonResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
}

export type Likes =  {
    id: number;
    userId: number;
    lpId: number;
}

export type LP = {
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
}

export type RequestLpDto = {
    lpId: number;
}

export type ResponseLpDto = CommonResponse<LP>;

export type ResponseLpListDto = CursorBasedResponse<LP[]>;

export type ResponseLikeLpDto = CommonResponse<{
    id: number;
    userId: number;
    lpId: number;
}>