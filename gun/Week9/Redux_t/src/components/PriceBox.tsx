import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { calculateTotals } from "../slices/carSlice";
import { useSelector } from "../hooks/useCustomRedux";
import { openModal } from "../slices/modalSlice"; // 추가

const PriceBox = () => {
    const { total, cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(calculateTotals());
    }, [cartItems, dispatch]);

    // window.confirm 대신 리덕스 모달을 엽니다.
    const handleClearCart = () => {
        dispatch(openModal());
    };

    return (
        <div className='p-12 border-t border-gray-300'>
            <div className='flex justify-between items-center'>
                <button 
                    onClick={handleClearCart}
                    className="border p-4 rounded-md cursor-pointer"
                >
                    장바구니 비우기
                </button>

                <div className="text-xl font-bold">
                    총 가격: {total.toLocaleString()}원
                </div>
            </div>
        </div>
    );
}

export default PriceBox;