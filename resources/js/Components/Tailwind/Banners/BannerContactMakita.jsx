import React from "react";



const BannerContactMakita = ({ data }) => {
  return (
    <section className="relative w-full bg-primary text-white overflow-visible">
      <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl min-h-[240px]">
        
        {/* Versión Mobile */}
        <div className="flex flex-col items-center justify-center text-center md:hidden py-8">
          {/* Nombre */}
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            {data?.name}
          </h2>
          
          {/* Descripción */}
          <p className="text-base max-w-xl mx-auto opacity-90 mb-6">
            {data?.description}
          </p>
          
          {/* Imagen */}
          <div className="mb-6">
            <img
              src={`/storage/images/system/${data?.image}`}
              alt="Herramienta Makita"
              className="h-[200px] object-contain drop-shadow-2xl"
              onError={(e) => {
                e.target.src = "/api/cover/thumbnail/null";
              }}
            />
          </div>
          
          {/* Botón */}
          <a
            href={data?.button_link}
            className="inline-block bg-white/10 hover:bg-primary hover:brightness-125 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300"
          >
            {data?.button_text}
          </a>
        </div>

        {/* Versión Desktop */}
        <div className="hidden md:flex flex-row items-center justify-between min-h-[240px]">
          {/* Imagen sobrepasando la sección */}
          <div className="flex justify-center items-center lg:w-2/12 h-[100px]">
            <img
              src={`/storage/images/system/${data?.image}`}
              alt="Herramienta Makita"
              className="absolute left-0 translate-x-1/4 translate-y-1/3 bottom-0 h-[350px] object-contain drop-shadow-2xl"
              style={{ zIndex: 2 }}
              onError={(e) => {
                e.target.src = "/api/cover/thumbnail/null";
              }}
            />
          </div>
          
          {/* Datos centrados */}
          <div className="relative flex flex-col items-center justify-center text-center z-10">
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              {data?.name}
            </h2>
            <p className="text-lg max-w-xl mx-auto opacity-90">
              {data?.description}
            </p>
          </div>
          
          {/* Botón */}
          <div>
            <a
              href={data?.button_link}
              className="inline-block bg-white/10 hover:bg-primary hover:brightness-125 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 mt-2"
            >
              {data?.button_text}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};



export default BannerContactMakita;
