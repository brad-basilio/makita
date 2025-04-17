import Tippy from "@tippyjs/react"
import React from "react"
import Number2Currency from "../../../Utils/Number2Currency"
import { Minus, Plus } from "lucide-react"

const CartItemRow = ({ setCart, ...item }) => {

  const onDeleteClicked = (itemId) => {
    setCart(old => old.filter(x => x.id !== itemId));
  }

  const onPlusClicked = () => {
    setCart(old =>
      old.map(x =>
        x.id === item.id ? { ...x, quantity: (x.quantity || 1) + 1 } : x
      )
    );
  }

  const onMinusClicked = () => {
    setCart(old =>
      old.map(x => {
        if (x.id === item.id) {
          const newQuantity = (x.quantity || 1) - 1;
          if (newQuantity <= 0) {
            onDeleteClicked(item.id);
            return null;
          }
          return { ...x, quantity: newQuantity };
        }
        return x;
      }).filter(Boolean)
    );
  }

  return <tr className="border-b font-font-general">
    <td className="p-2 w-24">
      <img
        src={`/storage/images/item/${item.image}`}
        onError={(e) => e.target.src = "/assets/img/noimage/no_img.jpg"}
        className="block bg-white shadow rounded-md p-0 aspect-[4/3] w-20 h-auto object-cover object-center"
        alt={item.name} />
    </td>
    <td className="p-2">
      <p className="font-semibold mb-1 leading-tight text-sm">
        {
          item?.category &&
          <span className="block text-xs opacity-80 -mb-1">{item?.category?.name ?? 'Sin categoría'}</span>
        }
        {item.name}
      </p>
      <div className="flex w-20 justify-center border-[1px] border-[#6C7275] rounded-md">
        <button type="button" onClick={onMinusClicked} className="w-6 h-6 flex justify-center items-center ">
          <Minus size={16} />
        </button>
        <div className="w-6 h-6 flex justify-center items-center">
          <span className="font-semibold text-[13px]">{item.quantity || 1}</span>
        </div>
        <button type="button" onClick={onPlusClicked} className="w-6 h-6 flex justify-center items-center ">
          <Plus size={16} />
        </button>
      </div>
    </td>
    <td className="p-2 text-end w-24">
      <p className="font-semibold w-full text-end">
        {
          item?.discount > 0 &&
          <span className="block text-xs line-through -mb-1">{Number2Currency(item?.price)}</span>
        }
        S/. {Number2Currency(item?.final_price)}
      </p>
      <Tippy content='Quitar'>
        <button type="button" onClick={() => onDeleteClicked(item?.id)} className="w-max h-6 flex justify-center items-center ms-auto">
          <i className="mdi mdi-trash-can-outline text-xl"></i>
        </button>
      </Tippy>
    </td>
  </tr>
}

export default CartItemRow