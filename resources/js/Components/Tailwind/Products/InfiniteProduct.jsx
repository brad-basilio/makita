"use client"

import { useState } from "react"

const InfiniteProduct = ({ items, data }) => {
    const [currentSlide, setCurrentSlide] = useState(0)



    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % (items.length - 3))
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + (items.length - 3)) % (products.length - 3))
    }

    return (
        <section className="py-12 bg-[#F7F9FB]">
            <div className=" mx-auto px-primary">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b-2 customborder-neutral-light">
                    <h2 className="text-4xl font-bold  font-font-secondary ">{data?.title}</h2>
                    <a

                        href="#"
                        className="bg-primary text-white border-2 border-none flex flex-row items-center gap-3 px-3 md:px-6 py-3 text-base rounded-lg tracking-wide font-bold"
                    >
                        Ver todos
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

                {/* Carousel */}
                <div className="relative">
                    {/* Previous button */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-secondary rounded-lg customtext-neutral-dark "
                        aria-label="Productos anteriores"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Products container */}
                    <div className="">
                        <div
                            className="flex items-center transition-all duration-300   ease-in-out"
                            style={{
                                transform: `translateX(-${currentSlide * 25}%)`,
                            }}
                        >
                            {items.map((product) => (
                                <div
                                    key={product.id}
                                    className="group w-full min-w-[200px] px-2 sm:w-1/3 lg:w-1/5 flex-shrink-0 font-font-secondary"
                                >
                                    <div
                                        className="bg-white rounded-2xl shadow-md p-4"
                                        style={{ boxShadow: "0px 0px 6px 0px #00000040" }}
                                    >
                                        {/* Product image and discount badge */}
                                        <div className="relative mb-4">
                                            {product.discount != null && !isNaN(product.discount) && (
                                                <span className="absolute top-2 left-2 bg-[#F93232] text-white text-base font-medium px-2 py-1 rounded-full">
                                                    -{Number(100 - (product.discount * 100 / product.price)).toFixed(0)}%
                                                </span>
                                            )}
                                            <div className="aspect-square rounded-lg overflow-hidden  flex items-center justify-center p-4">
                                                <img
                                                    src={`/api/items/media/${product.image}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        </div>
                                        {/* Action buttons (hidden by default, shown on hover) */}
                                        <div className="my-4 gap-2  hidden group-hover:flex  transition-all  duration-500">
                                            <button className="flex-1 bg-primary text-white px-4 py-2 rounded-lg  transition-colors">
                                                Ver detalle
                                            </button>
                                            <button className="p-2 border border-primary rounded-lg customtext-primary transition-colors">
                                                <svg
                                                    className="w-5 h-5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Product info */}
                                        <div>
                                            <p className="text-xs customtext-neutral-light font-semibold mb-1">
                                                {product.brand.name}
                                            </p>
                                            <h3 className="customtext-neutral-dark text-sm font-semibold mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>

                                            {/* Price */}
                                            <div className="flex flex-col items-baseline gap-2 mb-4">
                                                {product.discount != null && !isNaN(product.discount) && (
                                                    <span className="text-xs customtext-neutral-light font-semibold1 line-through">
                                                        S/ {product.price}
                                                    </span>
                                                )}
                                                <span className="customtext-neutral-dark text-2xl font-bold">
                                                    S/ {product.final_price}
                                                </span>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Next button */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-secondary rounded-lg customtext-neutral-dark "
                        aria-label="Siguientes productos"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default InfiniteProduct;