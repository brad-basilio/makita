"use client"

import React, { useEffect, useState } from "react"
import Number2Currency from "../../../Utils/Number2Currency"
import { ShoppingBag, Gift } from "lucide-react"
import { renderToString } from "react-dom/server"
import LaravelSession from "../../../Utils/LaravelSession"

const CheckoutCulqi = ({ data, cart, setCart, items, prefixes }) => {
  const [deliveryMethod, setDeliveryMethod] = useState("pickup")
  const [contactInfo, setContactInfo] = useState({
    name: LaravelSession.name,
    lastname: LaravelSession.lastname,
    dni: LaravelSession.dni,
    email: LaravelSession.email,
    phone_prefix: LaravelSession.phone_prefix || '51',
    phone: LaravelSession.phone,
  })
  const [shippingAddress, setShippingAddress] = useState({
    departamento: "",
    provincia: "",
    distrito: "",
    calle: "",
    numero: "",
    referencia: "",
  })

  const totalPrice = cart.reduce((acc, item) => {
    const finalPrice = item.discount > 0 ? Math.min(item.price, item.discount) : item.price
    return acc + finalPrice * item.quantity
  }, 0)

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Add this with other state declarations
  const [shippingPrice, setShippingPrice] = useState(0)

  // Add this function after other handlers
  const getShippingPrice = (district) => {
    if (deliveryMethod === 'pickup') return 0;

    const selectedDistrict = districts.find(d => d.id == district);
    if (!selectedDistrict) return null;

    console.log(selectedDistrict)

    if (selectedDistrict.price === null) return 'destination';
    return selectedDistrict.price === 0 ? 0 : selectedDistrict.price;
  }

  // Modify handleShippingAddressChange
  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === 'distrito') {
      console.log(value)
      setShippingPrice(getShippingPrice(value))
    }
  }

  useEffect(() => {
    const htmlTemplate = (data) => {
      const prefix = data.element.dataset.code
      const flag = data.element.dataset.flag
      return renderToString(<span>
        <span className="inline-block w-8 font-emoji text-center">{flag}</span>
        <b className="me-1">{data.text}</b>
        <span className="text-sm text-opacity-20">{prefix}</span>
      </span>)
    }
    $('.select2-prefix-selector').select2({
      dropdownCssClass: 'py-1',
      containerCssClass: '!border !border-gray-300 !rounded p-2 !h-[42px]',
      arrowCssClass: '!text-primary top-1/2 -translate-y-1/2"',
      //minimumResultsForSearch: -1,
      templateResult: function (data) {
        if (!data.id) {
          return data.text;
        }
        var $container = $(htmlTemplate(data));
        return $container;
      },
      templateSelection: function (data) {
        if (!data.id) {
          return data.text;
        }
        var $container = $(htmlTemplate(data));
        return $container;
      }
    });
  }, [null])

  const regions = [...new Set(items.map((item) => item.data?.region))]
  const provinces = [...new Set(items.filter(x => x.data?.region == shippingAddress.departamento).map((item) => item.data?.provincia))]
  const districts = [...new Set(items.filter(x => x.data?.region == shippingAddress.departamento && x.data?.provincia == shippingAddress.provincia).map((item) => ({
    id: item.data?.reniec,
    name: item.data?.distrito,
    price: item.price === null ? null: Number(item.price),
  })))]

  return (
    <section className="bg-white">
      <div className="container mx-auto px-[5%] py-[2.5%]">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Información del contacto</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={contactInfo.nombre}
                    onChange={handleContactInfoChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Nombre"
                  />
                </div>

                <div>
                  <label htmlFor="apellido" className="block text-sm mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={contactInfo.apellido}
                    onChange={handleContactInfoChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Apellido"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="dni" className="block text-sm mb-1">
                  DNI
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={contactInfo.dni}
                  onChange={handleContactInfoChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="00000000"
                  maxLength={8}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactInfo.email}
                  onChange={handleContactInfoChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Correo electrónico"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="celular" className="block text-sm mb-1">
                  Celular
                </label>
                <div className="flex gap-2">
                  <select
                    className="select2-prefix-selector w-[200px] p-2 border border-gray-300 rounded"
                    onChange={(e) => setSelectedPrefix(e.target.value)}
                  >
                    <option value="">Selecciona un país</option>
                    {
                      prefixes
                        .sort((a, b) => a.country.localeCompare(b.country))
                        .map((prefix, index) => (
                          <option
                            key={index}
                            value={prefix.realCode}
                            data-code={prefix.beautyCode}
                            data-flag={prefix.flag}
                          >
                            {prefix.country}
                          </option>
                        ))
                    }
                  </select>
                  <input
                    type="text"
                    id="celular"
                    name="celular"
                    value={contactInfo.celular}
                    onChange={handleContactInfoChange}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    placeholder="000 000 000"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Dirección de envío</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div
                  className={`flex flex-col p-6 rounded-lg border-2 cursor-pointer ${deliveryMethod === "pickup" ? "border-primary bg-gray-100" : "border-gray-200"
                    }`}
                  onClick={() => setDeliveryMethod("pickup")}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${deliveryMethod === "pickup" ? "border-primary" : "border-gray-400"
                        }`}
                    >
                      {deliveryMethod === "pickup" && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                    </div>
                    <ShoppingBag className="w-5 h-5 mr-2 text-gray-700" />
                    <span className="font-medium">Recojo en tienda</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-9">Envío gratis</p>
                </div>

                <div
                  className={`flex flex-col p-6 rounded-lg border-2 cursor-pointer ${deliveryMethod === "express" ? "border-primary bg-gray-100" : "border-gray-200"
                    }`}
                  onClick={() => setDeliveryMethod("express")}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${deliveryMethod === "express" ? "border-primary" : "border-gray-400"
                        }`}
                    >
                      {deliveryMethod === "express" && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                    </div>
                    <Gift className="w-5 h-5 mr-2 text-gray-700" />
                    <span className="font-medium">Envío express</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-9">Sujeto a evaluación</p>
                </div>
              </div>

              {deliveryMethod === "express" && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label htmlFor="departamento" className="block text-sm mb-1">
                        Departamento
                      </label>
                      <div className="relative">
                        <select
                          id="departamento"
                          name="departamento"
                          value={shippingAddress.departamento}
                          onChange={handleShippingAddressChange}
                          className="w-full p-2 border border-gray-300 rounded appearance-none pr-8"
                        >
                          <option value="">Selecciona un Departamento</option>
                          {
                            regions
                              .sort((a, b) => a.localeCompare(b))
                              .map((region, index) => (
                                <option key={index} value={region}>
                                  {region}
                                </option>
                              ))
                          }
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="provincia" className="block text-sm mb-1">
                        Provincia
                      </label>
                      <div className="relative">
                        <select
                          id="provincia"
                          name="provincia"
                          value={shippingAddress.provincia}
                          onChange={handleShippingAddressChange}
                          className="w-full p-2 border border-gray-300 rounded appearance-none pr-8"
                        >
                          <option value="">Selecciona un Provincia</option>
                          {
                            provinces
                              .sort((a, b) => a.localeCompare(b))
                              .map((province, index) => (
                                <option key={index} value={province}>
                                  {province}
                                </option>
                              ))
                          }
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="distrito" className="block text-sm mb-1">
                        Distrito
                      </label>
                      <div className="relative">
                        <select
                          id="distrito"
                          name="distrito"
                          value={shippingAddress.distrito}
                          onChange={handleShippingAddressChange}
                          className="w-full p-2 border border-gray-300 rounded appearance-none pr-8"
                        >
                          <option value="">Selecciona un distrito</option>
                          {
                            districts
                              .sort((a, b) => a.name.localeCompare(b))
                              .map((district, index) => (
                                <option key={index} value={district.id} data-price={district.price}>
                                  {district.name}
                                </option>
                              ))
                          }
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="calle" className="block text-sm mb-1">
                      Avenida / Calle / Jirón
                    </label>
                    <input
                      type="text"
                      id="calle"
                      name="calle"
                      value={shippingAddress.calle}
                      onChange={handleShippingAddressChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Ingresa el nombre de la calle"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="numero" className="block text-sm mb-1">
                        Número
                      </label>
                      <input
                        type="text"
                        id="numero"
                        name="numero"
                        value={shippingAddress.numero}
                        onChange={handleShippingAddressChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Ingresa el número de la calle"
                      />
                    </div>

                    <div>
                      <label htmlFor="referencia" className="block text-sm mb-1">
                        Dpto./ Interior/ Piso/ Lote/ Bloque (opcional)
                      </label>
                      <input
                        type="text"
                        id="referencia"
                        name="referencia"
                        value={shippingAddress.referencia}
                        onChange={handleShippingAddressChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Ejem. Casa 3, Dpto 101"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>

              <div className="space-y-6 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-16">
                      <img
                        src={`/storage/images/item/${item.image}`}
                        alt={item.name}
                        className="w-16 object-cover object-center aspect-[4/3] rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-2 leading-none mb-2">{item.name || `Producto ${index + 1}`}</h3>
                      <p className="text-xs text-gray-500">SKU: {item.sku || "0908824"}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="border border-gray-300 rounded w-12 text-center py-0.5 text-sm bg-white">
                          {item.quantity.toString().padStart(2, "0")}
                        </div>
                        <span className="font-medium">S/ {Number2Currency(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p>Envío</p>
                  <span className="text-primary font-medium">
                    {deliveryMethod === 'pickup' && 'Gratis'}
                    {deliveryMethod === 'express' && (
                      shippingPrice === 0 ? 'Gratis' :
                        shippingPrice === null ? 'No disponible' :
                          shippingPrice === 'destination' ? 'Pago en destino' :
                            `S/ ${Number2Currency(shippingPrice)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p>Subtotal</p>
                  <span>S/ {Number2Currency(totalPrice)}</span>
                </div>

                <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t border-gray-200">
                  <p>Total</p>
                  <span>S/ {Number2Currency(totalPrice + (typeof shippingPrice === 'number' ? shippingPrice : 0))}</span>
                </div>

                <button
                  className={`text-white w-full px-4 py-3 rounded-full cursor-pointer inline-block text-center font-medium mt-4 ${(deliveryMethod === 'express' && (shippingPrice === null || shippingPrice === 'destination'))
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary'
                    }`}
                >
                  Siguiente
                </button>
              </div>

              {/* <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p>Envío</p>
                  <span className="text-primary font-medium">Gratis</span>
                </div>

                <div className="flex justify-between items-center">
                  <p>Subtotal</p>
                  <span>S/{Number2Currency(totalPrice)}</span>
                </div>

                <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t border-gray-200">
                  <p>Total</p>
                  <span>S/{Number2Currency(totalPrice)}</span>
                </div>

                <button className="text-white bg-primary w-full px-4 py-3 rounded-full cursor-pointer inline-block text-center font-medium mt-4">
                  Siguiente
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CheckoutCulqi