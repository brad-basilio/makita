import { useEffect, useState } from "react";
import Number2Currency from "../../../../Utils/Number2Currency";
import ubigeoData from "../../../../../../storage/app/utils/ubigeo.json";
import DeliveryPricesRest from "../../../../Actions/DeliveryPricesRest";
import { processCulqiPayment } from "../../../../Actions/culqiPayment";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import InputForm from "./InputForm";
import SelectForm from "./SelectForm";
import OptionCard from "./OptionCard";
import { InfoIcon } from "lucide-react";
import { Notify } from "sode-extend-react";

export default function ShippingStep({
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
}) {
    const [formData, setFormData] = useState({
        name: user?.name || "",
        lastname: user?.lastname || "",
        email: user?.email || "",
        department: user?.department || "",
        province: user?.province || "",
        district: user?.district || "",
        address: user?.address || "",
        number: user?.number || "",
        comment: user?.comment || "",
        reference: user?.reference || "",
        shippingOption: "delivery", // Valor predeterminado
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        if (
            !formData.department ||
            !formData.province ||
            !formData.district ||
            !formData.name ||
            !formData.lastname ||
            !formData.email ||
            !formData.address ||
            !formData.reference
        ) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error en el Formulario",
                body: "Completar los datos de envío",
                type: "danger",
            });

            return;
        }

        if (!window.Culqi) {
            console.error("❌ Culqi aún no se ha cargado.");
            return;
        }
        try {
            const request = {
                user_id: user?.id || "",
                name: formData?.name || "",
                lastname: formData?.lastname || "",
                fullname: `${formData?.name} ${formData?.lastname}`,
                email: formData?.email || "",
                phone: "",
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
            };

            const response = await processCulqiPayment(request);
            const data = response;

            if (data.status) {
                setSale(data.sale);
                setDelivery(data.delivery);
                setCode(data.code);
                setCart([]);
                onContinue();
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

    const [selectedOption, setSelectedOption] = useState("free");
    return (
        <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                {/* Formulario */}
                <form
                    className="space-y-6"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="grid grid-cols-2 gap-4">
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

                    {/* Correo electrónico */}

                    <InputForm
                        label="Correo electrónico"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ej. hola@gmail.com"
                    />

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

                    <div className="grid grid-cols-2 gap-4">
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
                </form>
                <div className="flex gap-4 mt-4">
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
                </div>
                <div className="flex gap-4 mt-6 bg-[#F7F9FB] p-3 rounded-xl">
                    <div className="w-5">
                        <InfoIcon className="customtext-primary" width="20px" />
                    </div>
                    <div className="text-xs font-medium customtext-neutral-dark flex flex-col gap-2">
                        <p>
                            Solo Lima Metropolitana: Dentro de las 24 horas
                            después de efectuado el pago, solo algunos distritos
                            de Lima Metropolitana.
                        </p>
                        <p>
                            {" "}
                            Distritos No incluidos: Santa María del Mar,
                            Pucusana, San Bartolo, Punta Hermosa, Lurín,
                            Pachacamac, Chorrillos, Villa el Salvador, Villa
                            María del Triunfo, San Juan de Miraflores,
                            Cieneguilla, Ate, Chosica, Huaycan, San Juan de
                            Lurigancho (hasta el Metro), Ancón, Santa Rosa,
                            Carabayllo, Puente Piedra.
                        </p>
                        <p>
                            {" "}
                            Same Day: Solo para compras efectuadas hasta las 1pm
                            del día.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4 mt-4 bg-[#F7F9FB] p-3 rounded-xl">
                    <div className="w-5">
                        <InfoIcon className="customtext-primary" width="20px" />
                    </div>
                    <div className="text-xs font-medium customtext-neutral-dark flex flex-col gap-2">
                        <p>
                            Lima: 3 a 4 dias hábiles | Provincia: de 4 a 10 dias
                            hábiles
                        </p>
                    </div>
                </div>
            </div>
            {/* Resumen de compra */}
            <div className="bg-[#F7F9FB] rounded-xl shadow-lg p-6 col-span-2 h-max">
                <h3 className="text-2xl font-bold pb-6">Resumen de compra</h3>

                <div className="space-y-6 border-b-2 pb-6">
                    {cart.map((item, index) => (
                        <div key={item.id} className="rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="bg-white p-2 rounded-xl">
                                    <img
                                        src={`/storage/images/item/${item.image}`}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded  "
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-lg mb-2">
                                        {item.name}
                                    </h3>

                                    <p className="text-sm customtext-neutral-light">
                                        Marca:{" "}
                                        <span className="customtext-neutral-dark">
                                            {item.brand.name}
                                        </span>
                                    </p>
                                    <p className="text-sm customtext-neutral-light">
                                        Cantidad:{" "}
                                        <span className="customtext-neutral-dark">
                                            {item.quantity}{" "}
                                        </span>
                                    </p>
                                    <p className="text-sm customtext-neutral-light">
                                        SKU:{" "}
                                        <span className="customtext-neutral-dark">
                                            {item.sku}
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
                        <ButtonPrimary onClick={handlePayment}>
                            {" "}
                            Continuar
                        </ButtonPrimary>

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
    );
}
