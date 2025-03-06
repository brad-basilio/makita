

export default function CategoryCard({ flex = false, category, featured = false }) {


    return (
        <section className={`group font-font-general text-white  w-full ${featured ? " h-[500px]" : "h-[238px]"}`}>
            <a href="#" className={` ${flex && 'flex gap-4 h-full'}`} >
                <div className={`relative  w-full h-full overflow-hidden rounded-3xl ${flex && '   h-full'} `}>
                    <img
                        src={`/api/categories/media/${category?.image}`}
                        //  src={`${category?.image}`}
                        alt={category?.name}
                        fill
                        className={`object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 ${flex && 'w-full h-full '} `}
                    />
                    <div className="absolute top-0 w-full h-full
                    " style={{ background: "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)" }}>

                    </div>
                    <div className={`absolute p-8 bottom-0 mt-4 space-y-2`} >

                        <h3 className="text-4xl font-semibold ">{category?.name}</h3>
                        <p className="line-clamp-1 text-lg ">{category?.description}</p>

                    </div>
                </div>

            </a>
        </section>
    )
}

