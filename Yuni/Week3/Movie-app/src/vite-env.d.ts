/// <reference types="vite/client" />
//환경 변수 세팅 - Popular 데이터 받기 

interface ImportMetaEnv {
    readonly VITE_APP_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}