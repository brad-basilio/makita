import React from 'react';

const formatDateLongEs = (value) => {
  if (!value) return "";
  // Accept ISO date strings like 2025-08-28 or full datetime
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(d);
}

export default function BlogPostCard({ data, flex = false, post, featured = false }) {

  return (
    
    <article className={`group relative lg:p-4 font-title ${featured ? "h-full" : ""}`}>
      <a href={`/post/${post?.slug}`} className={`block ${flex ? "md:flex md:gap-4" : ""}`}>
        <div
          className={`relative bg-[#E7E7E7] aspect-[4/3] overflow-hidden rounded-lg ${flex ? "w-full md:w-2/5" : "w-full aspect-square"}`}
        >
          <img
            src={`/storage/images/post/${post?.image}`}
            alt={post?.name}
            fill
            className={`object-cover h-full transition-transform duration-300 group-hover:scale-105 w-full`}
          />
        </div>
  <div className={`flex flex-col justify-center py-2 space-y-1 ${flex ? "w-full md:w-3/5 mt-0 gap-1" : ""}`}>
          <span className="customtext-primary opacity-90 text-base 2xl:text-base line-clamp-1 ">
            {post?.post_category?.name ?? post?.category?.name}
          </span>
          <h3 className="text-base md:text-lg xl:text-2xl line-clamp-3 lg:line-clamp-2 2xl:text-2xl font-semibold customtext-neutral-dark group-hover:customtext-primary leading-tight">
            {post?.name}
          </h3>
          <p className="line-clamp-2  customtext-neutral-dark opacity-85 text-sm md:text-md font-title 2xl:text-base !leading-snug">
            {post?.summary}
          </p>
          <div className="flex items-center gap-2 text-sm text-[#219FB9]">
            <time>{formatDateLongEs(post?.post_date)}</time>
            {
              data?.['bool:show_seen'] && <>
                <i className="mdi mdi-circle-medium"></i>
                <span>Leído hace 5 minutos</span>
              </>
            }
          </div>
        </div>
      </a>
    </article>
  );
}
