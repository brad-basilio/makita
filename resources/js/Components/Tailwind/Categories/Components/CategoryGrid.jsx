export default function CategoryGrid({
    categories
}) {

    const chunkSize = 4;
    const chunks = [];
    for (let i = 0; i < categories.length; i += chunkSize) {
      chunks.push(categories.slice(i, i + chunkSize));
    }
  
    // Processed categories tracker
    const processedCategories = new Set();

    return (
        <div className="">
            {/* Process full chunks (4 items each) */}
            {chunks.map((chunk, chunkIndex) => {
                if (chunk.length === 4) {
                chunk.forEach(cat => processedCategories.add(cat.id));
                
                return (
                    <div key={`chunk-${chunkIndex}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-7 2xl:gap-10 pt-10">
                    {chunk.map((category, index) => {
                        if (index === 0) {
                        // First item - spans 2 rows and 2 cols
                        return (
                            <div key={category.id} className="w-full lg:row-span-2 lg:col-span-2">
                                <a href={`/catalogo?category=${category.slug}`}>
                                    <section className="group font-font-general text-white w-full h-[250px] sm:h-full">
                                        <div className="flex gap-4 h-full">
                                            <div
                                                className="relative w-full h-full overflow-hidden rounded-2xl"
                                            >
                                                <img
                                                    src={`/storage/images/category/${category?.image}`}
                                                    onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                    alt={category?.name}
                                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div
                                                    className="absolute top-0 w-full h-full"
                                                    style={{
                                                        background:
                                                            "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                                                    }}
                                                ></div>
                                                <div className={`absolute p-4 lg:p-8 bottom-0 mt-4 space-y-1 lg:space-y-2`}>
                                                    <h3 className="text-2xl md:text-3xl 2xl:text-4xl font-semibold">
                                                        {category?.name}
                                                    </h3>
                                                    <p className="text-sm sm:text-base lg:text-lg 2xl:text-xl line-clamp-3">
                                                        {category?.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </a>
                            </div>
                        );
                        } else if (index === 1) {
                        // Second item - spans 2 cols
                        return (
                            <div key={category.id} className="w-full lg:col-span-2">
                                <a href={`/catalogo?category=${category.slug}`}>
                                    <section className="group font-font-general text-white w-full h-[250px] sm:h-full 2xl:max-h-[300px]">
                                        <div className="flex gap-4 h-full">
                                            <div
                                                className="relative w-full h-full overflow-hidden rounded-2xl"
                                            >
                                                <img
                                                    src={`/storage/images/category/${category?.image}`}
                                                    onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                    alt={category?.name}
                                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div
                                                    className="absolute top-0 w-full h-full"
                                                    style={{
                                                        background:
                                                            "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                                                    }}
                                                ></div>
                                                <div className={`absolute p-4 lg:p-8 bottom-0 mt-4 space-y-1 lg:space-y-2`}>
                                                    <h3 className="text-2xl md:text-3xl 2xl:text-4xl font-semibold">
                                                        {category?.name}
                                                    </h3>
                                                    <p className="text-sm sm:text-base lg:text-lg 2xl:text-xl line-clamp-3">
                                                        {category?.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </a>
                            </div>
                        );
                        } else {
                        // Regular items
                        return (
                            <div key={category.id} className="w-full">
                                <a href={`/catalogo?category=${category.slug}`}>
                                    <section className="group font-font-general text-white w-full h-[250px] lg:min-h-[400px] 2xl:max-h-[300px] sm:h-full">
                                        <div className="flex gap-4 h-full">
                                            <div
                                                className="relative w-full h-full overflow-hidden rounded-2xl"
                                            >
                                                <img
                                                    src={`/storage/images/category/${category?.image}`}
                                                    onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                    alt={category?.name}
                                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div
                                                    className="absolute top-0 w-full h-full"
                                                    style={{
                                                        background:
                                                            "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                                                    }}
                                                ></div>
                                                <div className={`absolute p-4 bottom-0 mt-4 space-y-1 lg:space-y-2`}>
                                                    <h3 className="text-2xl md:text-3xl 2xl:text-4xl font-semibold">
                                                        {category?.name}
                                                    </h3>
                                                    <p className="text-sm sm:text-base lg:text-lg 2xl:text-xl line-clamp-3">
                                                        {category?.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </a>
                            </div>
                        );
                        }
                    })}
                    </div>
                );
                }
                return null;
            })}

            {/* Handle remainder categories */}
            {(() => {
                const remainder = categories.length % 4;
                const remainderCategories = categories.filter(cat => !processedCategories.has(cat.id));

                if (remainder > 0) {
                if (remainder === 1) {
                    return (
                        <div className="grid grid-cols-1 mt-5 xl:mt-7 2xl:mt-10">
                            {remainderCategories.map(category => (
                                <div key={category.id} className="w-full">
                                    <a href={`/catalogo?category=${category.slug}`}>
                                        <section className="group font-font-general text-white w-full h-[250px] sm:h-[425px] 2xl:h-[500px]">
                                            <div className="flex gap-4 h-full">
                                                <div
                                                    className="relative w-full h-full overflow-hidden rounded-2xl"
                                                >
                                                    <img
                                                        src={`/storage/images/category/${category?.image}`}
                                                        onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                        alt={category?.name}
                                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div
                                                        className="absolute top-0 w-full h-full"
                                                        style={{
                                                            background:
                                                                "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                                                        }}
                                                    ></div>
                                                    <div className={`absolute p-4 lg:p-8 bottom-0 mt-4 space-y-1 lg:space-y-2`}>
                                                        <h3 className="text-2xl md:text-3xl 2xl:text-4xl font-semibold">
                                                            {category?.name}
                                                        </h3>
                                                        <p className="text-sm sm:text-base lg:text-lg 2xl:text-xl line-clamp-3">
                                                            {category?.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </a>
                                </div>
                            ))}
                        </div>
                    );
                } else if (remainder === 2) {
                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xl:gap-7 2xl:gap-10 mt-5 xl:mt-7 2xl:mt-10">
                            {remainderCategories.map(category => (
                                <div key={category.id} className="w-full">
                                    <a href={`/catalogo?category=${category.slug}`}>
                                        <section className="group font-font-general text-white w-full h-[250px] sm:h-[400px] 2xl:h-[500px]">
                                            <div className="flex gap-4 h-full">
                                                <div
                                                    className="relative w-full h-full overflow-hidden rounded-2xl"
                                                >
                                                    <img
                                                        src={`/storage/images/category/${category?.image}`}
                                                        onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                        alt={category?.name}
                                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div
                                                        className="absolute top-0 w-full h-full"
                                                        style={{
                                                            background:
                                                                "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                                                        }}
                                                    ></div>
                                                    <div className={`absolute p-4 lg:p-8 bottom-0 mt-4 space-y-1 lg:space-y-2`}>
                                                        <h3 className="text-2xl md:text-3xl 2xl:text-4xl font-semibold">
                                                            {category?.name}
                                                        </h3>
                                                        <p className="text-sm sm:text-base lg:text-lg 2xl:text-xl line-clamp-3">
                                                            {category?.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </a>
                                </div>
                            ))}
                        </div>
                    );
                } else if (remainder === 3) {
                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xl:gap-7 2xl:gap-10 mt-5 xl:mt-7 2xl:mt-10">
                            {remainderCategories.map((category, index) => (
                                <section key={category.id} className={`group font-font-general text-white w-full h-[250px] ${index === 0 ? 'sm:row-span-2  sm:h-full' : 'sm:h-[400px] 2xl:h-[500px]'}`}>
                                    <a href={`/catalogo?category=${category.slug}`}>
                                        <div className="flex gap-4 h-full">
                                            <div
                                                className="relative w-full h-full overflow-hidden rounded-2xl"
                                            >
                                                <img
                                                    src={`/storage/images/category/${category?.image}`}
                                                    onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                    alt={category?.name}
                                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div
                                                    className="absolute top-0 w-full h-full"
                                                    style={{
                                                        background:
                                                            "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                                                    }}
                                                ></div>
                                                <div className={`absolute p-4 lg:p-8 bottom-0 mt-4 space-y-1 lg:space-y-2`}>
                                                    <h3 className="text-2xl md:text-3xl 2xl:text-4xl font-semibold">
                                                        {category?.name}
                                                    </h3>
                                                    <p className="text-sm sm:text-base lg:text-lg 2xl:text-xl line-clamp-3">
                                                        {category?.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </section>
                            ))}
                        </div>
                    );
                }
                }
                return null;
            })()}
        </div>
    );
}
