

export default function BlogPostCard({ flex = false, post, featured = false }) {

    return (
        <article className={`group relative ${featured ? "h-full" : ""}`}>
            <a href="#" className={`block ${flex && 'flex gap-4  '}`} >
                <div className={`relative aspect-video overflow-hidden rounded-2xl ${flex ? 'aspect-square  h-[250px] w-[250px]' : 'h-[300px] w-full object-cover'} `}>
                    <img
                        src={`/api/posts/media/${post?.image}`}
                        alt={post?.name}
                        fill
                        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${flex ? 'h-[250px] w-[250px] object-cover' : 'h-[300px] w-full object-cover'} `}
                    />
                </div>
                <div className={`mt-4 space-y-3 ${flex && 'w-1/2 mt-0 flex flex-col justify-between h-full'}`} >
                    <span className="customtext-neutral-light font-bold ">{post?.category.name}</span>
                    <h3 className={`text-2xl font-bold customtext-neutral-dark group-hover:customtext-primary ${flex ? 'line-clamp-2' : 'line-clamp-1'} `}>{post?.name}</h3>
                    <p p className={`customtext-neutral-dark opacity-80 ${flex ? 'line-clamp-2' : 'line-clamp-2'} `}>{post?.summary}</p>
                    <div className="flex items-center font-medium gap-2 text-sm customtext-neutral-light pt-6">
                        <time>{post?.post_date}</time>

                        <span>•</span><span>Leído hace 5 minutos</span>
                    </div>
                </div>
            </a>
        </article>
    )
}

