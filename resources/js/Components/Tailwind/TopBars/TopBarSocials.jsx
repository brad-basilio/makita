import { useEffect, useRef, useState } from "react";
import General from "../../../Utils/General"
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import Tippy from "@tippyjs/react";


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
      className={`bg-primary text-white font-paragraph font-bold transition-all duration-300 ${show ? "opacity-100 translate-y-0 relative" : "opacity-0 -translate-y-full hidden"} fixed top-0 left-0 w-full z-50`}
    >
      <div className="px-primary replace-max-w-here mx-auto py-3 flex flex-wrap justify-center md:justify-between items-center gap-2 2xl:max-w-7xl 2xl:px-0">
        <p className="hidden md:block">{General.get('cintillo')}</p>
        <p className="hidden md:block text-xs">{data?.title}</p>
        <div className="flex gap-4">
          {
            items.map((social, index) => (
              <Tippy
                key={index}
                content={`Ver ${social.name} en ${social.description}`}>

                <a key={index} className="text-xl w-8 h-8 flex items-center justify-center  bg-white rounded-full p-2 customtext-primary" href={social.url} target="_blank" rel="noopener noreferrer">
                  <i className={social.icon} />
                </a>
              </Tippy>
            ))
          }
        </div>
      </div>
    </section>
  );
}

export default TopBarSocials;