import React, { useEffect } from "react";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "../hooks/useCustomRedux";
import { calculateTotals } from "../slices/cartSlice";
import Modal from "./Modal";
import { openModal } from "../slices/modalSlice";

const Navbar = () => {
  const { amount, cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  useEffect((): void => {
    dispatch(calculateTotals());
  }, [dispatch, cartItems]);

  return (
    <div
      className="flex justify-between items-center p-4 bg-gray-800 
  text-white"
    >
      <h1
        onClick={(): void => {
          window.location.href = "/";
        }}
        className="text-2xl font-semibold hover:cursor-pointer"
      >
        Othani Ahn
      </h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className=" text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>

      <button
        className="text-2xl flex items-center space-x-2 hover:cursor-pointer"
        onClick={() => dispatch(openModal())}
      >
        <FaTrashAlt />
      </button>

      <Modal />
    </div>
  );
};

export default Navbar;
