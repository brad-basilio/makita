import { useEffect, useState } from "react";
import Select from "react-select";
import Number2Currency from "../../../../Utils/Number2Currency";
import ubigeoData from "../../../../../../storage/app/utils/ubigeo.json";
import DeliveryPricesRest from "../../../../Actions/DeliveryPricesRest";
import { processCulqiPayment } from "../../../../Actions/culqiPayment";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import InputForm from "./InputForm";
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
        department: "",
        province: "",
        district: "",
        address: "",
        number: "",
        comment: "",
        reference: "",
        ubigeo: null,
    });

    const [loading, setLoading] = useState(false);
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    // Preparar opciones para el select de ubigeo
    const ubigeoOptions = ubigeoData.map((item) => ({
        value: item.reniec,
        label: `${item.distrito}, ${item.provincia}, ${item.departamento}`,
        data: item,
    }));

    const handleUbigeoChange = async (selected) => {
        if (!selected) return;

        const { data } = selected;
        setFormData((prev) => ({
            ...prev,
            department: data.departamento,
            province: data.provincia,
            district: data.distrito,
            ubigeo: data.reniec,
        }));

        // Consultar precios de envío
        setLoading(true);
        try {
            const response = await DeliveryPricesRest.getShippingCost({
                ubigeo: data.reniec,
            });

            const options = [];
            if (response.data.is_free) {
                options.push({
                    type: "free",
                    price: 0,
                    description: response.data.standard.description,
                    deliveryType: response.data.standard.type,
                });

                if (response.data.express.price > 0) {
                    options.push({
                        type: "express",
                        price: response.data.express.price,
                        description: response.data.express.description,
                        deliveryType: response.data.express.type,
                    });
                }
            } else {
                options.push({
                    type: "standard",
                    price: response.data.standard.price,
                    description: response.data.standard.description,
                    deliveryType: response.data.standard.type,
                });
            }

            setShippingOptions(options);
            setSelectedOption(options[0].type);
            setEnvio(options[0].price);
        } catch (error) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Sin cobertura",
                body: "No realizamos envíos a esta ubicación",
                type: "danger",
            });
            setShippingOptions([]);
            setSelectedOption(null);
            setEnvio(0);
        }
        setLoading(false);
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!user) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Acceso requerido",
                body: "Debe iniciar sesión para continuar",
                type: "danger",
            });
            return;
        }

        const requiredFields = [
            "name",
            "lastname",
            "email",
            "ubigeo",
            "address",
            "reference",
        ];
        const missingFields = requiredFields.filter(
            (field) => !formData[field]
        );

        if (missingFields.length > 0) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Campos incompletos",
                body: "Complete todos los campos obligatorios",
                type: "danger",
            });
            return;
        }

        if (!selectedOption) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Seleccione envío",
                body: "Debe elegir un método de envío",
                type: "danger",
            });
            return;
        }

        try {
            const request = {
                user_id: user.id,
                ...formData,
                fullname: `${formData.name} ${formData.lastname}`,
                country: "Perú",
                amount: totalFinal,
                delivery: envio,
                cart: cart,
            };

            const response = await processCulqiPayment(request);

            if (response.data.status) {
                setSale(response.data.sale);
                setDelivery(response.data.delivery);
                setCode(response.data.code);
                setCart([]);
                onContinue();
            } else {
                Notify.add({
                    icon: "/assets/img/icon.svg",
                    title: "Error en el pago",
                    body: response.data.message || "Pago rechazado",
                    type: "danger",
                });
            }
        } catch (error) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error",
                body: "Ocurrió un error al procesar el pedido",
                type: "danger",
            });
        }
    };

    return (
        <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <form
                    className="space-y-6"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <InputForm
                            label="Nombres"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            required
                        />
                        <InputForm
                            label="Apellidos"
                            value={formData.lastname}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    lastname: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    <InputForm
                        label="Correo electrónico"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
                        required
                    />

                    <div className="form-group">
                        <label className="form-label">
                            Ubicación de entrega
                        </label>
                        <Select
                            options={ubigeoOptions}
                            onChange={handleUbigeoChange}
                            placeholder="Buscar distrito, provincia o departamento..."
                            isSearchable
                            isLoading={loading}
                            noOptionsMessage={() =>
                                "No se encontraron ubicaciones"
                            }
                            formatOptionLabel={({ data }) => (
                                <div className="text-sm">
                                    <div className="font-medium">
                                        {data.distrito}
                                    </div>
                                    <div className="text-gray-500">
                                        {data.provincia}, {data.departamento}
                                    </div>
                                </div>
                            )}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "0.375rem",
                                    padding: "2px",
                                }),
                            }}
                        />
                    </div>

                    <InputForm
                        label="Dirección"
                        value={formData.address}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                address: e.target.value,
                            }))
                        }
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <InputForm
                            label="Número"
                            value={formData.number}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    number: e.target.value,
                                }))
                            }
                        />
                        <InputForm
                            label="Referencia"
                            value={formData.reference}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    reference: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    {shippingOptions.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                Método de envío
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {shippingOptions.map((option) => (
                                    <OptionCard
                                        key={option.type}
                                        title={
                                            option.type === "free"
                                                ? "Envío Gratis"
                                                : option.type === "express"
                                                ? "Envío Express"
                                                : "Envío Estándar"
                                        }
                                        price={option.price}
                                        description={option.description}
                                        selected={
                                            selectedOption === option.type
                                        }
                                        onSelect={() => {
                                            setSelectedOption(option.type);
                                            setEnvio(option.price);
                                        }}
                                    />
                                ))}
                            </div>

                            {selectedOption && (
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        {
                                            shippingOptions.find(
                                                (o) => o.type === selectedOption
                                            )?.description
                                        }
                                    </p>
                                    {selectedOption === "express" && (
                                        <p className="text-xs mt-2 text-blue-700">
                                            Disponible para pedidos antes de las
                                            1pm
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </div>

            {/* Resumen de compra */}
            <div className="bg-[#F7F9FB] rounded-xl shadow-lg p-6 col-span-2 h-max">
                <h3 className="text-2xl font-bold pb-6">Resumen</h3>

                <div className="space-y-4 border-b-2 pb-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                            <img
                                src={`/storage/images/item/${item.image}`}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-gray-600">
                                    Cantidad: {item.quantity}
                                </p>
                                <p className="text-sm text-gray-600">
                                    S/ {Number2Currency(item.price)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 mt-6">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>S/ {Number2Currency(subTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>IGV (18%):</span>
                        <span>S/ {Number2Currency(igv)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Envío:</span>
                        <span>S/ {Number2Currency(envio)}</span>
                    </div>

                    <div className="pt-4 border-t-2">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>S/ {Number2Currency(totalFinal)}</span>
                        </div>
                    </div>

                    <ButtonPrimary
                        onClick={handlePayment}
                        className="w-full mt-6"
                    >
                        Pagar con Culqi
                    </ButtonPrimary>

                    <p className="text-xs text-gray-600 mt-4 text-center">
                        Al completar tu compra aceptas nuestros{" "}
                        <a
                            href="/terminos"
                            className="text-blue-600 hover:underline"
                        >
                            Términos y Condiciones
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
