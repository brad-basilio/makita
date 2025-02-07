import Global from "../../../Utils/Global";

const FooterB = () => {
    return (
        <footer className="bg-accent text-white py-12  font-font-secondary">
            <div className="px-primary mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Logo Column */}

                <div className="h-14 aspect-[13/4] ">
                    <div
                        className="h-full w-full bg-primary"
                        style={{
                            maskImage: `url(/assets/resources/logo.png)`,
                            maskSize: "contain",
                            maskPosition: "center",
                            maskRepeat: "no-repeat",

                        }}
                    />
                </div>



                {/* Menu Columns */}
                <div className="grid grid-cols-2 gap-8 col-span-2">
                    {/* Menu Column */}
                    <div>
                        <h3 className="customtext-primary font-medium mb-6 text-lg">Menú</h3>
                        <ul className="space-y-3 text-white">
                            <li>
                                <a href="#" className="hover:customtext-primary transition-colors">
                                    Categorías
                                </a>
                            </li>

                        </ul>
                    </div>

                    {/* Policies Column */}
                    <div>
                        <h3 className="customtext-primary font-medium mb-6 text-lg">Políticas</h3>
                        <ul className="space-y-3 text-white">
                            <li>
                                <a href="#" className="hover:customtext-primary transition-colors">
                                    Políticas de privacidad
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:customtext-primary transition-colors">
                                    Términos y Conduiciones
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:customtext-primary transition-colors">
                                    Políticas de cambio
                                </a>
                            </li>
                            <li className="pt-4">
                                <a href="#" className="flex items-start space-x-2 group">
                                    <svg
                                        className="w-6 h-6 customtext-primary group-hover:customtext-primary transition-colors"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                        Libro de reclamaciones
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Column */}
                <div>
                    <h3 className="customtext-primary font-medium mb-4 text-lg">Únete a nuestro blog</h3>
                    <p className="mb-6 text-white">Suscríbete y recibe todas nuestras novedades</p>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Ingresa tu e-mail"
                            className="w-full px-4 py-3 pr-32 rounded-full text-gray-900  focus:ring-0 focus:ring-none focus:outline-none placeholder-gray-400"
                        />
                        <button className="absolute right-1 top-1 bottom-1 px-6 bg-primary text-white rounded-full hover:bg-cyan-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900">
                            Suscribirme
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default FooterB;