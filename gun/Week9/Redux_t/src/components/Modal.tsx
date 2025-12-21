import { useDispatch } from "react-redux";
import { clearCart } from "../slices/carSlice";
import { closeModal } from "../slices/modalSlice";

const Modal = () => {
    const dispatch = useDispatch();

    return (
        <aside className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white p-8 rounded-lg max-w-sm w-full text-center shadow-xl'>
                <h4 className='text-lg font-bold mb-6'>장바구니를 모두 비우시겠습니까?</h4>
                <div className='flex justify-around gap-4'>
                    <button
                        className='flex-1 py-2 border border-blue-500 text-blue-500 rounded font-bold cursor-pointer hover:bg-blue-50'
                        onClick={() => {
                            dispatch(clearCart());
                            dispatch(closeModal());
                        }}
                    >
                        네
                    </button>
                    <button
                        className='flex-1 py-2 border border-red-500 text-red-500 rounded font-bold cursor-pointer hover:bg-red-50'
                        onClick={() => dispatch(closeModal())}
                    >
                        아니요
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Modal;