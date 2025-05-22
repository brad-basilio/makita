import { Link, Linkedin, Facebook, Twitter, Send } from "lucide-react";

export default function PostDetailSimple({ item }) {
    return (
        <article className="min-h-screen bg-white !font-font-general">
            <div className="px-[5%] py-8 flex flex-col justify-center">
                {/* Metadata */}
                <div className="flex items-center gap-2 text-base mb-4 text-[#91502D] font-semibold 2xl:text-lg max-w-xl mx-auto">
                    <span className="">{item?.category?.name}</span>
                    <span>|</span>
                    <time>{item?.created_at}</time>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 max-w-5xl mx-auto text-center 2xl:max-w-6xl">
                    {item?.name}
                </h1>

                {/* Featured Image */}
                <div className="relative mb-8 max-w-4xl 2xl:max-w-5xl h-auto mx-auto">
                    <img
                        src={`/storage/images/post/${item?.image}`}
                        alt="Main Thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) =>
                            (e.target.src = "/api/cover/thumbnail/null")
                        }
                    />
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none customtext-neutral-dark text-base xl:text-lg">
                    {item?.description}
                </div>

                {/* Share buttons */}
                <div className="mt-8 pt-8 border-t">
                    <h3 className="text-lg font-semibold mb-4">Compartir</h3>
                    <div className="flex gap-4">
                        <a
                            href="#"
                            className="text-gray-600 hover:text-sky-500"
                        >
                            <Link className="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-sky-500"
                        >
                            <Linkedin className="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-sky-500"
                        >
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-sky-500"
                        >
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-sky-500"
                        >
                            <Send className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}
