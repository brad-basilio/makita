import { Search } from "lucide-react"
import BlogPostCard from "./Components/BlogPostCard"
import CategoryFilter from "./Components/CategoryFilter"
import DateFilter from "./Components/DateFilter"


export default function BlogHeader({ headerPosts }) {

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="px-4 py-8 md:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="space-y-4">
                    <span className="text-sky-500 font-medium">Blog</span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                        Descubre lo mejor:
                        <br />
                        Publicaciones sobre el mundo digital
                    </h1>
                    <p className="text-gray-600 max-w-2xl">
                        Nuestros juguetes están diseñados para inspirar, educar y divertir, desarrollando habilidades esenciales
                        desde temprana edad.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mt-8 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <input
                            type="search"
                            placeholder="Buscar publicación"
                            className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex gap-4">
                        <CategoryFilter />
                        <DateFilter />
                    </div>
                </div>

                {/* Featured Posts */}
                <div className="mt-12 flex gap-8 ">
                    <div className="w-1/2">

                        <BlogPostCard
                            featured
                            post={headerPosts[0]}

                        />

                    </div>
                    <div className="space-y-4 flex flex-col w-1/2">
                        {headerPosts.slice(1, 3).map((post) => (
                            <BlogPostCard
                                flex
                                key={post.id}
                                post={post}
                            />

                        ))}
                    </div>
                </div>
            </section>


        </main>
    )
}

