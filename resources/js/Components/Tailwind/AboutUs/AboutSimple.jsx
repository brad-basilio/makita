
import { Award, ListChecks, Headphones, Shield } from "lucide-react"

export default function AboutSimple() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="px-4 py-16 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="text-sky-500">Sobre Nosotros</span>
                    <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold">
                        Más que Tecnología,
                        <br />
                        Somos Tu Aliado Digital
                    </h1>
                    <p className="mt-6 text-gray-600 max-w-3xl mx-auto text-lg">
                        En S&T Store, somos más que una tienda de tecnología, somos tu aliado para encontrar las mejores soluciones
                        tecnológicas que transforman tu vida. Desde nuestra fundación, hemos trabajado con pasión para ofrecer
                        productos innovadores, confiables y accesibles diseñados para satisfacer las necesidades de nuestros
                        clientes en un mundo en constante evolución.
                    </p>
                </div>
                <div className="mt-12 max-w-5xl mx-auto rounded-2xl overflow-hidden">
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20186%20(2)-TcLOIcLyPSqJCgck9tlTH1gRRenWxe.png"
                        alt="Tecnología moderna"
                        width={1200}
                        height={400}
                        className="w-full object-cover"
                    />
                </div>
            </section>

            {/* Why Trust Us Section */}
            <section className="px-4 py-16 md:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold">¿Por qué confiar en nosotros?</h2>
                    <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<Award className="h-8 w-8" />}
                            title="Calidad garantizada"
                            description="Todos nuestros productos provienen de marcas reconocidas y cuentan con certificaciones que avalan su desempeño y durabilidad."
                        />
                        <FeatureCard
                            icon={<ListChecks className="h-8 w-8" />}
                            title="Transparencia total"
                            description="Te ofrecemos información clara y detallada sobre cada producto para que tomes decisiones informadas."
                        />
                        <FeatureCard
                            icon={<Headphones className="h-8 w-8" />}
                            title="Asesoramiento experto"
                            description="Nuestro equipo de especialistas esta capacitado para ayudarte a elegir la tecnología que mejor se adapte a tus necesidades."
                        />
                        <FeatureCard
                            icon={<Shield className="h-8 w-8" />}
                            title="Respaldo y garantía"
                            description="Nos aseguramos de que cada compra está protegida con políticas claras de garantía y soporte técnico."
                        />
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="px-4 py-16 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%201618873189-WyGx8DkLzc2GbZAcJ7LEERrAA7T8Q4.png"
                            alt="Innovación tecnológica"
                            width={600}
                            height={600}
                            className="rounded-2xl"
                        />
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold">Tu Confianza, Nuestra Prioridad</h2>
                            <p className="text-gray-600">
                                En S&T Store, estamos aquí para guiarte en cada paso hacia un futuro más conectado. Nos aseguramos de
                                ofrecerte soluciones tecnológicas diseñadas para satisfacer tus necesidades con calidad y confiabilidad.
                            </p>
                            <p className="text-gray-600">
                                Con nosotros, cada elección tecnológica está respaldada por un equipo experto, apasionado y comprometido
                                con superar tus expectativas.
                            </p>
                            <p className="text-gray-600">
                                Porque en S&T Store, no solo entregamos tecnología, entregamos confianza y un servicio que marca la
                                diferencia.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Future Section */}
            <section className="px-4 py-16 md:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold">Tu Conexión con la Tecnología de Hoy y el Futuro</h2>
                            <p className="text-gray-600">
                                En S&T Store, no solo ofrecemos productos tecnológicos de última generación, sino que conectamos tus
                                necesidades con soluciones que transforman tu vida.
                            </p>
                            <p className="text-gray-600">
                                Nuestros productos están diseñados para hacer tu día más eficiente, conectado y productivo. Descubre
                                cómo nuestra innovación puede ayudarte a construir el futuro que siempre has imaginado.
                            </p>
                        </div>
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%201618873188-jIvcqdXQPhvv1PmVA3rvzHjs6clKhQ.png"
                            alt="Tecnología del futuro"
                            width={600}
                            height={600}
                            className="rounded-2xl md:order-first"
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}

