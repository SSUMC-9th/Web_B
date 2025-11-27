import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import { closeModal } from '../features/modal/modalSlice';
import type { RootState } from '../store/index';

const Modal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  if (!isOpen) return null;

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            장바구니를 비우시겠습니까?
          </h2>
          <p className="text-gray-600 mb-6">
            이 작업은 되돌릴 수 없습니다. 정말로 모든 아이템을 삭제하시겠습니까?
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded transition-colors"
            >
              아니요
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              네
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
