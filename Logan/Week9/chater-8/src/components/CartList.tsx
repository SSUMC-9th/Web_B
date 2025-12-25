import React from "react";
import cartItems from "../constants/cartItems";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import type { CartState } from "../slices/cartSlice";
import { useCartActions, useCartInfo } from "../hooks/useCartStore";
import { openModal } from "../slices/modalSlice";
import { FaTrashAlt } from "react-icons/fa";
import Modal from "./Modal";

function CartList() {
  const dispatch = useDispatch();
  // const { cartItems } = useCartInfo();
  // const { clearCart } = useCartActions();

  // 전역상태에 접근하는 법

  const { cartItems } = useSelector((state) => state.cart);
  return (
    <div className="flex flex-col items-center justify-center">
      <ul>
        {cartItems.map((item) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>

      {/* <button
        className="text-2xl flex items-center space-x-2 hover:cursor-pointer"
        onClick={() => dispatch(openModal())}
      >
        <FaTrashAlt />
      </button>
      
      <Modal /> */}
    </div>
  );
}

export default CartList;

// zustand
// // src/components/CartList.tsx
// import React from "react";
// import CartItem from "./CartItem";
// import { useCartInfo } from "../hooks/useCartStore";

// function CartList() {
//   const { cartItems } = useCartInfo();

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <ul>
//         {cartItems.map((item) => (
//           <CartItem key={item.id} lp={item} />
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default CartList;
