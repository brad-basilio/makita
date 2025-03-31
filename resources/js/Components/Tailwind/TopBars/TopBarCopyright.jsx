import { useEffect } from "react";
import General from "../../../Utils/General"
import { useRef } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const TopBarSimple = ({ }) => {
  const copyright = General.get('copyright') ?? ''
  const content = copyright.replace(/\{\{([^}]+)\}\}/g, (match, code) => {
    try {
      return eval(code);
    } catch (error) {
      console.error('Error evaluating code:', error);
      return match;
    }
  });

  return <div className="bg-white text-xs font-bold py-3  px-primary flex justify-center items-center font-font-general">
    <p>{content}</p>
  </div>
}

export default TopBarSimple