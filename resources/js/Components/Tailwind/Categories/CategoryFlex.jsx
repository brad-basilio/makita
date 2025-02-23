import CategoryCard from "./Components/CategoryCard";

const CategoryFlex = ({ data, items }) => {

    return (
        <div className="px-primary mx-auto">
            {/* Header */}
            {
                data?.title && (
                    <div className="flex justify-between items-center mb-8 pb-4 ">
                        <h2 className="text-5xl font-semibold max-w-2xl  ">{data?.title}</h2>
                        <a

                            href={data?.link_catalog}
                            className="bg-primary transition-all duration-300 text-white border-none items-center   px-10  py-3 text-base rounded-full font-semibold cursor-pointer hover:opacity-90"
                        >
                            Ver todos

                        </a>
                    </div>
                )
            }

            <div className="mt-12 flex gap-8">

                <div className=" flex flex-col justify-between w-1/2">
                    {items.slice(0, 2).map((category) => (
                        <CategoryCard
                            flex
                            key={category.id}
                            category={category}
                        />
                    ))}
                </div>
                <div className="w-1/2">
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