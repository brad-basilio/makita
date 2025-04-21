export default function BannerStatic( {data} ) {
    return (
        <section className="px-primary mx-auto customtext-primary font-font-general mt-10 lg:mt-16">
            <div className="bg-secondary rounded-3xl overflow-hidden">
                <div className="grid grid-cols-1 xl:grid-cols-3 items-center xl:gap-8 px-8 md:px-12">
                    {/* Text Content */}
                    
                    <div className="col-span-1 space-y-4 py-10">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-semibold tracking-normal customtext-neutral-dark leading-normal">
                            Sala Fabulosa, Ahora Más Cerca de Ti
                        </h2>
                        <p className="text-base md:text-lg 2xl:text-xl font-normal">
                            Compra nuestros productos de manera fácil y segura en las principales plataformas:
                        </p>
                    </div>

                    {/* Center Image */}
                    <div className="gap-8 xl:col-span-2 flex flex-col md:flex-row md:justify-center xl:justify-end items-center relative w-full h-full ">

                        <img
                            src="assets/img/salafabulosa/chicatiendas.png"
                            onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                            alt="Persona señalando las tiendas"
                            className="h-[305px] md:h-96 object-contain md:object-cover object-bottom order-2 md:order-none"
                        />

                        <div className="flex items-center">
                            {/* Store Links */}
                            <div className="space-y-6 bg-white p-6 rounded-3xl lg:rounded-[40px] min-w-[300px] max-w-96 w-full h-max ">
                                <p className="text-xl  font-semibold mb-6">Elige tu tienda favorita y lleva la elegancia a tu hogar.</p>

                                {/* Store Buttons */}
                                <div className="space-y-4">
                                    <a
                                        href="https://falabella.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex justify-center rounded-full items-center w-full p-4 bg-secondary transition-colors"
                                    >
                                        <img src="assets/img/salafabulosa/falabella.png"
                                            onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                            alt="Falabella" 
                                            className="h-7 object-contain" />
                                    </a>

                                    <a
                                        href="https://mercadolibre.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex justify-center rounded-full items-centerw-full p-4 bg-secondary  transition-colors"
                                    >
                                        <img src="assets/img/salafabulosa/mercadolibre.png"
                                            onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                            alt="Mercado Libre" 
                                            className="h-7 object-contain" />
                                    </a>

                                    <a
                                        href="https://ripley.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex justify-center rounded-full items-center w-full p-4 bg-secondary transition-colors"
                                    >
                                        <img src="assets/img/salafabulosa/ripley.png"
                                            onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                            alt="Ripley" 
                                            className="h-7 object-contain" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </section>
    )
}

