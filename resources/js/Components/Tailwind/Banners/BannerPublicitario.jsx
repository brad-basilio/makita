import { Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Global from "../../../Utils/Global";

const BannerPublicitario = ({ data }) => {
    // Nuevo parámetro: "left" o "right" (por defecto "right")
    const imagePosition = data?.image_position === "left" ? "left" : "right";

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="px-primary font-paragraph 2xl:px-0 2xl:max-w-7xl mx-auto py-4 md:py-12"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative rounded-3xl md:rounded-2xl h-[600px] md:h-[500px] p-4 md:p-0 overflow-hidden shadow-xl"
                    style={{
                        backgroundImage: `linear-gradient(90deg,rgba(0,0,0,0.45),rgba(0,0,0,0.15)), url(/storage/images/system/${data?.background})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <div className={`flex flex-col md:flex-row items-center justify-between h-full gap-8 ${imagePosition === "left" ? "md:flex-row-reverse" : ""}`}>
                        {/* Imagen */}
                        <motion.div 
                            className="-mt-10 order-1 md:order-none w-full md:w-7/12 relative z-10 flex items-center justify-center h-full"
                        >
                            <motion.img
                                whileHover={{ 
                                    scale: 1.08,
                                    transition: { duration: 0.4 }
                                }}
                                initial={{ scale: 0.95, rotate: -8 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 1, type: "spring" }}
                                src={`/storage/images/system/${data?.image}`}
                                className="w-full h-[260px] md:h-[420px] object-contain drop-shadow-2xl rounded-2xl bg-black/10"
                                alt={data?.name}
                                style={{
                                    maxHeight: "90%",
                                    maxWidth: "90%",
                                }}
                            />
                        </motion.div>

                        {/* Texto */}
                        <motion.div 
                            initial={{ x: 200, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.7 }}
                            className={`md:order-1 md:w-5/12 text-white z-10 ${imagePosition === "left" ? "lg:pl-16" : ""}`}
                        >
                            <div className="w-full lg:max-w-lg bg-transparent rounded-2xl p-4 md:p-0">
                                <motion.h1 
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1 }}
                                    className="text-[32px] md:text-5xl font-bold mb-4 font-title drop-shadow-lg"
                                >
                                    {data?.name}
                                </motion.h1>
                                <motion.p 
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1.2 }}
                                    className="text-base md:text-lg mb-8 font-paragraph drop-shadow"
                                >
                                    {data?.description}
                                </motion.p>
                                {data?.button_text && (
                                <motion.a
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 1.4 }}
                                    whileHover={{ 
                                        scale: 1.07,
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    href={data?.button_link || Global.APP_DOMAIN}
                                    className="bg-white cursor-pointer text-sm w-max font-bold customtext-neutral-dark px-10 py-4 rounded-xl hover:opacity-90 transition-all duration-300 flex items-center gap-2 shadow-lg"
                                >
                                    {data?.button_text}
                                    <motion.div
                                        animate={{ 
                                            rotate: [0, 90],
                                            scale: [1, 1.2, 1]
                                        }}
                                        transition={{ 
                                            duration: 1,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    >
                                        <Tag width={"1rem"} />
                                    </motion.div>
                                </motion.a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BannerPublicitario;
