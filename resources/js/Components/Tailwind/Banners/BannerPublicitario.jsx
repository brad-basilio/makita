import { Tag } from "lucide-react";


const BannerPublicitario = ({ data }) => {
    return (
        <div className=" px-primary mx-auto py-32">
            <div className="relative    rounded-xl h-[373px]"
                style={{
                    backgroundImage: `url(https://img.freepik.com/vector-gratis/fondo-semitono-azul-blanco_53876-99003.jpg?t=st=1739020590~exp=1739024190~hmac=4a1f12dd6ecc73ee595dfc04483a00c310a0ab84afab64b4708fa4072aa5e06b&w=740)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="flex flex-col md:flex-row items-center justify-between h-full gap-8 ">
                    {/* Left side - Image */}
                    <div className=" md:w-7/12 relative z-10">
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b720c25c304a5e3ce2eb98e244742be7%20(1)-qqJK7w6BwVFzT8TmMF7NIV4Xw51Ogy.png"
                            alt="Dispositivos tecnológicos"
                            className="w-full h-auto object-cover absolute scale-95 -translate-y-1/2"
                        />
                    </div>

                    {/* Right side - Content */}
                    <div className=" md:w-5/12 text-white z-10 ">
                        <div className="max-w-sm">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-font-primary">Tecnología que impulsa tu vida</h1>
                            <p className="text-base mb-8 font-font-secondary">
                                Descubre las últimas innovaciones en laptops, smartphones y gadgets al mejor precio.
                            </p>
                            <button className="bg-white customtext-neutral-light px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2">
                                Ver todos
                                <Tag width={"1rem"} className="rotate-90" />
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </div>

    )
}
export default BannerPublicitario;