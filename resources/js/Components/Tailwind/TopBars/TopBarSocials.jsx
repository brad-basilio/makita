import { useEffect, useRef, useState } from "react";
import General from "../../../Utils/General"
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import Tippy from "@tippyjs/react";
import Global from "../../../Utils/Global";


const TopBarSocials = ({ items, data }) => {
  const sectionRef = useRef(null);
  const [show, setShow] = useState(true);
  const lastScroll = useRef(0);

  useEffect(() => {
    if (sectionRef.current) {
      adjustTextColor(sectionRef.current); // Llama a la función
    }
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll.current && current > 60) {
        setShow(false); // Oculta al bajar
      } else {
        setShow(true); // Muestra al subir
      }
      lastScroll.current = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${data?.background_color ? data?.background_color : "bg-primary"} text-white font-paragraph font-medium transition-all duration-300 w-full z-50`}
    >
      <div className="px-primary  mx-auto py-3 flex flex-wrap justify-center md:justify-between items-center gap-2 2xl:max-w-7xl 2xl:px-0">
       
      
        <div className="flex items-center gap-2">
          Sigue a {Global.APP_NAME}
          {
            items && items.length > 0 ? items.filter(item => item.description !== "WhatsApp").map((social, index) => (
              <Tippy
                key={index}
                content={`Ver ${social.name || social.description || 'Red social'}`}>
                <a
                  className={`text-xl w-8 h-8 flex items-center justify-center text-white rounded-full p-2 ${data?.color ? data?.color : "customtext-primary"} hover:scale-110 transition-transform duration-200 cursor-pointer`}
                  href={social.url || social.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!social.url && !social.link) {
                      e.preventDefault();
                      //console.warn('URL no configurada para:', social);
                    }
                  }}
                >
                  <i className={social.icon || 'fab fa-globe'} />
                </a>
              </Tippy>
            )) : (
              <span className="text-sm opacity-75">No hay redes sociales configuradas</span>
            )
          }
        </div>
        <div className="hidden gap-2 lg:gap-4 lg:flex">
       
                                <a
                                    href="/distribuidores-y-red-de-servicios"
                                    className="hover:text-[#27b6cc] transition-colors"
                                >
                                    Distribuidores
                                </a>
                           |
                          
                                <a
                                    href="/distribuidores-y-red-de-servicios"
                                    className="hover:text-[#27b6cc] transition-colors"
                                >
                                    Servicios Técnicos
                                </a>
                           
                          
                                <a
                                    href="/nosotros"
                                    className="hover:text-[#27b6cc] transition-colors"
                                >
                                    Nosotros
                                </a>
                            
        </div>
      </div>
    </section>
  );
}

export default TopBarSocials;