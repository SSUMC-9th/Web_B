import { useDispatch } from "../hooks/useCustomRedux";
import { increase, decrease, removeItem } from "../slices/carSlice"; // 액션들 가져오기
import type { Lp } from "../types/cart";

interface CartItemProps {
  lp: Lp;
}

const Cartitem = ({ lp }: CartItemProps) => {
  // 1. useDispatch는 함수이므로 '()'를 붙여 실행해서 dispatch 인스턴스를 가져와야 합니다.
  const dispatch = useDispatch();

  // 2. 수량 증가 핸들러
  const handleIncrease = () => {
    // Slice에서 payload로 string(id)을 받기로 했으므로 id만 보냅니다.
    dispatch(increase(lp.id));
  };

  // 3. 수량 감소 핸들러
  const handleDecrease = () => {
    // 수량이 1이면 더 이상 줄일 수 없으므로(또는 0이 되므로) 삭제 액션을 보냅니다.
    if (lp.amount === 1) {
      dispatch(removeItem(lp.id));
      return; // 함수 종료
    }
    
    // 수량이 1보다 클 때만 수량 감소 액션을 보냅니다.
    dispatch(decrease(lp.id));
  };

  return (
    <div className='flex items-center p-4 border-b border-gray-200'>
      <img src={lp.img} alt={lp.title} className='w-20 h-20 object-cover rounded mr-4' />
      <div className='flex-1'>
        <h3 className='text-xl font-semibold'>{lp.title}</h3>
        <p className='text-sm text-gray-600'>{lp.singer}</p>
        <p className='text-sm font-bold text-gray-800'>{lp.price} 원</p>
      </div>
      
      <div className='flex items-center gap-2'>
        <button 
          onClick={handleDecrease}
          className='px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer'
        >
          -
        </button>
        
        <span className='w-8 text-center font-medium'>{lp.amount}</span>
        
        <button 
          onClick={handleIncrease}
          className='px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer'
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Cartitem;