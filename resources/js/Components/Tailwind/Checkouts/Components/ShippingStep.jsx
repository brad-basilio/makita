import { useCallback, useEffect, useState } from "react";
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
import { useUbigeo } from "../../../../Utils/useUbigeo";
import AsyncSelect from "react-select/async";
import { debounce } from "lodash";

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
    ubigeos = [],
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
    const [costsGet, setCostsGet] = useState(null);
    /*useEffect(() => {
        DeliveryPricesRest.getCosts().then((response) => {
            setCostsGet(response.data);
        });
    }, []);*/
    console.log(ubigeos);
    // Funci
    // Preparar opciones para el select de ubigeo
    /*   const ubigeoOptions = ubigeoData.map((item) => ({
        value: item.reniec,
        label: `${item.distrito}, ${item.provincia}, ${item.departamento}`,
        data: item,
    }));*/

    const handleUbigeoChange = async (selected) => {
        if (!selected) return;
        console.log("selected", selected);

        const { data } = selected;

        setFormData((prev) => ({
            ...prev,
            department: data.departamento,
            province: data.provincia,
            district: data.distrito,
            ubigeo: data.inei,
        }));

        // Consultar precios de envío
        setLoading(true);
        try {
            const response = await DeliveryPricesRest.getShippingCost({
                ubigeo: data.inei,
            });

            const options = [];
            if (response.data.is_free) {
                options.push({
                    type: "free",
                    price: 0,
                    description: response.data.standard.description,
                    deliveryType: response.data.standard.type,
                    characteristics: response.data.standard.characteristics,
                });

                if (response.data.express.price > 0) {
                    options.push({
                        type: "express",
                        price: response.data.express.price,
                        description: response.data.express.description,
                        deliveryType: response.data.express.type,
                        characteristics: response.data.express.characteristics,
                    });
                }
            } else if (response.data.agency.price > 0) {
                options.push({
                    type: "agency",
                    price: response.data.agency.price,
                    description: response.data.agency.description,
                    deliveryType: response.data.agency.type,
                    characteristics: response.data.agency.characteristics,
                });
            } else {
                options.push({
                    type: "standard",
                    price: response.data.standard.price,
                    description: response.data.standard.description,
                    deliveryType: response.data.standard.type,
                    characteristics: response.data.standard.characteristics,
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
        console.log(missingFields);

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

            if (response.status) {
                setSale(response.sale);
                setDelivery(response.delivery);
                setCode(response.code);
                setCart([]);
                onContinue();
            } else {
                Notify.add({
                    icon: "/assets/img/icon.svg",
                    title: "Error en el pago",
                    body: response.message || "Pago rechazado",
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

    const { ubigeoOptions, loadingUbigeo, searchUbigeo } = useUbigeo();

    const loadOptions = useCallback(
        debounce((inputValue, callback) => {
            if (inputValue.length < 3) {
                callback([]);
                return;
            }
            console.log("inputValue", inputValue);

            fetch(`/api/ubigeo/search?q=${encodeURIComponent(inputValue)}`)
                .then((response) => {
                    if (!response.ok) throw new Error("Error en la respuesta");
                    return response.json();
                })
                .then((data) => {
                    const options = data.map((item) => ({
                        value: item.reniec,
                        label: `${item.distrito}, ${item.provincia}, ${item.departamento}`,
                        data: {
                            inei: item.inei,
                            reniec: item.reniec,
                            departamento: item.departamento,
                            provincia: item.provincia,
                            distrito: item.distrito,
                        },
                    }));
                    callback(options);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    callback([]);
                });
        }, 300),
        []
    );
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
                        <label
                            className={`block text-sm 2xl:text-base mb-1 customtext-neutral-dark `}
                        >
                            Ubicación de entrega
                        </label>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={loadOptions}
                            onChange={handleUbigeoChange}
                            placeholder="Buscar distrito, provincia o departamento..."
                            loadingMessage={() => "Buscando ubicaciones..."}
                            noOptionsMessage={({ inputValue }) =>
                                inputValue.length < 3
                                    ? "Buscar distrito, provincia o departamento..."
                                    : "No se encontraron resultados"
                            }
                            isLoading={loading}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    border: "1px solid transparent",
                                    boxShadow: "none",
                                    minHeight: "50px",
                                    "&:hover": {
                                        borderColor: "transparent",
                                    },
                                    borderRadius: "0.75rem",
                                }),
                                menu: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                    marginTop: "4px",
                                    borderRadius: "8px",
                                  //  boxShadow: "none",
                                }),
                                option: (base) => ({
                                    ...base,
                                    color: "inherit",
                                    "&:hover": {
                                        color: "white",
                                    },
                                    backgroundColor: "inherit",
                                    "&:hover": {
                                        backgroundColor: "#f4f4f5",
                                    },
                                }),
                            }}
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
                            className="w-full border focus:bg-primary focus:text-white border-gray-300 rounded-xl  transition-all duration-300"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                        {/*} <Select
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
                            className={`w-full  px-4 py-1.5 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300 `}
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    border: "transparent",
                                    borderColor: state.isFocused
                                        ? "transparent"
                                        : "transparent",
                                    boxShadow: state.isFocused
                                        ? "none"
                                        : "none",
                                }),
                            }}
                        />*/}
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
                                                : option.type === "agency"
                                                ? "Envío en Agencia"
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
                            {console.log(
                                shippingOptions.find(
                                    (o) => o.type === selectedOption
                                )
                            )}

                            {selectedOption && shippingOptions.length > 0 && (
                                <div className="space-y-4 mt-4">
                                    {shippingOptions
                                        .find((o) => o.type === selectedOption)
                                        ?.characteristics?.map(
                                            (char, index) => (
                                                <div
                                                    key={`char-${index}`}
                                                    className="flex items-start gap-4 bg-[#F7F9FB] p-4 rounded-xl"
                                                >
                                                    <div className="w-5 flex-shrink-0">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="lucide lucide-info customtext-primary"
                                                        >
                                                            <circle
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                            />
                                                            <path d="M12 16v-4" />
                                                            <path d="M12 8h.01" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium customtext-neutral-dark">
                                                            {char}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
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
                        Ir a Pagar
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
