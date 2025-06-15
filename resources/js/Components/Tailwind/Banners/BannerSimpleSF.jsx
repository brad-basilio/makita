import React from "react";

const BannerSimpleSF = ({ data }) => {
    return (
        <section className="px-[5%] xl:px-[8%] bg-white py-12 xl:py-16">
            <div className="flex flex-col md:flex-row justify-start items-center bg-gradient-to-br from-[#FFFFFF] to-[#91502D1A] w-full rounded-3xl relative">
                <div className="flex flex-col gap-5 py-8 px-8 lg:pl-16 xl:pl-20  justify-start items-start w-full max-w-xl 2xl:max-w-3xl text-white text-left">
                    <h1 className="customtext-primary text-opacity-20 font-font-general font-bold text-4xl xl:text-5xl 2xl:text-6xl">
                        {data?.name}
                    </h1>

                    <p className="customtext-primary font-font-general font-normal text-base xl:text-lg 2xl:text-xl">
                        {data?.description}
                    </p>
                    {data?.button_link && data?.button_text && (
                        <div className="flex flex-col">
                            <a href={data?.button_link} className="w-auto bg-[#311609] px-6 py-3 2xl:py-4 2xl:px-8 rounded-3xl text-white font-font-general leading-none text-base 2xl:text-xl">
                                {data?.button_text}
                            </a>
                        </div>
                    )}
                </div>

                <div className="xl:absolute right-0 bottom-0 flex flex-col ml-5 w-full items-end  md:w-6/12 mt-0 md:-mt-16">
                    <img
                        src={`/storage/images/system/${data?.image}`}
                        onError={(e) => (e.target.src = "/assets/img/noimage/no_img.jpg")}
                        className="object-contain min-h-[250px] max-h-[400px] md:object-contain aspect-[4/3] xl:max-h-[350px] md:max-h-none w-full object-bottom"
                    />
                </div>
            </div>
        </section>
    );
};

export default BannerSimpleSF;
