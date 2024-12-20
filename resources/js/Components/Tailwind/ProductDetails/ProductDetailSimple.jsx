import Swal from "sweetalert2"
import html2string from "../../../Utils/html2string"
import HtmlContent from "../../../Utils/HtmlContent"
import Number2Currency from "../../../Utils/Number2Currency"
import { useRef } from "react"

const ProductDetailSimple = ({ item, cart, setCart }) => {

  const quantityRef = useRef()

  const onAddClicked = () => {
    const newCart = structuredClone(cart)
    const index = newCart.findIndex(x => x.id == item.id)
    if (index == -1) {
      newCart.push({ ...item, quantity: Number(quantityRef.current.value || 1) })
    } else {
      newCart[index].quantity++
    }
    setCart(newCart)

    Swal.fire({
      title: 'Producto agregado',
      text: `Se agregó ${item.name} al carrito`,
      icon: 'success',
      timer: 1500,
    })
  }

  return <section class="w-full px-[5%] py-12 md:py20">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
      <div class="flex flex-col md:flex-row justify-center items-center gap-5">
        <div class="flex flex-row justify-between md:flex-col md:justify-start md:items-center h-full gap-4 md:gap-10 md:basis-1/4 order-2 md:order-1 w-full">

          <img src={`/api/items/media/${item.image}`} alt={item?.name} class="w-full aspect-square  aos-init aos-animate object-cover object-center rounded-lg" data-aos="fade-up" data-aos-offset="150" />
          {
            item.gallery?.map((image, index) => (
              <img key={index} src={`/api/items/media/${image}`} alt={`imagen-${index}`} class="w-full aspect-square aos-init aos-animate object-cover object-center rounded-lg" data-aos="fade-up" data-aos-offset="150" />
            ))
          }

        </div>

        <div class="md:basis-3/4 flex justify-center items-center order-1 md:order-2 w-full">
          <img src={`/api/items/media/${item.image}`} alt={item?.name} class="w-full aspect-square aos-init aos-animate object-cover object-center rounded-lg" data-aos="fade-up" data-aos-offset="150" />
        </div>
      </div>

      <div class="flex flex-col gap-5">

        <div class="flex flex-col gap-5 pb-10 border-b-2 border-[#DDDDDD] aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
          <div class="flex flex-col xl:flex-row justify-start md:justify-between items-start">
            <div class="w-full xl:w-[70%] flex justify-start items-start">
              <h2 class="font-poppins font-bold text-3xl text-colorJL">
                {item.name ?? 'Sin nombre'}
              </h2>
            </div>
            <div class="w-full xl:w-[30%] flex justify-start xl:justify-end items-start">
              <p class="font-poppins font-bold text-3xl text-color3JL">S/. {Number2Currency(item.final_price)}</p>
            </div>
          </div>
          <div>
            <input ref={quantityRef} type="number" class="text-textPrimary border-2 rounded-lg w-16 border-[#FF3131]" value="01" step="1" />
          </div>

          {
            item.summary &&
            <p class="text-[#565656] text-text16 md:text-text20 font-normal font-poppins">
              {item.summary}
            </p>
          }

          <div class="flex justify-between items-center font-poppins font-semibold text-white text-sm md:text-base gap-5 pt-3 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
            <button class="bg-[#0051FF] w-full py-3 px-2 md:px-10 text-center rounded-3xl" onClick={onAddClicked}>Quiero comprar</button>
            <a href="#" class="bg-[#25D366] flex justify-center items-center w-full py-3 px-2 md:px-10 text-center gap-2 rounded-3xl">
              <span>Cotizar aquí</span>
              <div>
                <i className="mdi mdi-whatsapp"></i>
              </div>
            </a>
          </div>
        </div>


        <div class="pt-5 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
          {
            item?.category &&
            <p class="font-poppins font-medium text-sm md:text-base text-colorJL">
              Categoría: <span class="text-textPrimary">{item.category.name}</span>
            </p>
          }
          {
            item?.subcategory &&
            <p class="font-poppins font-medium text-sm md:text-base text-colorJL">
              Subcategoría: <span class="text-textPrimary">{item.subcategory.name}</span>
            </p>
          }
          {
            item?.sku &&
            <p class="font-poppins font-medium text-sm md:text-base text-colorJL">
              SKU: <span class="text-textPrimary">{item.sku}</span>
            </p>
          }
          {
            item?.brand &&
            <p class="font-poppins font-medium text-sm md:text-base text-colorJL">
              Marca: <span class="text-textPrimary">{item.brand.name}</span>
            </p>
          }
        </div>
      </div>
    </div>

    {
      html2string(item?.description).trim() &&
      <>
        <div class="flex flex-col gap-5 pt-10 md:pt-16 font-poppins font-bold text-3xl text-colorJL pb-5 aos-init aos-animate" data-aos="fade-up" data-aos-offset="150">
          Descripción
        </div>

        <div class="text-[#565656] text-base font-normal font-poppins aos-init aos-animate prose ql-editor" data-aos="fade-up" data-aos-offset="150">
          <HtmlContent html={item?.description} />
        </div>
      </>
    }
  </section>
}

export default ProductDetailSimple