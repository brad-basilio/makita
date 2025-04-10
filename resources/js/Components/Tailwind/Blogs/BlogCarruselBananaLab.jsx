import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

const BlogCarruselBananaLab = ({ data, items }) => {
    return (
        <>
            <div className=" w-full mx-auto px-[5%] font-paragraph customtext-neutral-dark mb-8 2xl:px-0 2xl:max-w-7xl">
                <div className="flex justify-between items-center mb-6">
                <h2 className="text-[32px] leading-9 font-semibold   mb-2 md:mb-0">{data?.title}</h2>
                    <a href={data?.link_blog} className="font-bold">
                        {data?.button_text}{" "}
                        <i className="mdi mdi-chevron-right"></i>
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16">
                    <div className="col-span-1 bg-sections-color md:col-span-2 lg:col-span-3  rounded-2xl p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {items.map((item, index) => {
                            const content = document.createElement("div");
                            content.innerHTML = item?.description;
                            const text =
                                content.textContent || content.innerText || "";

                            return (
                                <div className="bg-white rounded-lg overflow-hidden shadow-sm h-auto">
                                    <img
                                        src={`/storage/images/post/${item?.image}`}
                                        alt={item?.title}
                                        className="inset-0 h-[180px] w-full object-cover aspect-[4/3]"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-2xl font-semibold mt-1  mb-2 leading-tight">
                                            {item?.name}
                                        </h3>
                                        <p className="text-base  line-clamp-2">
                                            {text}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="col-span-1 md:col-span-1 lg:col-span-1 rounded-2xl mt-2">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm h-full">
                            <img
                                src={`/assets/img/backgrounds/resources/anuncio-mobile-footer.png`}
                                alt=""
                                className="h-full  object-cover "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default BlogCarruselBananaLab;
