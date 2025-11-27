import { useSelector, useAppDispatch } from "../hooks/useCustomRedux.ts";
import type { ModalState } from "../features/modal/modalSlice.ts";
import { closeModal } from "../features/modal/modalSlice.ts";
import { useColActions } from "../hooks/useColStore.ts";

const Modal = () => {
  const { isOpen } = useSelector((state): ModalState => state.modal);
  const dispatch = useAppDispatch();
  const { clearCol } = useColActions();

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    clearCol();
    dispatch(closeModal());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        <div className="text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#fa233b]/10 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                className="text-[#fa233b]"
              >
                <path
                  d="M16 2L16 30M2 16L30 16"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  transform="rotate(45 16 16)"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">
            장바구니를 비우시겠어요?
          </h2>

          {/* Description */}
          <p className="text-base text-[#86868b] mb-8">
            담아두신 모든 음반이 삭제됩니다.
            <br />
            이 작업은 되돌릴 수 없습니다.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5e7] text-[#1d1d1f] font-semibold transition-all duration-200 active:scale-95"
            >
              아니요
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 rounded-full bg-[#fa233b] hover:bg-[#e01e30] text-white font-semibold transition-all duration-200 active:scale-95 shadow-lg shadow-[#fa233b]/25"
            >
              네
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
