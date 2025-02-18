export const processCulqiPayment = (saleId, total, email) => {
    return new Promise((resolve, reject) => {
        window.Culqi.publicKey = "pk_test_4ded8e590d8842d4"; // Reemplaza con tu llave pública
        window.Culqi.settings({
            title: "Stech Perú",
            currency: "PEN",
            amount: total * 100, // Convertir a céntimos
        });

        window.Culqi.open();

        document.addEventListener("culqi.token", async () => {
            const token = window.Culqi.token ? window.Culqi.token.id : null;
            if (!token) {
                reject("No se obtuvo un token de Culqi");
                return;
            }

            try {
                const response = await fetch("/api/pago", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Xsrf-Token": decodeURIComponent(
                            document.cookie
                                .split("; ")
                                .find((row) => row.startsWith("XSRF-TOKEN="))
                                ?.split("=")[1] || ""
                        ),
                    },
                    body: JSON.stringify({
                        token,
                        amount: total,
                        email,
                        sale_id: saleId, // Enviar el ID de la venta
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    reject(errorData || "Error en el pago");
                    return;
                }

                const data = await response.json();
                resolve(data);
            } catch (error) {
                reject(error.message || "Error en el pago");
            }
        });

        document.addEventListener("culqi.error", (error) => {
            reject(error.detail || "Error desconocido en Culqi");
        });
    });
};
