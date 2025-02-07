import { useEffect } from "react";
import General from "../../../Utils/General"
import { useRef } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const TopBarSimple = ({ }) => {
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      adjustTextColor(divRef.current); // Llama a la función
    }
  }, []);
  return <div ref={divRef} className="bg-primary py-3 font-bold px-primary flex justify-center items-center text-sm font-font-secondary">
    <p>{General.get('cintillo')}</p>
  </div>
}

export default TopBarSimple