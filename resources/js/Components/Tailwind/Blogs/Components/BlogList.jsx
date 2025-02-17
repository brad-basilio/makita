import { useEffect } from "react";
import BlogPostCard from "./BlogPostCard";

export default function BlogList({ posts, postsLatest, loading, isFilter }) {
    console.log("isFilter:", isFilter);
    console.log("posts:", posts);
    useEffect(() => {
        console.log("BlogList - posts cambiaron:", posts);
    }, [posts]);
    return (
        <section className={` ${isFilter ? "pb-16" : "py-16"}`}>
            <div className="px-primary mx-auto">
                {!isFilter ? (
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Últimas publicaciones</h2>
                        <p className="text-gray-600 mb-8">
                            Nam tempor diam quis urna maximus, ac laoreet arcu convallis. Aenean dignissim nec sem quis consequat.
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.isArray(postsLatest) && postsLatest.length > 0 ? (
                                postsLatest.map((post, index) => (
                                    <BlogPostCard key={index} post={post} />
                                ))
                            ) : (
                                <p>No hay publicaciones recientes.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <p>Cargando...</p>
                        ) : (
                            Array.isArray(posts) && posts.length > 0 ? (
                                posts.map((post, index) => (
                                    <BlogPostCard key={index} post={post} />
                                ))
                            ) : (
                                <p>No hay Posts que coincidan con los filtros seleccionados.</p>
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
