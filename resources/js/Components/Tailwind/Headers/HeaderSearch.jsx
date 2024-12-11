import React from "react"

const HeaderSimple = () => {
  return <section className="bg-white shadow-lg z-20">
    <header className="max-w-6xl mx-auto flex p-4 justify-between items-center">
      <img className="h-10 w-auto" src="/assets/img/logo.svg" alt="" />
      <button className="h-10 border rounded-xl w-1/3 text-start px-4 cursor-text hidden md:block">
        <i className="mdi mdi-magnify"></i> Buscar...
      </button>
      <div className="flex items-center gap-2">
        <button>
          <i className="mdi mdi-magnify text-4xl md:hidden"></i>
        </button>
        <button>
          <i className="mdi mdi-account-outline text-4xl"></i>
        </button>
        <button>
          <i className="mdi mdi-cart-outline text-4xl"></i>
        </button>
      </div>
    </header>
    <hr />
    <menu className="flex mx-auto p-4 gap-6 items-center justify-center font-bold">
      <button>Inicio</button>
      <button>Juguetes</button>
      <button>Blog</button>
      <button>Contacto</button>
    </menu>
  </section>
}

export default HeaderSimple