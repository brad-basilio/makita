import { Mail, Phone, Building2, Store } from "lucide-react";
import { useRef, useState } from "react";
import MessagesRest from "../../../Actions/MessagesRest";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Global from "../../../Utils/Global";
const messagesRest = new MessagesRest();

const ContactGrid = ({ data, contacts }) => {
    console.log(contacts);
    const getContact = (correlative) => {
        return (
            contacts.find((contact) => contact.correlative === correlative)
                ?.description || ""
        );
    };

    const location =
        contacts.find((x) => x.correlative == "location")?.description ?? "0,0";

    const locationGps = {
        lat: Number(location.split(",").map((x) => x.trim())[0]),
        lng: Number(location.split(",").map((x) => x.trim())[1]),
    };

    const nameRef = useRef();

    const emailRef = useRef();
    const descriptionRef = useRef();

    const [sending, setSending] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);

        const request = {
            name: nameRef.current.value,

            email: emailRef.current.value,
            description: descriptionRef.current.value,
        };

        const result = await messagesRest.save(request);
        setSending(false);

        if (!result) return;

        Swal.fire({
            icon: "success",
            title: "Mensaje enviado",
            text: "Tu mensaje ha sido enviado correctamente. ¡Nos pondremos en contacto contigo pronto!",
            showConfirmButton: false,
            timer: 3000,
        });

        if (data.redirect) {
            location.href = data.redirect;
        }

        nameRef.current.value = null;

        emailRef.current.value = null;
        descriptionRef.current.value = null;
    };
    return (
        <section section className=" bg-[#F7F9FB] py-12 px-primary ">
            <div className=" mx-auto  2xl:max-w-7xl  flex flex-col md:flex-row gap-12 bg-white rounded-xl p-4 md:px-8 md:py-8">
                {/* Contact Form */}
                <div className="w-full md:w-10/12">
                    <h2 className="text-3xl font-bold mb-4 customtext-neutral-dark">
                        Hablemos Hoy
                    </h2>
                    <p className="customtext-neutral-light mb-8">
                        Etiam ultricies sapien mauris, a consectetur sapien
                        posuere eu. Sed ac faucibus lorem. Integer sit amet
                        tempus sapien.
                    </p>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <input
                                ref={nameRef}
                                disabled={sending}
                                type="text"
                                name="name"
                                placeholder="Nombre completo"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>
                        <div>
                            <input
                                ref={emailRef}
                                disabled={sending}
                                type="email"
                                name="email"
                                placeholder="Correo Electrónico"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>
                        <div>
                            <textarea
                                ref={descriptionRef}
                                disabled={sending}
                                name="message"
                                placeholder="Deja tu mensaje..."
                                rows="6"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-base font-bold text-white px-6 py-3 rounded-xl hover:brightness-90 transition-all"
                        >
                            Enviar mensaje
                        </button>
                    </form>
                </div>

                {/* Contact Information */}
                <div className="space-y-8">
                    <div className="bg-[#F7F9FB] p-6 rounded-xl shadow-lg">
                        <div className="flex items-center gap-3 customtext-primary mb-2">
                            <Mail className="w-5 h-5" />
                            <h3 className=" customtext-neutral-dark font-bold text-lg">
                                Email
                            </h3>
                        </div>
                        <p className="customtext-neutral-light mb-2">
                            Escríbenos para recibir atención personalizada y
                            resolver tus dudas.
                        </p>
                        <a
                            href="mailto:{getContact('email_contact')}"
                            className="customtext-primary font-bold hover:no-underline"
                        >
                            {getContact("email_contact")}
                        </a>
                    </div>

                    <div className="bg-[#F7F9FB] p-6 rounded-xl shadow-lg">
                        <div className="flex items-center gap-3 customtext-primary mb-2">
                            <Phone className="w-5 h-5" />
                            <h3 className="customtext-neutral-dark font-bold text-lg">
                                Teléfono
                            </h3>
                        </div>
                        <p className="customtext-neutral-light mb-2">
                            Llámanos para obtener soporte inmediato y asistencia
                            profesional.
                        </p>
                        <a
                            href="tel:+51987456324"
                            className="customtext-primary hover:no-underline font-bold"
                        >
                            {getContact("phone_contact")}
                        </a>
                    </div>

                    <div className="bg-[#F7F9FB] p-6 rounded-xl shadow-lg">
                        <div className="flex items-center gap-3 customtext-primary mb-2">
                            <Building2 className="w-5 h-5" />
                            <h3 className="customtext-neutral-dark font-bold text-lg">
                                Oficinas
                            </h3>
                        </div>
                        <p className="customtext-neutral-light mb-2">
                            Visítanos en nuestra oficina para conocer nuestras
                            soluciones de tratamiento en persona.
                        </p>
                        <p className="customtext-primary font-bold">
                            {" "}
                            {getContact("address")}
                        </p>
                    </div>

                    <div className="bg-[#F7F9FB] p-6 rounded-xl shadow-lg">
                        <div className="flex items-center gap-3 customtext-primary mb-2">
                            <Store className="w-5 h-5" />
                            <h3 className="customtext-neutral-dark font-bold text-lg">
                                Tienda
                            </h3>
                        </div>
                        <p className="customtext-primary font-bold">
                            {" "}
                            {getContact("address")}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mx-auto 2xl:max-w-7xl   gap-12 bg-white rounded-xl px-8 py-8">
                {console.log(getContact("location"))}
                <LoadScript
                    googleMapsApiKey={Global.GMAPS_API_KEY}
                    className="rounded-xl"
                >
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "400px" }}
                        zoom={10}
                        center={locationGps}
                    >
                        <Marker position={locationGps} />
                    </GoogleMap>
                </LoadScript>
            </div>
        </section>
    );
};

export default ContactGrid;
