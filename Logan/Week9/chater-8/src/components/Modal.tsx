import { closeModal } from "../slices/modalSlice";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { clearCart } from "../slices/cartSlice";

export default function Modal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);

  // 모달이 닫혀 있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50
        backdrop-blur-sm
      "
    >
      <div className="bg-white rounded-lg shadow-xl p-10 w-[400px]">
        <h2 className="text-lg font-semibold mb-4">장바구니 비우기</h2>
        <p className="text-sm text-gray-700 mb-10">
          장바구니의 모든 아이템을 정말로 삭제하시겠습니까?
        </p>

        <div className="flex justify-center gap-10">
          {/* 아니요 버튼: 모달만 닫기 */}
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 text-sm"
          >
            아니요
          </button>

          {/* 네 버튼: 장바구니 비우기 + 모달 닫기 */}
          <button
            type="button"
            onClick={() => {
              dispatch(clearCart()); // 장바구니 비우기
              dispatch(closeModal());
            }}
            className="px-3 py-1 rounded-md bg-red-500 text-white text-sm"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}
