import { useEffect, useState } from "react";
import Number2Currency from "../../../../Utils/Number2Currency";
import ubigeoData from "../../../../../../storage/app/utils/ubigeo.json";
import DeliveryPricesRest from "../../../../Actions/DeliveryPricesRest";
import { processCulqiPayment } from "../../../../Actions/culqiPayment";
import { processMercadoPagoPayment } from "../../../../Actions/mercadoPagoPayment"
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import InputForm from "./InputForm";
import SelectForm from "./SelectForm";
import OptionCard from "./OptionCard";
import { InfoIcon } from "lucide-react";
import { Notify } from "sode-extend-react";
import { renderToString } from "react-dom/server";
export default function ShippingStepSF({
    cart,
    setSale,
    setCode,
    setDelivery,
    setCart,
    onContinue,
    noContinue,
    subTotal,
    igv,
    totalFinal,
    user,
    setEnvio,
    envio,
    prefixes,
}) {
    
    const [formData, setFormData] = useState({
        name: user?.name || "",
        lastname: user?.lastname || "",
        email: user?.email || "",
        phone_prefix: user?.phone_prefix || "51", //telf
        phone: user?.phone || "",   //telf
        department: user?.department || "",
        province: user?.province || "",
        district: user?.district || "",
        address: user?.address || "",
        number: user?.number || "",
        comment: user?.comment || "",
        reference: user?.reference || "",
        shippingOption: "delivery", // Valor predeterminado

        invoiceType: user?.invoiceType || "boleta", // Nuevo campo para tipo de comprobante
        documentType: user?.documentType || "dni", 
        document: user?.document || "", 
        businessName: user?.businessName || "", // Nuevo campo para Razón Social
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Si cambia el tipo de comprobante, actualizar el tipo de documento por defecto
        if (name === "invoiceType") {
            setFormData(prev => ({
                ...prev,
                documentType: value === "factura" ? "ruc" : "dni",
                document: "",
                businessName: value === "factura" ? prev.businessName : ""
            }));
        }
    };

    // Estados para manejar los valores seleccionados
    const [departamento, setDepartamento] = useState("");
    const [provincia, setProvincia] = useState("");
    const [distrito, setDistrito] = useState("");

    // Estados para las opciones dinámicas
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);

    // Estado para el precio de envío
    const [shippingCost, setShippingCost] = useState(0);

    // Cargar los departamentos al iniciar el componente
    useEffect(() => {
        const uniqueDepartamentos = [
            ...new Set(ubigeoData.map((item) => item.departamento)),
        ];
        setDepartamentos(uniqueDepartamentos);
    }, []);

    // Filtrar provincias cuando se selecciona un departamento
    useEffect(() => {
        if (departamento) {
            const filteredProvincias = [
                ...new Set(
                    ubigeoData
                        .filter((item) => item.departamento === departamento)
                        .map((item) => item.provincia)
                ),
            ];
            setProvincias(filteredProvincias);
            setProvincia(""); // Reiniciar provincia
            setDistrito(""); // Reiniciar distrito
            setDistritos([]); // Limpiar distritos
            setFormData((prev) => ({
                ...prev,
                department: departamento,
                province: "",
                district: "",
            }));
        }
    }, [departamento]);

    // Filtrar distritos cuando se selecciona una provincia
    useEffect(() => {
        if (provincia) {
            const filteredDistritos = ubigeoData
                .filter(
                    (item) =>
                        item.departamento === departamento &&
                        item.provincia === provincia
                )
                .map((item) => item.distrito);
            setDistritos(filteredDistritos);
            setDistrito(""); // Reiniciar distrito
            setFormData((prev) => ({
                ...prev,
                province: provincia,
                district: "",
            }));
        }
    }, [provincia]);

    // Consultar el precio de envío cuando se selecciona un distrito
    useEffect(() => {
        if (distrito) {
            setFormData((prev) => ({ ...prev, district: distrito }));

            // Llamar a la API para obtener el precio de envío
            const fetchShippingCost = async () => {
                try {
                    const response = await DeliveryPricesRest.getShippingCost({
                        department: departamento,
                        district: distrito,
                    });
                    setEnvio(response.data.price);
                    if (Number2Currency(response.data.price) > 0) {
                        setSelectedOption("express");
                    } else {
                        setSelectedOption("free");
                    }
                } catch (error) {
                    console.error("Error fetching shipping cost:", error);
                    alert("No se pudo obtener el costo de envío.");
                }
            };

            fetchShippingCost();
        }
    }, [distrito]);

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!user) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Iniciar Sesión",
                body: "Se requiere que incie sesión para realizar la compra",
                type: "danger",
            });

            return;
        }

        // Validar campos según el tipo de comprobante
        if (!formData.document) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error en el Formulario",
                body: `El campo ${formData.documentType === "dni" ? "DNI" : "RUC"} es obligatorio`,
                type: "danger",
            });
            return;
        }

        if (formData.invoiceType === "factura" && !formData.businessName) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error en el Formulario",
                body: "El campo Razón Social es obligatorio para factura",
                type: "danger",
            });
            return;
        }

        if (
            !formData.department ||
            !formData.province ||
            !formData.district ||
            !formData.name ||
            !formData.lastname ||
            !formData.email ||
            !formData.address ||
            !formData.reference ||
            !formData.phone


        ) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error en el Formulario",
                body: "Completar los datos de envío",
                type: "danger",
            });

            return;
        }

        // if (!window.Culqi) {
        //     console.error("❌ Culqi aún no se ha cargado.");
        //     return;
        // }

        if (!window.MercadoPago) {
            console.error("❌ MercadoPago aún no se ha cargado.")
            return
        }

        try {
            const request = {
                user_id: user?.id || "",
                name: formData?.name || "",
                lastname: formData?.lastname || "",
                fullname: `${formData?.name} ${formData?.lastname}`,
                phone_prefix: formData?.phone_prefix || "51",
                email: formData?.email || "",
                phone: `${formData.phone_prefix}${formData.phone}`,
                country: "Perú",
                department: departamento || "",
                province: provincia || "",
                district: distrito || "",
                ubigeo: null,
                address: formData?.address || "",
                number: formData?.number || "",
                comment: formData?.comment || "",
                reference: formData?.reference || "",
                amount: totalFinal || 0,
                delivery: envio,
                cart: cart,
                invoiceType: formData.invoiceType || "",
                documentType: formData.documentType || "",
                document: formData.document || "",
                businessName: formData.businessName || "",
            };
           
            // const response = await processCulqiPayment(request);
            const response = await processMercadoPagoPayment(request)
            const data = response;
            
            if (data.status) {
                setSale(data.sale);
                setDelivery(data.delivery);
                setCode(data.code);
                
            } else {
                Notify.add({
                    icon: "/assets/img/icon.svg",
                    title: "Error en el Pago",
                    body: "El pago ha sido rechazado",
                    type: "danger",
                });
            }
        } catch (error) {
            console.log(error);
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error en el Pago",
                body: "No se llegó a procesar el pago",
                type: "danger",
            });
        }
    };

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
          },
          matcher: function (params, data) {
            if (!params.term || !data.element) return data;
      
            const country = data.element.dataset.country || '';
            const text = data.text || '';
      
            if (country.toLowerCase().includes(params.term.toLowerCase()) ||
                text.toLowerCase().includes(params.term.toLowerCase())) {
              return data;
            }
      
            return null;
          }
        });
    }, [formData.phone_prefix])

    const [selectedOption, setSelectedOption] = useState("free");

    // const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // const handleContinueClick = (e: React.MouseEvent) => {
    //     e.preventDefault()
    //     setIsPaymentModalOpen(true)
    
    
    const handlePaymentComplete = () => {
        // Aquí iría la lógica para procesar el pago completado
        setIsPaymentModalOpen(false)
        // Redireccionar o mostrar confirmación
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-8 lg:gap-8 ">
                <div className="lg:col-span-3">
                    {/* Formulario */}
                    <form
                        className="space-y-6 bg-[#f9f9f9] p-6 rounded-2xl font-font-general"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="grid lg:grid-cols-2 gap-4 ">
                            {/* Nombres */}
                            <InputForm
                                type="text"
                                label="Nombres"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nombres"
                            />
                            {/* Apellidos */}
                            <InputForm
                                label="Apellidos"
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                placeholder="Apellidos"
                            />
                        </div>
                        
                        <div className="grid lg:grid-cols-2 gap-4 ">
                        
                            {/* Correo electrónico */}
                            <InputForm
                                label="Correo electrónico"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Ej. hola@gmail.com"
                            />

                            {/* Celular */}
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-sm mb-1">
                                    Celular
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        className="select2-prefix-selector w-[200px] p-2 border border-gray-300 rounded"
                                        onChange={(e) => setSelectedPrefix(e.target.value)}
                                        name="phone_prefix"
                                        value={formData.phone_prefix}
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
                                                data-country={prefix.country}
                                            >
                                            </option>
                                            ))
                                        }
                                    </select>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="flex-1 p-2 border border-gray-300 rounded"
                                        placeholder="000 000 000"
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Departamento */}
                        <SelectForm
                            label="Departamento"
                            options={departamentos}
                            placeholder="Selecciona un Departamento"
                            onChange={(value) => {
                                setDepartamento(value);
                                setFormData((prev) => ({
                                    ...prev,
                                    department: departamento,
                                }));
                            }}
                        />

                        {/* Provincia */}
                        <SelectForm
                            disabled={!departamento}
                            label="Provincia"
                            options={provincias}
                            placeholder="Selecciona una Provincia"
                            onChange={(value) => {
                                setProvincia(value);
                                setFormData((prev) => ({
                                    ...prev,
                                    province: provincia,
                                }));
                            }}
                        />

                        {/* Distrito */}

                        <SelectForm
                            disabled={!provincia}
                            label="Distrito"
                            options={distritos}
                            placeholder="Selecciona un Distrito"
                            onChange={(value) => {
                                setDistrito(value);
                                setFormData((prev) => ({
                                    ...prev,
                                    district: distrito,
                                }));
                            }}
                        />

                        {/* Dirección */}
                        <InputForm
                            label="Avenida / Calle / Jirón"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Ingresa el nombre de la calle"
                        />

                        <div className="grid lg:grid-cols-2 gap-4">
                            <InputForm
                                label="Número"
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                placeholder="Ingresa el número de la calle"
                            />

                            <InputForm
                                label="Dpto./ Interior/ Piso/ Lote/ Bloque (opcional)"
                                type="text"
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                placeholder="Ej. Casa 3, Dpto 101"
                            />
                        </div>

                        {/* Referencia */}

                        <InputForm
                            label="Referencia"
                            type="text"
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            placeholder="Ejem. Altura de la avenida..."
                        />


                        {/* Tipo de comprobante */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium customtext-neutral-dark">
                                Tipo de comprobante
                            </label>
                            <div className="flex gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio"
                                        name="invoiceType"
                                        value="boleta"
                                        checked={formData.invoiceType === "boleta"}
                                        onChange={handleChange}
                                    />
                                    <span className="ml-2">Boleta</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio"
                                        name="invoiceType"
                                        value="factura"
                                        checked={formData.invoiceType === "factura"}
                                        onChange={handleChange}
                                    />
                                    <span className="ml-2">Factura</span>
                                </label>
                            </div>
                        </div>

                        {/* Documento */}
                        
                        <InputForm
                                label={formData.documentType === "dni" ? "DNI" : "RUC"}
                                type="text"
                                name="document"
                                value={formData.document}
                                onChange={handleChange}
                                placeholder={`Ingrese su ${formData.documentType === "dni" ? "DNI" : "RUC"}`}
                                maxLength={formData.documentType === "dni" ? "8" : "11"}
                        />
                        

                        {/* Razón Social (solo para factura) */}
                        {formData.invoiceType === "factura" && (
                            <InputForm
                                label="Razón Social"
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="Ingrese la razón social"
                            />
                        )}    

                    </form>
                    {/* <div className="flex gap-4 mt-4">
                        <OptionCard
                            title="Envío gratis"
                            description="Entrega entre 3 a 10 días hábiles"
                            selected={selectedOption === "free"}
                        />
                        <OptionCard
                            title="Delivery"
                            description="Delivery 24 horas"
                            selected={selectedOption === "express"}
                        />
                    </div> */}
                </div>
                {/* Resumen de compra */}
                <div className="bg-[#F7F9FB] rounded-xl shadow-lg p-6 col-span-2 h-max font-font-general">
                    <h3 className="text-2xl font-bold pb-6 customtext-neutral-dark">Resumen de compra</h3>

                    <div className="space-y-6 border-b-2 pb-6">
                        {cart.map((item, index) => (
                            <div key={item.id} className="rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-0 rounded-xl">
                                        <img
                                            src={`/storage/images/item/${item.image}`}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded  "
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold customtext-neutral-dark text-base 2xl:text-lg mb-2">
                                            {item.name}
                                        </h3>

                                        <p className="text-sm customtext-neutral-light">
                                            Color:{" "}
                                            <span className="customtext-neutral-dark">
                                                {item.color}
                                            </span>
                                        </p>
                                        <p className="text-sm customtext-neutral-light">
                                            Cantidad:{" "}
                                            <span className="customtext-neutral-dark">
                                                {item.quantity}{" "}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 mt-6">
                        <div className="flex justify-between">
                            <span className="customtext-neutral-dark">
                                Subtotal
                            </span>
                            <span className="font-semibold">
                                S/ {Number2Currency(subTotal)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="customtext-neutral-dark">IGV</span>
                            <span className="font-semibold">
                                S/ {Number2Currency(igv)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="customtext-neutral-dark">Envío</span>
                            <span className="font-semibold">
                                S/ {Number2Currency(envio)}
                            </span>
                        </div>
                        <div className="py-3 border-y-2 mt-6">
                            <div className="flex justify-between font-bold text-[20px] items-center">
                                <span>Total</span>
                                <span>S/ {Number2Currency(totalFinal)}</span>
                            </div>
                        </div>
                        <div className="space-y-2 pt-4">
                            <ButtonPrimary className={'payment-button'} onClick={handlePayment}>
                                {" "}
                                Continuar
                            </ButtonPrimary>
                            <div id="mercadopago-button-container" ></div>
                            {/* style={{ display: "none" }} */}
                            <ButtonSecondary onClick={noContinue}>
                                {" "}
                                Cancelar
                            </ButtonSecondary>
                        </div>
                        <div>
                            <p className="text-sm customtext-neutral-dark">
                                Al realizar tu pedido, aceptas los 
                                <a className="customtext-primary font-bold">
                                    Términos y Condiciones
                                </a>
                                , y que nosotros usaremos sus datos personales de
                                acuerdo con nuestra 
                                <a className="customtext-primary font-bold">
                                    Política de Privacidad
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onPaymentComplete={handlePaymentComplete}
            /> */}
        </>
    );
}
