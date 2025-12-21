import { useSelector } from "../hooks/useCustomRedux";
import Cartitem from "./Cartitem"


const CartList = () => {
  const {cartItems, amount, total} = useSelector((state) => state.cart);


  return (
    <div className='flex flex-col items-center justify-center'>
      <ul>{cartItems.map((item) => (
        <Cartitem key={item.id} lp={item}/>
      ))}

      </ul>
    </div>
  )
}

export default CartList
