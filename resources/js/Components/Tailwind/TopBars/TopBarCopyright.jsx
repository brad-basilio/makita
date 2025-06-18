import General from "../../../Utils/General"

const TopBarCopyright = ({ data, generals = [] }) => {
    console.log(generals);
  const copyright = generals?.find(
    (item) => item.correlative === "copyright"
  );

  return (
    <div className={`${data?.background_color ? `${data.background_color}` : 'bg-white'} ${data?.color ? `${data.color}` : 'customtext-neutral-dark'} text-sm font-bold py-3 customtext-neutral-dark text-center px-primary flex justify-center items-center font-paragraph`}>
      <p>{copyright?.description || "© 2025 Todos los derechos reservados"}</p>
    </div>
  );
}

export default TopBarCopyright;