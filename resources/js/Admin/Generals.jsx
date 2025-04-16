import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Asume que tienes un servicio para guardar los datos
import BaseAdminto from "../Components/Adminto/Base";
import GeneralsRest from "../Actions/Admin/GeneralsRest";
import CreateReactScript from "../Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import Global from "../Utils/Global";

const generalsRest = new GeneralsRest();

const Generals = ({ generals }) => {
    const location =
        generals.find((x) => x.correlative == "location")?.description ?? "0,0";

    // First add these to your formData state
    const [formData, setFormData] = useState({
        phones: generals
            .find((x) => x.correlative == "phone_contact")
            ?.description?.split(",")
            ?.map((x) => x.trim()) ?? [""],
        emails: generals
            .find((x) => x.correlative == "email_contact")
            ?.description?.split(",")
            ?.map((x) => x.trim()) ?? [""],
        cintillo:
            generals.find((x) => x.correlative == "cintillo")?.description ??
            "",
        copyright:
            generals.find((x) => x.correlative == "copyright")?.description ??
            "",
        address:
            generals.find((x) => x.correlative == "address")?.description ?? "",
        openingHours:
            generals.find((x) => x.correlative == "opening_hours")
                ?.description ?? "",
        supportPhone:
            generals.find((x) => x.correlative == "support_phone")
                ?.description ?? "",
        supportEmail:
            generals.find((x) => x.correlative == "support_email")
                ?.description ?? "",
        privacyPolicy:
            generals.find((x) => x.correlative == "privacy_policy")
                ?.description ?? "",
        termsConditions:
            generals.find((x) => x.correlative == "terms_conditions")
                ?.description ?? "",
        deliveryPolicy:
            generals.find((x) => x.correlative == "delivery_policy")
                ?.description ?? "",
        salebackPolicy:
            generals.find((x) => x.correlative == "saleback_policy")
                ?.description ?? "",
        phoneWhatsapp:
            generals.find((x) => x.correlative == "phone_whatsapp")
                ?.description ?? "",
        messageWhatsapp:
            generals.find((x) => x.correlative == "message_whatsapp")
                ?.description ?? "",
        location: {
            lat: Number(location.split(",").map((x) => x.trim())[0]),
            lng: Number(location.split(",").map((x) => x.trim())[1]),
        },
        culqi: generals.find((x) => x.correlative == "culqi")
            ?.description ?? "",
    });

    const [activeTab, setActiveTab] = useState("contact");

    const handleInputChange = (e, index, field) => {
        const { value } = e.target;
        const list = [...formData[field]];
        list[index] = value;
        setFormData((prevState) => ({
            ...prevState,
            [field]: list,
        }));
    };

    const handleAddField = (field) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: [...prevState[field], ""],
        }));
    };

    const handleRemoveField = (index, field) => {
        const list = [...formData[field]];
        list.splice(index, 1);
        setFormData((prevState) => ({
            ...prevState,
            [field]: list,
        }));
    };

    const handleMapClick = (event) => {
        setFormData((prevState) => ({
            ...prevState,
            location: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await generalsRest.save([
                {
                    correlative: "phone_contact",
                    name: "Teléfono de contacto",
                    description: formData.phones.join(","),
                },
                {
                    correlative: "email_contact",
                    name: "Correo de contacto",
                    description: formData.emails.join(","),
                },
                {
                    correlative: "address",
                    name: "Dirección",
                    description: formData.address,
                },
                {
                    correlative: "cintillo",
                    name: "Cintillo",
                    description: formData.cintillo,
                },
                {
                    correlative: "copyright",
                    name: "Copyright",
                    description: formData.copyright,
                },
                {
                    correlative: "opening_hours",
                    name: "Horarios de atención",
                    description: formData.openingHours,
                },
                {
                    correlative: "support_phone",
                    name: "Número de soporte",
                    description: formData.supportPhone,
                },
                {
                    correlative: "support_email",
                    name: "Correo de soporte",
                    description: formData.supportEmail,
                },
                {
                    correlative: "privacy_policy",
                    name: "Política de privacidad",
                    description: formData.privacyPolicy,
                },
                {
                    correlative: "terms_conditions",
                    name: "Términos y condiciones",
                    description: formData.termsConditions,
                },
                {
                    correlative: "delivery_policy",
                    name: "Políticas de envío",
                    description: formData.deliveryPolicy,
                },
                {
                    correlative: "saleback_policy",
                    name: "Políticas de devolucion y cambio",
                    description: formData.salebackPolicy,
                },
                {
                    correlative: "phone_whatsapp",
                    name: "Número de Whatsapp",
                    description: formData.phoneWhatsapp,
                },
                {
                    correlative: "message_whatsapp",
                    name: "Mensaje de Whatsapp",
                    description: formData.messageWhatsapp,
                },
                {
                    correlative: "location",
                    name: "Ubicación",
                    description: `${formData.location.lat},${formData.location.lng}`,
                },
            ]);
            // alert('Datos guardados exitosamente');
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            // alert('Error al guardar los datos');
        }
    };

    return (
        <div className="card">
            <form className="card-body" onSubmit={handleSubmit}>
                <ul className="nav nav-tabs" id="contactTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "contact" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("contact")}
                            type="button"
                            role="tab"
                        >
                            Información de Contacto
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "checkout" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("checkout")}
                            type="button"
                            role="tab"
                        >
                            Métodos de Pago
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "policies" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("policies")}
                            type="button"
                            role="tab"
                        >
                            Políticas y Términos
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "location" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("location")}
                            type="button"
                            role="tab"
                        >
                            Ubicación
                        </button>
                    </li>
                </ul>

                <div className="tab-content" id="contactTabsContent">
                    <div
                        className={`tab-pane fade ${activeTab === "contact" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <div className="row">
                            <div className="col-md-6">
                                {formData.phones.map((phone, index) => (
                                    <div
                                        key={`phone-${index}`}
                                        className="mb-3"
                                    >
                                        <label
                                            htmlFor={`phone-${index}`}
                                            className="form-label"
                                        >
                                            Teléfono {index + 1}
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id={`phone-${index}`}
                                                value={phone}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        index,
                                                        "phones"
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleRemoveField(
                                                        index,
                                                        "phones"
                                                    )
                                                }
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleAddField("phones")}
                                >
                                    Agregar teléfono
                                </button>
                            </div>
                            <div className="col-md-6">
                                {formData.emails.map((email, index) => (
                                    <div
                                        key={`email-${index}`}
                                        className="mb-3"
                                    >
                                        <label
                                            htmlFor={`email-${index}`}
                                            className="form-label"
                                        >
                                            Correo {index + 1}
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`email-${index}`}
                                                value={email}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        index,
                                                        "emails"
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleRemoveField(
                                                        index,
                                                        "emails"
                                                    )
                                                }
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleAddField("emails")}
                                >
                                    Agregar correo
                                </button>
                            </div>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="cintillo" className="form-label">
                                Cintillo
                            </label>
                            <textarea
                                className="form-control"
                                id="cintillo"
                                value={formData.cintillo}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        cintillo: e.target.value,
                                    })
                                }
                            ></textarea>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="copyright" className="form-label">
                                Copyright
                            </label>
                            <textarea
                                className="form-control"
                                id="copyright"
                                value={formData.copyright}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        copyright: e.target.value,
                                    })
                                }
                            ></textarea>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="address" className="form-label">
                                Dirección
                            </label>
                            <textarea
                                className="form-control"
                                id="address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        address: e.target.value,
                                    })
                                }
                                required
                            ></textarea>
                        </div>
                        <div className="mb-2">
                            <TextareaFormGroup
                                label="Horarios de atencion"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        openingHours: e.target.value,
                                    })
                                }
                                value={formData.openingHours}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="supportPhone"
                                className="form-label"
                            >
                                Número de soporte
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="supportPhone"
                                value={formData.supportPhone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        supportPhone: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="supportEmail"
                                className="form-label"
                            >
                                Correo de soporte
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="supportEmail"
                                value={formData.supportEmail}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        supportEmail: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="phoneWhatsapp"
                                className="form-label"
                            >
                                Número de Whatsapp
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phoneWhatsapp"
                                value={formData.phoneWhatsapp}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phoneWhatsapp: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="messageWhatsapp"
                                className="form-label"
                            >
                                Mensaje de Whatsapp
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="messageWhatsapp"
                                value={formData.messageWhatsapp}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        messageWhatsapp: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "checkout" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <div className="row">
                            <div className="col-sm-3">
                                <div className="nav flex-column nav-pills nav-pills-tab" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                    <a className="nav-link active show mb-1" id="v-culqi-tab" data-bs-toggle="pill" href="#v-culqi" role="tab" aria-controls="v-culqi" aria-selected="true">
                                        Culqi
                                    </a>
                                    <a className="nav-link mb-1" id="v-digital-wallet-tab" data-bs-toggle="pill" href="#v-digital-wallet" role="tab" aria-controls="v-digital-wallet" aria-selected="false">
                                        Yape / Plin
                                    </a>
                                    <a className="nav-link mb-1" id="v-transfer-tab" data-bs-toggle="pill" href="#v-transfer" role="tab" aria-controls="v-transfer" aria-selected="false">
                                        Transferencia
                                    </a>
                                </div>
                            </div>
                            <div className="col-sm-9">
                                <div className="tab-content pt-0">
                                    <div className="tab-pane fade active show" id="v-culqi" role="tabpanel" aria-labelledby="v-culqi-tab">
                                        <div className="mb-2">
                                            <label className="form-label">Título del formulario</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.culqi?.name}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    culqi: {
                                                        ...formData.culqi,
                                                        name: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Clave Pública</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.culqi?.public_key}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    culqi: {
                                                        ...formData.culqi,
                                                        public_key: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Clave Privada</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={formData.culqi?.private_key}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    culqi: { ...formData.culqi, private_key: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="v-digital-wallet" role="tabpanel" aria-labelledby="v-digital-wallet-tab">
                                        <div className="mb-2">
                                            <label className="form-label">QR</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setFormData({
                                                                ...formData,
                                                                digitalWallet: { ...formData.digitalWallet, qr: reader.result }
                                                            });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Título</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.digitalWallet?.title}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    digitalWallet: { ...formData.digitalWallet, title: e.target.value }
                                                })}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Descripción</label>
                                            <textarea
                                                className="form-control"
                                                value={formData.digitalWallet?.description}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    digitalWallet: { ...formData.digitalWallet, description: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="v-transfer" role="tabpanel" aria-labelledby="v-transfer-tab">
                                        {formData.bankAccounts?.map((account, index) => (
                                            <div key={index} className="border rounded p-3 mb-3">
                                                <div className="mb-2">
                                                    <label className="form-label">CCI</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={account.cci}
                                                        onChange={(e) => {
                                                            const newAccounts = [...formData.bankAccounts];
                                                            newAccounts[index].cci = e.target.value;
                                                            setFormData({ ...formData, bankAccounts: newAccounts });
                                                        }}
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="form-label">Título</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={account.title}
                                                        onChange={(e) => {
                                                            const newAccounts = [...formData.bankAccounts];
                                                            newAccounts[index].title = e.target.value;
                                                            setFormData({ ...formData, bankAccounts: newAccounts });
                                                        }}
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="form-label">Descripción</label>
                                                    <textarea
                                                        className="form-control"
                                                        value={account.description}
                                                        onChange={(e) => {
                                                            const newAccounts = [...formData.bankAccounts];
                                                            newAccounts[index].description = e.target.value;
                                                            setFormData({ ...formData, bankAccounts: newAccounts });
                                                        }}
                                                    />
                                                </div>
                                                {formData.bankAccounts.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() => {
                                                            const newAccounts = formData.bankAccounts.filter((_, i) => i !== index);
                                                            setFormData({ ...formData, bankAccounts: newAccounts });
                                                        }}
                                                    >
                                                        Eliminar cuenta
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => setFormData({
                                                ...formData,
                                                bankAccounts: [...formData.bankAccounts, { cci: "", title: "", description: "" }]
                                            })}
                                        >
                                            Agregar cuenta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "policies" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <div className="mb-2">
                            <QuillFormGroup
                                label="Política de privacidad"
                                value={formData.privacyPolicy}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        privacyPolicy: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-2">
                            <QuillFormGroup
                                label="Términos y condiciones"
                                value={formData.termsConditions}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        termsConditions: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-2">
                            <QuillFormGroup
                                label="Políticas de envío"
                                value={formData.deliveryPolicy}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        deliveryPolicy: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-2">
                            <QuillFormGroup
                                label="Políticas de devolución y cambio"
                                value={formData.salebackPolicy}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        salebackPolicy: value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "location" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <LoadScript googleMapsApiKey={Global.GMAPS_API_KEY}>
                            <GoogleMap
                                mapContainerStyle={{
                                    width: "100%",
                                    height: "400px",
                                }}
                                center={formData.location}
                                zoom={10}
                                onClick={handleMapClick}
                            >
                                <Marker position={formData.location} />
                            </GoogleMap>
                        </LoadScript>
                        <small className="form-text text-muted">
                            Haz clic en el mapa para seleccionar la ubicación.
                        </small>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary mt-3">
                    Guardar
                </button>
            </form>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Datos Generales">
            <Generals {...properties} />
        </BaseAdminto>
    );
});
