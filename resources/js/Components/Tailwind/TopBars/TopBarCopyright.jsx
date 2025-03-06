import { useEffect } from "react";
import General from "../../../Utils/General"
import { useRef } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const TopBarSimple = ({ }) => {



  return <div className="bg-white text-xs customtext-primary font-medium py-3  px-primary flex justify-center items-center font-font-general">
    <p>Copyright © 2025 Sala Fabulosa. Reservados todos los derechos.</p>
  </div>
}

export default TopBarSimple