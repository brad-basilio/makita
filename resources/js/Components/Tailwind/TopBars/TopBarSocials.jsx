import { useEffect, useRef } from "react";
import General from "../../../Utils/General"
import { adjustTextColor } from "../../../Functions/adjustTextColor";


const TopBarSocials = ({ items, data }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      adjustTextColor(sectionRef.current); // Llama a la función
    }
  }, []);

  return <section ref={sectionRef} className="bg-primary text-white font-font-secondary font-bold">
    <div className="px-[5%] replace-max-w-here mx-auto py-3 flex flex-wrap justify-center md:justify-between items-center gap-2">
      <p className="hidden md:block">{General.get('cintillo')}</p>
      <p className="hidden md:block text-xs">{data?.title}</p>
      <div className="flex gap-4">
        {
          items.map((social, index) => (
            <a key={index} className="text-xl w-6" href={social.url} target="_blank" rel="noopener noreferrer">
              <i className={social.icon} />
            </a>
          ))
        }
      </div>
    </div>
  </section>
}

export default TopBarSocials