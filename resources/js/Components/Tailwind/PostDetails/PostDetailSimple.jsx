
import { Link, Linkedin, Facebook, Twitter, Send } from "lucide-react"

export default function PostDetailSimple() {
    return (
        <article className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-8 md:px-6">
                {/* Metadata */}
                <div className="flex items-center gap-2 text-sm mb-4">
                    <span className="text-sky-500">Categoría</span>
                    <span>•</span>
                    <time>Fecha</time>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
                    Nunc lacinia ultrices quam ut volutpat.
                    <br />
                    Curabitur quis porttitor nulla
                </h1>

                {/* Featured Image */}
                <div className="relative aspect-[2/1] mb-8">
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20186%20(1)-2tsmYTvQsc0XnxdmhRybXKS7acmQJq.png"
                        alt="Featured image"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <p>
                        Nullam nec iaculis libero, vitae commodo magna. Quisque tincidunt dolor et augue tempus, vitae interdum
                        purus interdum. Mauris sagittis risus ac purus mollis efficitur. Sed maximus aliquam lectus, id luctus justo
                        luctus ut. Nunc vestibulum quam erat, a imperdiet nunc sodales elementum.
                    </p>

                    <blockquote>
                        Sed maximus aliquam lectus, id luctus justo luctus ut. Nunc vestibulum quam erat, a imperdiet nunc sodales
                        elementum. Nullam fermentum placerat sem quis laoreet. Proin ullamcorper, nibh sed pharetra volutpat, est
                        tellus iaculis velit, in tempor nunc urna id leo.
                    </blockquote>

                    <h2>Praesent accumsan facilisis nibh sed interdum</h2>

                    <p>
                        Nullam nec iaculis libero, vitae commodo magna. Quisque tincidunt dolor et augue tempus, vitae interdum
                        purus interdum. Mauris sagittis risus ac purus mollis efficitur.
                    </p>
                </div>

                {/* Share buttons */}
                <div className="mt-8 pt-8 border-t">
                    <h3 className="text-lg font-semibold mb-4">Compartir</h3>
                    <div className="flex gap-4">
                        <a href="#" className="text-gray-600 hover:text-sky-500">
                            <Link className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-600 hover:text-sky-500">
                            <Linkedin className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-600 hover:text-sky-500">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-600 hover:text-sky-500">
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-600 hover:text-sky-500">
                            <Send className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </article>
    )
}

