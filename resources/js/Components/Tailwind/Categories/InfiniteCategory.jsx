import { useState } from "react"

const InfiniteCategory = ({ items, data }) => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const slidesPerView = {
        mobile: 1,
        tablet: 3,
        desktop: 5,
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === items.length - slidesPerView.desktop ? 0 : prev + 1))
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? items.length - slidesPerView.desktop : prev - 1))
    }

    return (
        <section className="py-12">
            <div className=" w-full px-[5%]  mx-auto ">
                <h2 className="text-2xl font-bold mb-8">Categorías destacadas</h2>

                <div className="relative">
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-[#20A4E0] rounded-lg shadow-lg hover:bg-[rgb(22,133,185)]"
                        aria-label="Categoría anterior"
                    >
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{
                                transform: `translateX(-${currentSlide * (100 / slidesPerView.desktop)}%)`,
                            }}
                        >
                            {items.map((category) => (
                                <div key={category.id} className="w-full min-w-[200px] px-2 sm:w-1/3 lg:w-1/5 flex-shrink-0">
                                    <a href={category.link} className="block group">
                                        <div className="bg-sky-50 rounded-lg p-4 transition-transform duration-300 group-hover:scale-105">
                                            <div className="aspect-square relative mb-4">
                                                <img
                                                    src={`/api/categories/media/${category.image}`}
                                                    alt={category.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <h3 className="text-center text-gray-800">{category.name}</h3>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-[#20A4E0] rounded-lg shadow-lg hover:bg-[rgb(22,133,185)]"
                        aria-label="Siguiente categoría"
                    >
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default InfiniteCategory;