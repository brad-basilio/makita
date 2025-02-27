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
/*
  static getPaginatedProducts = async (request) => {
        try {
            const { query, proveedor, page } = request;

            // Segunda petición: Obtener más productos por página
            const { status, result } = await Fetch(
                "./api/scrap-nike-paginate",
                {
                    method: "POST",
                    body: JSON.stringify({ query, proveedor, page }),
                }
            );

            if (!status) {
                console.log(result?.message || "Error al obtener más datos");
                return { data: [], hasMore: false };
            }

            return {
                data: result.data || [],
                hasMore: result.hasMore || false,
            };
        } catch (error) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error",
                body: error.message,
                type: "danger",
            });
            return { data: [], hasMore: false };
        }
    };
*/
