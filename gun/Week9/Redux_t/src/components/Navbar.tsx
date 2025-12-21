import { FaShoppingCart } from 'react-icons/fa';
import { useSelector } from '../hooks/useCustomRedux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { calculateTotals } from '../slices/carSlice';

const Navbar = () => {
  // Redux 스토어에서 amount를 가져옵니다.
  // state.cart는 store에 등록된 리듀서 이름입니다.
  const { amount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(calculateTotals());
  })

  return (
    <nav className='flex justify-between items-center p-4 bg-gray-800 text-white shadow-md'>
      <h1 className='text-2xl font-semibold italic'>Ohthani Ahn</h1>
      
      <div className='relative flex items-center cursor-pointer p-2'>
        {/* 1. 아이콘 크기를 text-4xl로 대폭 키움 */}
        <FaShoppingCart className='text-4xl' />

        {/* 2. 배지 크기를 w-7 h-7로 키우고 텍스트도 더 크게 설정 */}
        <div className='absolute -top-1 -right-2 bg-red-600 text-white text-sm w-7 h-7 flex items-center justify-center rounded-full border-2 border-gray-800 shadow-lg'>
          <span className='font-black'>{amount}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;