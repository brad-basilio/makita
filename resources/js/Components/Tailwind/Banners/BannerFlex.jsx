import { useEffect, useRef } from 'react';
import { Tag } from "lucide-react";
import { adjustTextColor } from '../../../Functions/adjustTextColor';


const BannerFlex = ({ data }) => {

    const buttonFirstRef = useRef();

    useEffect(() => {
        adjustTextColor(buttonFirstRef.current);
    });

    return (
        <div className=" px-primary mx-auto font-font-general">
            <div className=" flex rounded-3xl gap-8  bg-[#F5F5F5] overflow-hidden">

                <img
                    src={`/storage/images/banner/${data?.image}`}
                    className="w-6/12 h-full object-cover rounded-3xl"
                />

                {/* Right side - Content */}
                <div className=" md:w-5/12 text-white px-2 flex flex-col py-6 space-y-6 h-full" >

                    <h1 className="text-6xl  font-bold   customtext-primary">{data?.name}</h1>
                    <p className="text-xl  customtext-primary">
                        {data?.description}
                    </p>
                    <div className='flex gap-8'>
                        <a
                            href={data?.button_link}
                            ref={buttonFirstRef}
                            className="bg-primary cursor-pointer text-base w-max font-bold  px-10 py-4 rounded-full  hover:opacity-90 transition-all duration-300 flex items-center gap-2">
                            {data?.button_text}

                        </a>
                        <a
                            href={data?.button_link}
                            className="border-primary customtext-primary border cursor-pointer text-base w-max font-bold  px-10 py-4 rounded-full  hover:opacity-90 transition-all duration-300 flex items-center gap-2">
                            {data?.button_text}

                        </a>
                    </div>
                    <h3 className="text-xl  font-bold pt-6  customtext-primary">{data?.name}</h3>
                </div>
            </div>

        </div>

    )
}
export default BannerFlex;