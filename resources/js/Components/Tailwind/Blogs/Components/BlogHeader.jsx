import { Search } from "lucide-react";
import BlogPostCard from "./BlogPostCard";

import DateFilter from "./DateFilter";
import { useEffect, useState } from "react";
import PostsRest from "../../../../Actions/PostsRest";
import SelectForm from "./SelectForm";
import Global from "../../../../Utils/Global";

const postsRest = new PostsRest();

export default function BlogHeader({
  data,
  posts,
  setPosts,
  headerPosts,
  postsLatest,
  filteredData,
  loading,
  setLoading,
  isFilter,
  setIsFilter,
}) {
  const [categories, setCategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    category_id: "",
    post_date: "",
    name: "",
  });
  console.log("BLOG LAST POSTS", postsLatest);
  const [initialLoad, setInitialLoad] = useState(true);

  const transformFilters = (filters) => {
    const transformedFilters = [];

    // Categorías
    if (filters.category_id) {
      transformedFilters.push(["post_category_id", "=", filters.category_id]);
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
        // backend PostController expects relation named 'postCategory'
        with: "postCategory",
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

  // Derive categories from available posts (headerPosts, postsLatest, posts)
  useEffect(() => {
    const derive = () => {
      const allPosts = [];
      if (Array.isArray(headerPosts)) allPosts.push(...headerPosts);
      if (Array.isArray(postsLatest)) allPosts.push(...postsLatest);
      if (Array.isArray(posts)) allPosts.push(...posts);

      const map = new Map();

      allPosts.forEach((p) => {
        // support multiple possible relation keys
        const single = p?.postCategory || p?.post_category || p?.category;
        if (single && single.id) {
          if (!map.has(single.id)) map.set(single.id, { id: single.id, name: single.name });
        }
        const multiple = p?.categories || p?.post_categories;
        if (Array.isArray(multiple)) {
          multiple.forEach((c) => {
            if (c && c.id && !map.has(c.id)) map.set(c.id, { id: c.id, name: c.name });
          });
        }
      });

      const derived = Array.from(map.values());
      // fallback to filteredData categories if nothing derived
      if (derived.length === 0 && filteredData && Array.isArray(filteredData.categories)) {
        setCategories(filteredData.categories);
      } else {
        setCategories(derived);
      }
    };

    derive();
  }, [headerPosts, postsLatest, posts, filteredData]);

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
    <main className="bg-white font-title">
      {/* Hero Section */}
      <section
        className={`px-primary 2xl:px-0 2xl:max-w-7xl mx-auto ${isFilter ? "pt-8" : "py-8"
          }`}
      >
        <div className="space-y-4">
    
          <h1 className={`font-title text-3xl md:text-5xl 2xl:text-[56px] font-bold tracking-normal ${data?.class_title || 'customtext-neutral-dark'}`}>
            {
              data?.title
                ? <span 
                    dangerouslySetInnerHTML={{ __html: data.title }}
                    className="leading-tight block"
                    style={{ lineHeight: '1.1' }}
                  ></span>
                : <>
                  Descubre lo mejor:
                  <br />
                  Publicaciones sobre el mundo de {Global.APP_NAME}
                </>
            }
          </h1>
          {
            data?.description &&
            <p className="customtext-neutral-dark opacity-80 text-base 2xl:text-xl font-title">
            { data?.description}
            </p>
          }
        </div>

        {/* Search and Filters */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative md:w-6/12 flex items-center">
            <input
              type="search"
              placeholder="Buscar publicación"
              className={`w-full px-4 relative py-3 border customtext-neutral-dark  border-neutral-ligth rounded-md text-lg focus:ring-0 focus:outline-0   transition-all duration-300`}
              onChange={(e) =>
                handleFilterChange("name", e.target.value)
              }
            />
            <div className="absolute right-3 p-2 rounded-md bg-neutral-dark">
              <Search className=" h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex w-full gap-2 md:gap-4 md:w-5/12">
            <div className="w-1/2 md:w-full">
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
                className={`w-full px-4 py-3 text-lg  border-neutral-ligth !rounded-md focus:ring-0 focus:outline-0   transition-all duration-300`}
              />
            </div>
            <input
              type="date"
              className={`w-1/2 md:w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth text-lg !rounded-md focus:ring-0 focus:outline-0   transition-all duration-300`}
              onChange={(e) => {
                handleFilterChange("post_date", e.target.value);
              }}
            />
          </div>
        </div>

        {/* Featured Posts */}
        {!isFilter && (
          <div className="mt-8 flex gap-8 py-[2.5%] rounded-2xl">
            <div className="w-full md:w-1/2">
              <BlogPostCard data={data} featured post={headerPosts[0]} />
            </div>
            <div className="hidden md:flex space-y-4  flex-col w-1/2">
              {headerPosts.slice(1, 3).map((post) => (
                <BlogPostCard data={data} flex key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
