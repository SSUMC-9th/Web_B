// src/pages/not-found.tsx
const NotFound = () => {
  return <>
    <div className='min-h-screen flex flex-col items-center justify-center'>
    <h1 className='text-3xl font-bold'>페이지를 찾을 수 없어요 (404)</h1>
    <p className='mt-2 text-2xl font-bold'>주소를 다시 확인하거나 홈으로 이동해 주세요.</p>
    <a href="/" className='mt-10 bg-black text-white p-3 rounded-2xl'>홈으로</a>
  </div>
  </>
};

export default NotFound;