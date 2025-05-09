import { Fetch, Notify } from "sode-extend-react";

class DeliveryPricesRest {
    static getShippingCost = async (request) => {
        try {
            const { status, result } = await Fetch("./api/delivery-prices", {
                method: "POST",
                body: JSON.stringify(request),
            });
            if (!status)
                throw new Error(result?.message || "Error al obtener datos");

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

    static getCosts = async (request) => {
        try {
            const { status, result } = await Fetch("./api/prices-type", {
                method: "POST",
            });
            if (!status)
                throw new Error(result?.message || "Error al obtener datos");
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

export default DeliveryPricesRest;
