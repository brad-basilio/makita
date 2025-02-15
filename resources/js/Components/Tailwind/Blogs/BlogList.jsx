import BlogPostCard from "./Components/BlogPostCard"


export default function BlogList({ posts }) {

    return (
        <section className="px-4 py-16 md:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Últimas publicaciones</h2>
                <p className="text-gray-600 mb-8">
                    Nam tempor diam quis urna maximus, ac laoreet arcu convallis. Aenean dignissim nec sem quis consequat.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <BlogPostCard key={index} post={post} />
                    ))}
                </div>
            </div>
        </section>

    )
}

