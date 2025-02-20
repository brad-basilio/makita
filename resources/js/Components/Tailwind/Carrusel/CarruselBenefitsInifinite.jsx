import { Hexagon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const CarruselBenefitsInifinite = ({ items }) => {


    // Duplicamos los elementos para lograr el efecto infinito
    const infiniteBenefits = [...items, ...items];
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
    //infiniteBenefits si lo quiere infinito reemplaza
    //va en el div incial ref = { benefitsRef }
    // va en el div antes de hacer el map ref={sliderRef}
    return (
        <div ref={benefitsRef} className="bg-primary   py-6 overflow-hidden">
            <div className="px-[5%] mx-auto relative">
                <div

                    className="flex w-full gap-8 whitespace-nowrap transition-none"
                >
                    {items.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-4 justify-start w-1/4 "> {/*para infinito usa esto flex-shrink-0*/}
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                {/* Hexágono SVG */}

                                <Hexagon className="absolute w-full h-full" strokeWidth={"1.5px"} />
                                {/* Ícono */}
                                <div className="relative z-10 text-3xl">
                                    <img src={`/api/indicators/media/${benefit.symbol}`} className="w-full h-auto" />
                                </div>
                            </div>
                            <div className="">
                                <h3 className="font-bold text-lg">{benefit.name}</h3>
                                <p className="text-sm">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CarruselBenefitsInifinite;