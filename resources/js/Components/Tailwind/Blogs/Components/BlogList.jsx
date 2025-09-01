import BlogPostCard from "./BlogPostCard";
import { Loading } from "../../Components/Resources/Loading";
import { NoResults } from "../../Components/Resources/NoResult";

export default function BlogList({ data, posts, postsLatest, loading, isFilter }) {
  return (
    <section
      className={`font-paragraph ${isFilter ? "pb-16" : "pt-8 pb-16"}`}
    >
      <div className="px-primary   mx-auto 2xl:px-0 2xl:max-w-7xl">
        {!isFilter ? (
          <div>
            <h2 className="text-3xl lg:text-[40px] tracking-wide font-bold mb-8 font-title customtext-neutral-dark">
              {
                data?.second_title ? data?.second_title : 'Últimas publicaciones'
              }
            </h2>
            {
              data?.second_description &&
              <p className="text-gray-600 mb-8">
                Nam tempor diam quis urna maximus, ac laoreet arcu
                convallis. Aenean dignissim nec sem quis consequat.
              </p>
            }
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
              {Array.isArray(postsLatest) &&
                postsLatest.length > 0 ? (
                postsLatest.map((post, index) => (
                  <BlogPostCard data={data} key={index} post={post} />
                ))
              ) : (
                <div className="col-span-3 my-8">
                  <NoResults />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {loading ? (
              <div className="col-span-3 my-8">
                <Loading />
              </div>
            ) : Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post, index) => (
                <BlogPostCard data={data} key={index} post={post} />
              ))
            ) : (
              <div className="col-span-3 my-8">
                <NoResults />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
