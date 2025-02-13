

export default function BlogPostCard({ image, category, title, description, date, readTime, featured = false }) {
    return (
        <article className={`group relative ${featured ? "h-full" : ""}`}>
            <a href="#" className="block">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                    <img
                        src={image || "/placeholder.svg"}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div className="mt-4 space-y-2">
                    <span className="text-sky-500 font-medium">{category}</span>
                    <h3 className="text-xl font-semibold group-hover:text-sky-600">{title}</h3>
                    <p className="text-gray-600">{description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <time>{date}</time>
                        <span>•</span>
                        <span>Leído hace {readTime}</span>
                    </div>
                </div>
            </a>
        </article>
    )
}

