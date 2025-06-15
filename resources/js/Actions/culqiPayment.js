import { Fetch, Notify } from "sode-extend-react";
import Global from "../Utils/Global";
import { toast } from "sonner";

function generarNumeroOrdenConPrefijoYFecha() {
    let numeroOrden = "";
    for (let i = 0; i < 12; i++) {
        const digitoAleatorio = Math.floor(Math.random() * 10); // Genera un dígito aleatorio (0-9)
        numeroOrden += digitoAleatorio;
    }
    return numeroOrden;
}
export const processCulqiPayment = (request) => {
    return new Promise((resolve, reject) => {
        try {
            console.log(request);
            const orderNumber = generarNumeroOrdenConPrefijoYFecha(
                request.email
            );
            console.log(orderNumber);
            
            // Variable para rastrear si el pago se completó
            let paymentCompleted = false;
            
            // ✅ Configurar Culqi
            window.Culqi.publicKey = Global.CULQI_PUBLIC_KEY; // Reemplaza con tu clave pública
            window.Culqi.settings({
                title: Global.APP_NAME,
                email: request.email,
                currency: "PEN",
                amount: request.amount * 100, // Convertir a céntimos
                order: `${orderNumber}`,
            });
            console.log(window.Culqi.settings);

            window.Culqi.options({
                lang: "es",
                installments: false,
                paymentMethods: {
                    tarjeta: true,
                    yape: true,
                    bancaMovil: true,
                    agente: true,
                    billetera: true,
                    cuotealo: true,
                },
                style: {
                    logo: Global.APP_URL + "/assets/resources/logo.png",
                    bannerColor: Global.APP_COLOR_PRIMARY,
                    buttonBackground: Global.APP_COLOR_PRIMARY,
                },
            });

            // ✅ Override del método close de Culqi para detectar cierre sin pago
            const originalClose = window.Culqi?.close;
            if (originalClose) {
                window.Culqi.close = function() {
                    // Si no hay token y el pago no se completó, significa que se cerró sin completar
                    if (!window.Culqi.token && !paymentCompleted) {
                        console.log("🚫 Modal de Culqi cerrado sin completar el pago");
                        reject("Pago cancelado por el usuario");
                    }
                    return originalClose.apply(this, arguments);
                };
            }

            // ✅ Abrir el formulario de pago
            window.Culqi.open();

            // ✅ Escuchar eventos de Culqi
            window.culqi = async function () {
                try {
                    if (!window.Culqi.token) {
                        reject("No se obtuvo un token de Culqi");
                        return;
                    }

                    // Marcar como pago completado
                    paymentCompleted = true;
                    
                    const token = window.Culqi.token.id;
                    console.log("✅ Token generado:", token);

                    request = { ...request, token, orderNumber };
                    console.log("_request actualizado", request);
                    const { status, result } = await Fetch("./api/pago", {
                        method: "POST",
                        body: JSON.stringify(request),
                    });

                    if (!status) {
                        console.log(result?.message || "Error en el pago");
                    }

                    // ✅ Cerrar el modal de Culqi
                    window.Culqi.close();

                    // ✅ Notificar éxito

                    toast.success("¡Pago exitoso!", {
                        description: "Tu pago se procesó correctamente. Pronto recibirás la confirmación de tu pedido.",
                        duration: 3000,
                        position: "top-right",
                        richColors: true,
                    });



                    resolve(result);
                } catch (error) {
                    toast.error("¡Error en el Pago!", {
                        description: error.message,
                        duration: 3000,
                        position: "top-right",
                        richColors: true,
                    });
                    reject(error.message || "Error en el pago");
                }
            };

            // ✅ Manejar cierre manual de Culqi (cuando usuario cierra sin pagar)
            window.addEventListener('message', function(event) {
                if (event.data === 'culqi_closed') {
                    reject("Pago cancelado por el usuario");
                }
            });

            // ✅ Detectar cierre con ESC o cualquier otro método
            const handleEscapeClose = (event) => {
                if (event.key === 'Escape' && !paymentCompleted) {
                    console.log("🚫 Modal de Culqi cerrado con Escape");
                    reject("Pago cancelado por el usuario");
                }
            };
            
            // Agregar listener para la tecla Escape
            document.addEventListener('keydown', handleEscapeClose);
            
            // Limpiar listener después de un tiempo o cuando se complete
            setTimeout(() => {
                document.removeEventListener('keydown', handleEscapeClose);
            }, 300000); // 5 minutos

            // ✅ Manejar errores de Culqi
            document.addEventListener("culqi.error", function (event) {
                toast.error("¡Error en Culqi!", {
                    description: event.detail?.message || "Error desconocido",
                    duration: 3000,
                    position: "top-right",
                    richColors: true,
                });
                reject(event.detail?.message || "Error desconocido");
            });
        } catch (error) {
            toast.error("¡Error en la integración con Culqi!", {
                description: error.message,
                duration: 3000,
                position: "top-right",
                richColors: true,
            });

            reject("Error en la integración con Culqi");
        }
    });
};
