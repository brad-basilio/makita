import CategoryCardWithBanner from "./Components/CategoryCardWithBanner";

const CategoryPrettyGrid = ({ data, items }) => {
    return (
        <div className="px-primary mx-auto p-[5%]">
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

            <div className="mt-12 flex flex-col md:flex-row gap-[2.5%]">

                <div className="w-full md:w-1/2">
                    <CategoryCardWithBanner
                        borderRadius={data?.borderRadius}
                        aspectRatio={616 / 500}
                        category={items[0]}
                        mainContainer
                    />
                </div>
                <div className="flex flex-col justify-between gap-[5%] w-full md:w-1/2">
                    {items.slice(1, 3).map((category, index) => (
                        <CategoryCardWithBanner
                            borderRadius={data?.borderRadius}
                            aspectRatio={44 / 17}
                            key={category.id}
                            index={index}
                            buttonBackground={index == 0 ? 'bg-white' : ''}
                            buttonColor={index == 0 ? 'customtext-primary' : ''}
                            color={index == 1 ? 'customtext-primary' : ''}
                            category={category}
                        />
                    ))}
                </div>
            </div>
        </div>

    );
}

export default CategoryPrettyGrid;