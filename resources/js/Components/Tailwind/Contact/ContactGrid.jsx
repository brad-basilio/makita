import { Mail, Phone, Building2, Store } from "lucide-react"
import { useState } from "react"

const ContactGrid = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        // Aquí iría la lógica para enviar el formulario
        console.log("Form submitted:", formData)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    return (

        <section section className="container mx-auto px-4" >
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                    <h2 className="text-3xl font-bold mb-4">Hablemos Hoy</h2>
                    <p className="text-gray-600 mb-8">
                        Etiam ultricies sapien mauris, a consectetur sapien posuere eu. Sed ac faucibus lorem. Integer sit amet
                        tempus sapien.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Nombre completo"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Correo Electrónico"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>
                        <div>
                            <textarea
                                name="message"
                                placeholder="Deja tu mensaje..."
                                value={formData.message}
                                onChange={handleChange}
                                rows="6"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Enviar mensaje
                        </button>
                    </form>
                </div>

                {/* Contact Information */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3 text-blue-500 mb-2">
                            <Mail className="w-5 h-5" />
                            <h3 className="font-medium">Email</h3>
                        </div>
                        <p className="text-gray-600 mb-2">Escríbenos para recibir atención personalizada y resolver tus dudas.</p>
                        <a href="mailto:hola@mail.com" className="text-blue-500 hover:underline">
                            hola@mail.com
                        </a>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3 text-blue-500 mb-2">
                            <Phone className="w-5 h-5" />
                            <h3 className="font-medium">Teléfono</h3>
                        </div>
                        <p className="text-gray-600 mb-2">Llámanos para obtener soporte inmediato y asistencia profesional.</p>
                        <a href="tel:+51987456324" className="text-blue-500 hover:underline">
                            +51 987 456 324
                        </a>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3 text-blue-500 mb-2">
                            <Building2 className="w-5 h-5" />
                            <h3 className="font-medium">Oficinas</h3>
                        </div>
                        <p className="text-gray-600 mb-2">
                            Visítanos en nuestra oficina para conocer nuestras soluciones de tratamiento en persona.
                        </p>
                        <p className="text-blue-500">Av. Honorio Delgado 224 - San Martín de Porres - Lima</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3 text-blue-500 mb-2">
                            <Store className="w-5 h-5" />
                            <h3 className="font-medium">Tiendaa</h3>
                        </div>
                        <p className="text-blue-500">Av. Argentina 460 – Cercado de Lima - Lima, CC Malvitec Tienda H31</p>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default ContactGrid;