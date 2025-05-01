export default function BlogPostCard({ flex = false, post, featured = false }) {
    return (
        <article className={`group relative ${featured ? "h-full" : ""}`}>
            <a href={`/post/${post?.slug}`} className={`block ${flex && "flex gap-4 "}`}>
                <div
                    className={`relative aspect-video overflow-hidden rounded-lg ${
                        flex && "aspect-square  w-1/2"
                    } `}
                >
                    <img
                        src={`/storage/images/post/${post?.image}`}
                        alt={post?.name}
                        fill
                        className={`object-cover transition-transform duration-300 group-hover:scale-105 h-full w-full`}
                    />
                </div>
                <div className={`mt-4 space-y-1 ${flex && "w-1/2 mt-0 gap-2"}`}>
                    <span className="customtext-neutral-dark opacity-90 font-semibold text-base 2xl:text-lg">
                        {post?.category.name}
                    </span>
                    <h3 className="text-xl 2xl:text-2xl font-semibold customtext-neutral-dark group-hover:customtext-primary">
                        {post?.name}
                    </h3>
                    <p className="line-clamp-3 customtext-neutral-dark opacity-85 text-base 2xl:text-xl">
                        {post?.summary}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <time>{post?.post_date}</time>

                        <span>•</span>
                        <span>Leído hace 5 minutos</span>
                    </div>
                </div>
            </a>
        </article>
    );
}
