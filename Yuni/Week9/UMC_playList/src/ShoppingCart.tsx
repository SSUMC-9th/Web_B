import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { increase, decrease, removeItem } from './features/cart/cartSlice';
import { openModal } from './features/modal/modalSlice';
import Modal from './components/Modal';
import type { RootState } from './store/index';

const ShoppingCartApp = () => {
  const dispatch = useDispatch();
  const { cartItems, amount, total } = useSelector((state: RootState) => state.cart);

  return (
    <>
      <Modal />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-slate-700 text-white p-4 sticky top-0 z-10 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Ohtani Ahn</h1>
            <div className="flex items-center gap-2">
              <ShoppingCart size={24} />
              <span className="text-xl font-semibold">{amount}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm">
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors">
                    {/* Album Cover */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 rounded object-cover flex-shrink-0"
                    />

                    {/* Item Info */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{item.artist}</p>
                      <p className="text-xl font-bold text-gray-900">
                        ${item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-2">
                      <button
                        onClick={() => dispatch(decrease(item.id))}
                        className="w-10 h-10 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(increase(item.id))}
                        className="w-10 h-10 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => dispatch(removeItem(item.id))}
                      className="w-10 h-10 flex items-center justify-center bg-red-300 hover:bg-red-400 rounded transition-colors"
                      aria-label="Remove item"
                    >
                      <Minus size={18} />
                    </button>
                  </div>
                  {index < cartItems.length - 1 && (
                    <div className="border-b border-gray-200 mx-6"></div>
                  )}
                </div>
              ))}

              {/* Summary Section */}
              <div className="bg-gray-50 p-6 rounded-b-lg border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total Items:</span>
                  <span className="text-2xl font-bold">{amount}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total Price:</span>
                  <span className="text-2xl font-bold text-blue-600">${total.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => dispatch(openModal())}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <p className="text-xl text-gray-500">Your cart is empty</p>
            </div>
          )}
        </div>
        </main>
      </div>
    </>
  );
};

export default ShoppingCartApp;