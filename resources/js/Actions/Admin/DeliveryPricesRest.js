import BasicRest from "@Rest/BasicRest.js";
import { Cookies } from "sode-extend-react";

class DeliveryPricesRest extends BasicRest {
    path = "admin/prices";

    upload = async (formData) => {
        try {
            const response = await fetch(`/api/${this.path}/massive`, {
                // Cambia la URL según tu backend
                method: "POST",
                headers: {
                    "X-Xsrf-Token": decodeURIComponent(
                        Cookies.get("XSRF-TOKEN")
                    ),
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al subir el archivo");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            return null;
        }
    };
}

export default DeliveryPricesRest;
