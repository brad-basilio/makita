import { useState } from "react";
import General from "../../../Utils/General"
import ReactModal from "react-modal";
import { X } from "lucide-react";
import HtmlContent from "../../../Utils/HtmlContent";

const TopBarCopyright = ({ data, generals = [] }) => {
  console.log(generals);
  const [modalOpen, setModalOpen] = useState(null);
  const openModal = (index) => setModalOpen(index);
  const closeModal = () => setModalOpen(null);

  const policyItems = {
    privacy_policy: "Políticas de privacidad",
    terms_conditions: "Términos y condiciones",

    // 'delivery_policy': 'Políticas de envío',
    saleback_policy: "Políticas de devolucion y cambio",
  };
  const copyright = generals?.find(
    (item) => item.correlative === "copyright"
  );

  return (
    <div className={`${data?.background_color ? `${data.background_color}` : 'bg-white mx-auto'}`}>
      {data?.policyTerms ? (
        <div className={`${data?.background_color ? `${data.background_color}` : 'bg-white'} ${data?.color ? `${data.color}` : 'customtext-neutral-dark'} text-sm mx-auto font-medium py-3 customtext-neutral-dark text-center px-primary 2xl:px-0  2xl:max-w-7xl flex justify-between items-center font-paragraph`}>
          <p>{copyright?.description || "© 2025 Todos los derechos reservados"}</p>
         <ul className="gap-3 flex text-white">
            <li>
                                <a
                                    type="button"
                                    href="#"
                                    onClick={() => openModal(1)}
                                    className="cursor-pointer hover:customtext-primary underline hover:font-bold transition-all duration-300"
                                >
                                    Términos y Condiciones de uso del sitio web
                                </a>
                            </li>

                            <li>
                                <a
                                    onClick={() => openModal(0)}
                                    className="cursor-pointer hover:customtext-primary underline hover:font-bold transition-all duration-300"
                                >
                                    Políticas de privacidad
                                </a>
                            </li>
                          
                            <li>
                                <a
                                 type="button"
                                    href="#"
                                    onClick={() => openModal(2)}
                                    className="cursor-pointer underline hover:customtext-primary hover:font-bold transition-all duration-300"
                                >
                                    Trabaja con nosotros
                                </a>
                            </li>
                          
                        </ul>
       
        </div>
      ) : (
        <div className={`${data?.background_color ? `${data.background_color}` : 'bg-white'} ${data?.color ? `${data.color}` : 'customtext-neutral-dark'} text-sm font-bold py-3 customtext-neutral-dark text-center px-primary flex justify-center items-center font-paragraph`}>
          <p>{copyright?.description || "© 2025 Todos los derechos reservados"}</p>
        </div>
      )}
      
      
       {Object.keys(policyItems).map((key, index) => {
                const title = policyItems[key];
                const content =
                    generals.find((x) => x.correlative == key)?.description ??
                    "";
                return (
                    <ReactModal
                        key={index}
                        isOpen={modalOpen === index}
                        onRequestClose={closeModal}
                        contentLabel={title}
                        className="absolute left-1/2 -translate-x-1/2 bg-white p-6 rounded-xl shadow-lg w-[95%] max-w-4xl my-8"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                    >
                        <button
                            onClick={closeModal}
                            className="float-right text-red-500 hover:text-red-700 transition-all duration-300 "
                        >
                            <X width="2rem" strokeWidth="4px" />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">{title}</h2>
                        <HtmlContent className="prose" html={content} />
                    </ReactModal>
                );
            })}
      
      </div>
  );
}

export default TopBarCopyright;