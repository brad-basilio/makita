import { Search } from "lucide-react";
import BlogPostCard from "./BlogPostCard";

import DateFilter from "./DateFilter";
import { useEffect, useState } from "react";
import PostsRest from "../../../../Actions/PostsRest";
import SelectForm from "./SelectForm";

const postsRest = new PostsRest();

export default function BlogHeader({
    posts,
    setPosts,
    headerPosts,
    filteredData,
    loading,
    setLoading,
    isFilter,
    setIsFilter,
}) {
    const { categories } = filteredData;
    const [selectedFilters, setSelectedFilters] = useState({
        category_id: "",
        post_date: "",
        name: "",
    });
    const [initialLoad, setInitialLoad] = useState(true);

    const transformFilters = (filters) => {
        const transformedFilters = [];

        // Categorías
        if (filters.category_id) {
            transformedFilters.push(["category_id", "=", filters.category_id]);
        }
        // Fecha
        if (filters.post_date) {

            console.log("Fecha seleccionada:", filters.post_date);
            transformedFilters.push(["post_date", "=", filters.post_date]);
        }

        // Búsqueda (asumiendo que se filtra por título o contenido)
        if (filters.name) {
            console.log("Nombre seleccionado:", filters.name);
            transformedFilters.push(["name", "contains", filters.name]);
        }

        return transformedFilters;
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const filters = transformFilters(selectedFilters);

            // Verificar si hay filtros activos
            const hasFilters =
                selectedFilters.category_id ||
                selectedFilters.post_date ||
                selectedFilters.name;

            const params = {
                with: "category",
                filter: filters,

            };

            console.log(params);
            const response = await postsRest.paginate(params);
            console.log(response);

            setPosts(response.data);

            // Actualizar isFilter solo si hay filtros activos
            hasFilters ? setIsFilter(true) : setIsFilter(false);

        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialLoad) {
            fetchPosts();
        } else {
            setInitialLoad(false); // Marcar que ya se realizó la carga inicial
        }
    }, [selectedFilters]);

    const handleFilterChange = (type, value) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [type]: value,
        }));
    };
    useEffect(() => {
        console.log("BlogHeader - posts actualizados:", posts);
    }, [posts]);
    return (
        <main className="bg-white">
            {/* Hero Section */}
            <section className={`px-primary mx-auto ${isFilter ? "pt-8" : "py-8"}`}>
                <div className="space-y-4">
                    <span className="text-sky-500 font-medium">Blog</span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                        Descubre lo mejor:
                        <br />
                        Publicaciones sobre el mundo digital
                    </h1>
                    <p className="text-gray-600 max-w-2xl">
                        Nuestros juguetes están diseñados para inspirar, educar y divertir, desarrollando habilidades esenciales desde temprana edad.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mt-8 flex gap-4 justify-between">
                    <div className="relative w-6/12 flex items-center">
                        <input
                            type="search"
                            placeholder="Buscar publicación"
                            className={`w-full px-4 relative py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300`}

                            onChange={(e) => handleFilterChange("name", e.target.value)}
                        />
                        <div className="absolute right-3 p-2 rounded-xl bg-primary">
                            <Search className=" h-5 w-5 text-white" />
                        </div>

                    </div>
                    <div className="flex gap-4 w-5/12">

                        <SelectForm

                            options={categories}
                            placeholder="Todas las categorías"
                            onChange={(value) => {
                                setSelectedFilters((prev) => ({
                                    ...prev,
                                    category_id: value,
                                }));
                            }}
                            labelKey="name"
                            valueKey="id"

                        />
                        <input type="date"
                            className={`w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300`}

                            onChange={(e) => {

                                handleFilterChange("post_date", e.target.value)
                            }} />
                    </div>
                </div>

                {/* Featured Posts */}
                {!isFilter && (
                    <div className="mt-12 flex gap-8">
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
                )}
            </section>
        </main>
    );
}