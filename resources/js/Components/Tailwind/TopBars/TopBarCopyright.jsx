import General from "../../../Utils/General"

const TopBarCopyright = ({ }) => {
  const copyright = General.get('copyright') ?? ''
  const content = copyright.replace(/\{\{([^}]+)\}\}/g, (match, code) => {
    try {
      return eval(code);
    } catch (error) {
      console.error('Error evaluating code:', error);
      return match;
    }
  });

  return <div className="bg-white text-sm font-bold py-3 customtext-neutral-dark text-center px-primary flex justify-center items-center font-font-general">
    <p>{content}</p>
  </div>
}

export default TopBarCopyright