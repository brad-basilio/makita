import { Fetch, Notify } from "sode-extend-react";

class ScrapRest {
    static getProducts = async (request) => {
        console.log(request);
        try {
            const { status, result } = await Fetch("./api/scrap-nike", {
                method: "POST",
                body: JSON.stringify(request),
            });
            if (!status)
                console.log(result?.message || "Error al obtener datos");

            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Operacion correcta",
                body: "Se obtuvo correctamente el precio de envio",
            });

            return result;
        } catch (error) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error",
                body: error.message,
                type: "danger",
            });
            return false;
        }
    };
}

export default ScrapRest;
