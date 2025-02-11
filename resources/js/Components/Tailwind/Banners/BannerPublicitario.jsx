import { Tag } from "lucide-react";


const BannerPublicitario = ({ data }) => {

    return (
        <div className=" px-primary mx-auto py-32">
            <div className="relative    rounded-xl h-[373px]"
                style={{
                    backgroundImage: `url(/api/banners/media/${data.background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="flex flex-col md:flex-row items-center justify-between h-full gap-8 ">
                    {/* Left side - Image */}
                    <div className=" md:w-7/12 relative z-10">
                        <img
                            src={`/api/banners/media/${data.image}`}
                            className="w-full h-auto object-cover absolute scale-95 -translate-y-1/2"
                        />
                    </div>

                    {/* Right side - Content */}
                    <div className=" md:w-5/12 text-white z-10 ">
                        <div className="max-w-sm">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-font-primary">{data.name}</h1>
                            <p className="text-base mb-8 font-font-secondary">
                                {data.description}
                            </p>
                            <a
                                href={data.button_link}
                                className="bg-white text-sm w-max font-bold customtext-neutral-dark px-6 py-3 rounded-xl  hover:bg-opacity-90 transition-all flex items-center gap-2">
                                {data.button_text}
                                <Tag width={"1rem"} className="rotate-90" />
                            </a>
                        </div>
                    </div>
                </div>


            </div>
        </div>

    )
}
export default BannerPublicitario;