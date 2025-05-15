import React from 'react';
import CategoryGrid  from "./Components/CategoryGrid";

const CategoryGridInfinite = ({ data, items }) => {

    return (
        <div>
            {items && items.length > 0 && (
                <div className="px-primary mx-auto pt-10 lg:pt-16">
                    {/* Header */}
                    {data?.title && (
                        <div className="flex flex-wrap gap-4 justify-between items-center ">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-semibold tracking-normal customtext-neutral-dark max-w-2xl 2xl:max-w-6xl">
                                {data?.title}
                            </h2>
                            <a
                                href={data?.link_catalog}
                                className="bg-primary transition-all duration-300 text-white border-none items-center px-10 py-2.5 text-base rounded-full font-semibold cursor-pointer hover:opacity-90"
                            >
                                Ver todos
                            </a>
                        </div>
                    )}

                    <div className="mt-12" id="sectioncategory">
                        <CategoryGrid categories={items} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryGridInfinite;