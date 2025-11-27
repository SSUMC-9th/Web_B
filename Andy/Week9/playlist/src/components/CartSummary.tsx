import { useSelector, useAppDispatch } from "../hooks/useCustomRedux.ts";
import type { CartState } from "../features/cart/cartSlice.ts";
import { openModal } from "../features/modal/modalSlice.ts";

const CartSummary = () => {
  const { amount, price } = useSelector((state): CartState => state.cart);
  const dispatch = useAppDispatch();

  const handleOpenModal = () => {
    dispatch(openModal());
  };

  return (
    <div className="mt-10 p-8 bg-white rounded-3xl border border-[#e5e5e7] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-[#86868b] mb-1">총 개수</p>
          <p className="text-4xl font-semibold text-[#1d1d1f] tabular-nums">
            {amount}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[#86868b] mb-1">결제할 금액</p>
          <p className="text-4xl font-semibold text-[#fa233b] tabular-nums">
            ${price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Clear Cart Button */}
      <button
        onClick={handleOpenModal}
        disabled={amount === 0}
        className="w-full py-4 rounded-full bg-[#fa233b] hover:bg-[#e01e30] disabled:bg-[#f5f5f7] disabled:text-[#86868b] text-white font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-[#fa233b]/20 disabled:shadow-none"
      >
        장바구니 비우기
      </button>
    </div>
  );
};

export default CartSummary;
