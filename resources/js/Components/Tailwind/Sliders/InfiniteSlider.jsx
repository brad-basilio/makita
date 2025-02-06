import React, { useState, useRef, useEffect } from "react";

const InfiniteSlider = ({ items, data }) => {
    const [currentIndex, setCurrentIndex] = useState(1); // Empezamos en 1 para evitar el salto brusco
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentTranslate = useRef(0);

    // Duplicamos los slides al principio y al final para crear el efecto de loop infinito
    const duplicatedItems = [items[items.length - 1], ...items, items[0]];

    const validAlignments = ["center", "left", "right"];
    const showPagination = validAlignments.includes(data.paginationAlignment);
    const alignmentClassPagination = showPagination
        ? data.paginationAlignment
        : "center";

    const showNavigation = validAlignments.includes(data.navigationAlignment);
    const alignmentClassNavigation = showNavigation
        ? data.navigationAlignment
        : "center";

    const nextSlide = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex + 1) % duplicatedItems.length
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? duplicatedItems.length - 1 : prevIndex - 1
        );
    };

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX;
        sliderRef.current.style.transition = "none";
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;

        const deltaX = e.pageX - startX.current;
        currentTranslate.current =
            -currentIndex * 100 + (deltaX / window.innerWidth) * 100;
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
    };

    const handleMouseUp = () => {
        if (!isDragging.current) return;

        isDragging.current = false;
        sliderRef.current.style.transition = "transform 0.5s ease-in-out";

        const threshold = 20;
        const deltaX = Math.abs(
            (currentTranslate.current + currentIndex * 100) *
            (window.innerWidth / 100)
        );

        if (deltaX > threshold) {
            if (currentTranslate.current > -currentIndex * 100) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            setCurrentIndex(currentIndex);
        }

        sliderRef.current.style.transform = `translateX(-${currentIndex * 100
            }%)`;
    };

    const handleMouseLeave = () => {
        if (isDragging.current) {
            handleMouseUp();
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    // Efecto para manejar el loop infinito sin saltos bruscos
    useEffect(() => {
        if (currentIndex === 0) {
            setTimeout(() => {
                sliderRef.current.style.transition = "none";
                setCurrentIndex(duplicatedItems.length - 2);
                sliderRef.current.style.transform = `translateX(-${(duplicatedItems.length - 2) * 100
                    }%)`;
            }, 500);
        } else if (currentIndex === duplicatedItems.length - 1) {
            setTimeout(() => {
                sliderRef.current.style.transition = "none";
                setCurrentIndex(1);
                sliderRef.current.style.transform = `translateX(-${1 * 100}%)`;
            }, 500);
        }
    }, [currentIndex]);

    return (
        <div className="relative w-full mx-auto">
            <div
                className="overflow-hidden relative cursor-grab"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    ref={sliderRef}
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {duplicatedItems.map((item, index) => (
                        <div
                            key={`slide-${index}`}
                            className="w-full flex-shrink-0 relative"
                        >
                            <img
                                src={`/api/sliders/media/${item.bg_image || "undefined"
                                    }`}
                                alt={item.name}
                                className="absolute top-0 left-0 w-full h-full object-cover object-center z-0"
                            />
                            <div className="relative w-full px-[5%]  mx-auto p-4 h-[480px] md:h-[600px] flex flex-col items-start justify-center">
                                <div className="flex flex-col gap-5 lg:gap-10 items-start">
                                    <h2
                                        className="max-w-md font-font-primary customtext-neutral-dark text-3xl sm:text-5xl md:text-6xl tracking-normal font-bold "
                                        style={{
                                            textShadow:
                                                "0 0 20px rgba(0, 0, 0, .25)",
                                        }}
                                    >
                                        {item.name}
                                    </h2>
                                    <p
                                        className="max-w-md customtext-neutral-dark text-lg  font-font-secondary
                                         font-normal"
                                        style={{
                                            textShadow:
                                                "0 0 20px rgba(0, 0, 0, .25)",
                                        }}
                                    >
                                        {item.description}
                                    </p>
                                    <div className="flex flex-row gap-5 md:gap-10 justify-center items-start">
                                        <a
                                            href={item.button_link}
                                            className="bg-primary text-white border-2 border-none flex flex-row items-center gap-3 px-3 md:px-6 py-3 text-base rounded-lg tracking-wide font-bold"
                                        >
                                            {item.button_text}
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M10.9961 10H11.0111M10.9998 16H11.0148"
                                                    stroke="white"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M7 13H15"
                                                    stroke="white"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M17.5 5C18.3284 5 19 5.67157 19 6.5C19 7.32843 18.3284 8 17.5 8C16.6716 8 16 7.32843 16 6.5C16 5.67157 16.6716 5 17.5 5Z"
                                                    stroke="white"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z"
                                                    stroke="white"
                                                    stroke-width="1.5"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showNavigation && (
                <>
                    <div
                        className={`absolute top-1/2 left-4 transform -translate-y-1/2 ${alignmentClassNavigation === "left"
                            ? "visible"
                            : "hidden"
                            }`}
                    >
                        <button
                            onClick={prevSlide}
                            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors duration-300"
                        >
                            &#10094;
                        </button>
                    </div>
                    <div
                        className={`absolute top-1/2 right-4 transform -translate-y-1/2 ${alignmentClassNavigation === "right"
                            ? "visible"
                            : "hidden"
                            }`}
                    >
                        <button
                            onClick={nextSlide}
                            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors duration-300"
                        >
                            &#10095;
                        </button>
                    </div>
                </>
            )}

            {showPagination && (
                <div className="px-[5%] mx-auto ">
                    <div className="relative">
                        <div
                            className={`absolute bottom-4 ${alignmentClassPagination === "left"
                                ? "inset-x-0 left-0"
                                : alignmentClassPagination === "right"
                                    ? "right-0"
                                    : "left-1/2 transform -translate-x-1/2"
                                }`}
                        >
                            {items.map((_, index) => (
                                <div
                                    key={`dot-${index}`}
                                    className={`inline-flex mx-1 w-3 h-3 rounded-full ${currentIndex === index + 1
                                        ? "bg-white w-5 h-5 items-center justify-center border-2 border-primary"
                                        : "bg-secondary"
                                        }`}
                                    onClick={() => setCurrentIndex(index + 1)}
                                >
                                    {currentIndex === index + 1 && (
                                        <div className="w-3 h-3 bg-primary rounded-full items-center justify-center"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfiniteSlider;
