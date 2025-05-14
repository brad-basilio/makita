import General from "../../../Utils/General";

const WhatsApp = () => {
    const phoneWhatsApp = General.phone_whatsapp;
    const messageWhatsApp = General.message_whatsapp;

    return <div className="flex justify-end w-full mx-auto z-[100] relative">
        <div className="fixed bottom-[5%] right-[5%] z-20 cursor-pointer">
            <a
                target="_blank"
                id="whatsapp-toggle"
                href={`https://api.whatsapp.com/send?phone=${phoneWhatsApp}&text=${messageWhatsApp}`}
            >
                <img
                    src="/assets/img/whatsapp.svg"
                    alt="whatsapp"
                    className="w-16 h-16 animate-bounce duration-300"
                />
            </a>
        </div>
    </div>
}

export default WhatsApp