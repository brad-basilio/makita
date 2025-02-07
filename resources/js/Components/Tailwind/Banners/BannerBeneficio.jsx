import { Hexagon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const BannerBeneficio = () => {


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

    // Duplicamos los elementos para lograr el efecto infinito
    const infiniteBenefits = [...benefits, ...benefits];
    const sliderRef = useRef(null);

    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            const totalWidth = slider.scrollWidth / 2; // La mitad porque duplicamos la lista
            let start = 0;

            const animate = () => {
                start -= 1; // Velocidad de desplazamiento
                if (Math.abs(start) >= totalWidth) {
                    start = 0; // Reinicia el scroll sin que se note el corte
                }
                slider.style.transform = `translateX(${start}px)`;
                requestAnimationFrame(animate);
            };

            animate();
        }
    }, []);

    const benefitsRef = useRef(null);
    useEffect(() => {
        adjustTextColor(benefitsRef.current)
    })

    return (
        <div ref={benefitsRef} className="bg-primary   py-6 overflow-hidden">
            <div className="px-[5%] mx-auto relative">
                <div
                    ref={sliderRef}
                    className="flex w-full gap-8 whitespace-nowrap transition-none"
                >
                    {infiniteBenefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-4 justify-start w-1/4 flex-shrink-0">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                {/* Hexágono SVG */}

                                <Hexagon className="absolute w-full h-full" strokeWidth={"1.5px"} />
                                {/* Ícono */}
                                <div className="relative z-10 text-3xl">{benefit.icon}</div>
                            </div>
                            <div className="">
                                <h3 className="font-bold text-lg">{benefit.title}</h3>
                                <p className="text-sm">{benefit.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BannerBeneficio;