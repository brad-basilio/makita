import CategoryCard from "./Components/CategoryCard";

const CategoryFlex = ({ data, items }) => {

    return (
        <div className="px-primary mx-auto pt-10 lg:pt-16">
            {/* Header */}
            {
                data?.title && (
                    <div className="flex flex-wrap gap-4 justify-between items-center ">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-semibold tracking-normal customtext-neutral-dark max-w-2xl 2xl:max-w-6xl">{data?.title}</h2>
                        <a
                            href={data?.link_catalog}
                            className="bg-primary transition-all duration-300 text-white border-none items-center   px-10  py-2.5 text-base rounded-full font-semibold cursor-pointer hover:opacity-90"
                        >
                            Ver todos
                        </a>
                    </div>
                )
            }

            <div className="mt-12 flex flex-col md:flex-row gap-5 md:gap-8" id="sectioncategory">

                <div className="flex flex-col justify-between gap-5 md:gap-8 w-full md:w-1/2">
                    {items.slice(0, 2).map((category) => (
                        <CategoryCard
                            flex
                            key={category.id}
                            category={category}
                        />
                    ))}
                </div>
                <div className="w-full md:w-1/2">
                    <CategoryCard
                        featured
                        category={items[2]}
                    />
                </div>
            </div>
        </div>

    );
}

export default CategoryFlex;