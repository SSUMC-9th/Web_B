import React, { useEffect } from "react";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "../hooks/useCustomRedux";
import { calculateTotals } from "../slices/cartSlice";
import Modal from "./Modal";
import { openModal } from "../slices/modalSlice";
import { useCartActions, useCartInfo } from "../hooks/useCartStore";

const Navbar = () => {
  // const { amount, cartItems } = useCartInfo();
  // const { calculateTotals } = useCartActions();

  const { amount, cartItems } = useSelector((state) => state.cart);

  // navbar에서 사용안하긴함
  const dispatch = useDispatch();

  useEffect((): void => {
    dispatch(calculateTotals());
  }, [dispatch, cartItems]);

  // zustand용?
  // useEffect((): void => {
  //   calculateTotals();
  // }, [calculateTotals, cartItems]);

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

      {/* <button
        className="text-2xl flex items-center space-x-2 hover:cursor-pointer"
        onClick={() => dispatch(openModal())}
      >
        <FaTrashAlt />
      </button>

      <Modal /> */}
    </div>
  );
};

export default Navbar;

// // zustand
// // src/components/Navbar.tsx
// import React from "react";
// import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
// import Modal from "./Modal";
// import { useCartInfo } from "../hooks/useCartStore";
// import { useModalStore } from "../hooks/useModalStore";

// const Navbar = () => {
//   const { amount } = useCartInfo();
//   const { openModal } = useModalStore();

//   return (
//     <div
//       className="flex justify-between items-center p-4 bg-gray-800
//   text-white"
//     >
//       <h1
//         onClick={(): void => {
//           window.location.href = "/";
//         }}
//         className="text-2xl font-semibold hover:cursor-pointer"
//       >
//         Othani Ahn
//       </h1>

//       <div className="flex items-center space-x-2">
//         <FaShoppingCart className=" text-2xl" />
//         <span className="text-xl font-medium">{amount}</span>
//       </div>

//       <button
//         className="text-2xl flex items-center space-x-2 hover:cursor-pointer"
//         onClick={openModal}
//       >
//         <FaTrashAlt />
//       </button>

//       <Modal />
//     </div>
//   );
// };

// export default Navbar;
