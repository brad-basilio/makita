import { CheckCircle } from "lucide-react";
import React from "react";
import { Fetch } from "sode-extend-react";
import { toast } from "sonner";

class DeliveryPricesRest {
    static getShippingCost = async (request) => {
        try {
            const { status, result } = await Fetch("./api/delivery-prices", {
                method: "POST",
                body: JSON.stringify(request),
            });
            if (!status)
                throw new Error(result?.message || "Error al obtener datos");

            toast.success("¡Excelente!", {
                description: "Obtuvimos el precio de envio correctamente",
              
                duration: 3000,
                position: "bottom-center",
               richColors:true
            });
           

            return result;
        } catch (error) {
            toast.error("¡Error!", {
                description: error.message,
              
                duration: 3000,
                position: "bottom-center",
               richColors:true
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

            toast.success("¡Excelente!", {
                description: "Obtuvimos el precio de envio correctamente",
              
                duration: 3000,
                position: "bottom-center",
               richColors:true
            });
         

            return result;
        } catch (error) {
            toast.error("¡Error!", {
                description: error.message,
              
                duration: 3000,
                position: "bottom-center",
               richColors:true
            });
            return false;
        }
    };
}

export default DeliveryPricesRest;
