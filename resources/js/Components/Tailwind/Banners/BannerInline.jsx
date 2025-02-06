const BannerInline = () => {


    const benefits = [
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                </svg>
            ),
            title: "Entrega fácil y gratuita",
            subtitle: "En compras mayores a $100",
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                </svg>
            ),
            title: "Garantía premium",
            subtitle: "Hasta 2 años",
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                </svg>
            ),
            title: "Garantía premium",
            subtitle: "Hasta 2 años",
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            ),
            title: "Soporte en línea 24/7",
            subtitle: "Servicio premium",
        },
    ]

    return (
        <div className="bg-blue-500 text-white py-6">
            <div className="px-[5%] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                {/* Hexagon SVG background */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 63 70"
                                    fill="none"
                                    className="absolute w-full h-full"
                                >
                                    <path
                                        d="M28.5 3.04145C30.3564 1.96966 32.6436 1.96966 34.5 3.04145L57.6769 16.4226C59.5333 17.4944 60.6769 19.4752 60.6769 21.6188V48.3812C60.6769 50.5248 59.5333 52.5056 57.6769 53.5774L34.5 66.9585C32.6436 68.0303 30.3564 68.0303 28.5 66.9585L5.32308 53.5773C3.46668 52.5056 2.32309 50.5248 2.32309 48.3812V21.6188C2.32309 19.4752 3.46668 17.4944 5.32309 16.4227L28.5 3.04145Z"
                                        stroke="white"
                                        strokeWidth="4"
                                    />
                                </svg>
                                {/* Icon */}
                                <div className="relative z-10">{benefit.icon}</div>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{benefit.title}</h3>
                                <p className="text-sm text-white/80">{benefit.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BannerInline;