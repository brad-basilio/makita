import { useState } from "react"

const SliderImagen = ({ items, data }) => {
    const [currentSlide, setCurrentSlide] = useState(0)



    const nextSlide = ({ data }) => {
        setCurrentSlide((prev) => (prev + 1) % items.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + items.length) % items.length)
    }

    return (
        <div>
            <h2 className="text-5xl text-center font-bold  font-font-primary py-8 bg-[#F7F9FB]">{data?.title}</h2>
            <div className="bg-primary py-8">
                <div className=" mx-auto px-primary">

                    <div className="relative flex items-center">
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 z-10 p-2 bg-white rounded-lg shadow-lg"
                            aria-label="Previous brand"
                        >
                            <svg className="h-4 w-4 customtext-neutral-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="overflow-hidden w-full">
                            <div
                                className="flex justify-center items-center w-full transition-transform duration-300 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {items.map((brand, index) => (
                                    <div key={index} className="flex-shrink-0 sm:w-1/3 lg:w-1/5  flex justify-center items-center">
                                        <img
                                            src={`/api/brands/media/${brand.image}`}
                                            alt={brand.name}
                                            className="h-9 w-full object-contain grayscale brightness-0 invert"

                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={nextSlide}
                            className="absolute right-0 z-10 p-2 bg-white rounded-lg shadow-lg "
                            aria-label="Next brand"
                        >
                            <svg className="h-4 w-4 customtext-neutral-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SliderImagen;