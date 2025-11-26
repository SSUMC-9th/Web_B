import React from "react";
import cartItems from "../constants/cartItems";
import CartItem from "./CartItem";
import { useSelector } from "../hooks/useCustomRedux";
import type { CartState } from "../slices/cartSlice";

function CartList() {
  // 전역상태에 접근하는 법
  const { cartItems } = useSelector((state) => state.cart);
  return (
    <div className="flex flex-col items-center justify-center">
      <ul>
        {cartItems.map((item) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>
    </div>
  );
}

export default CartList;
