import { useEffect } from "react";
import BlogPostCard from "./BlogPostCard";
import { Loading } from "../../Components/Resources/Loading";
import { NoResults } from "../../Components/Resources/NoResult";

export default function BlogList({ posts, postsLatest, loading, isFilter }) {
    console.log("isFilter:", isFilter);
    console.log("posts:", posts);
    useEffect(() => {}, [posts]);
    return (
        <section
            className={`font-font-general ${isFilter ? "pb-16" : "py-16"}`}
        >
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto">
                {!isFilter ? (
                    <div>
                        <h2 className="text-3xl font-bold mb-4">
                            Últimas publicaciones
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Nam tempor diam quis urna maximus, ac laoreet arcu
                            convallis. Aenean dignissim nec sem quis consequat.
                        </p>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.isArray(postsLatest) &&
                            postsLatest.length > 0 ? (
                                postsLatest.map((post, index) => (
                                    <BlogPostCard key={index} post={post} />
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
                                <BlogPostCard key={index} post={post} />
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
