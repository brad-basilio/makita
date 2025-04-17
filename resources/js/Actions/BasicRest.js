import { Cookies, Fetch, Notify } from "sode-extend-react";

let controller = new AbortController();

class BasicRest {
    path = null;
    hasFiles = false;

    simpleGet = async (url, params) => {
        try {
            const { status, result } = await Fetch(url, params)
            console.log('Simple Get:', { status, result });
            if (!status) throw new Error(result?.message || 'Ocurrio un error inesperado')
            return result.data ?? true;
        } catch (error) {
            Notify.add({
                icon: '/assets/img/icon.svg',
                title: 'Error',
                body: error.message,
                type: 'danger'
            })
            return null;
        }
    }

    paginate = async (params) => {
        controller.abort("Nothing");
        controller = new AbortController();
        const signal = controller.signal;
        const res = await fetch(`/api/${this.path}/paginate`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-Xsrf-Token": decodeURIComponent(Cookies.get("XSRF-TOKEN")),
            },
            body: JSON.stringify(params),
            signal,
        });
        return await res.json();
    };

    save = async (request, callback = () => { }) => {
        try {
            let status = false;
            let result = {};
            if (this.hasFiles) {
                const res = await fetch(`/api/${this.path}`, {
                    method: "POST",
                    headers: {
                        "X-Xsrf-Token": decodeURIComponent(
                            Cookies.get("XSRF-TOKEN")
                        ),
                    },
                    body: request,
                });
                status = res.ok;
                result = JSON.parseable(await res.text());
            } else {
                const fetchRes = await Fetch(`/api/${this.path}`, {
                    method: "POST",
                    body: JSON.stringify(request),
                });
                status = fetchRes.status;
                result = fetchRes.result;
            }

            if (!status)
                throw new Error(
                    result?.message || "Ocurrio un error inesperado"
                );

            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Correcto",
                body: result.message,
                type: "success",
            });
            callback?.();
            return result;
        } catch (error) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error",
                body: error.message,
                type: "danger",
            });
            return null;
        }
    };

    status = async ({ id, status }) => {
        try {
            const { status: fetchStatus, result } = await Fetch(
                `/api/${this.path}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ id, status }),
                }
            );
            if (!fetchStatus)
                throw new Error(
                    result?.message ?? "Ocurrio un error inesperado"
                );

            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Correcto",
                body: result.message,
                type: "success",
            });

            return true;
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

    boolean = async ({ id, field, value }) => {
        try {
            const { status: fetchStatus, result } = await Fetch(
                `/api/${this.path}/boolean`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ id, field, value }),
                }
            );
            if (!fetchStatus)
                throw new Error(
                    result?.message ?? "Ocurrio un error inesperado"
                );

            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Correcto",
                body: result.message,
                type: "success",
            });

            return true;
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

    delete = async (id) => {
        try {
            const { status: fetchStatus, result } = await Fetch(
                `/api/${this.path}/${id}`,
                {
                    method: "DELETE",
                }
            );
            if (!fetchStatus)
                throw new Error(
                    result?.message ?? "Ocurrio un error inesperado"
                );

            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Correcto",
                body: result.message,
                type: "success",
            });

            return true;
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

    // Método para obtener datos con soporte para relaciones
    get = async (idOrParams = {}, withRelations = []) => {
        try {
            let url = `/api/${this.path}`;
            if (
                typeof idOrParams === "string" ||
                typeof idOrParams === "number"
            ) {
                // Si es un ID, construir la URL con el ID
                url += `/${idOrParams}`;
            } else if (
                typeof idOrParams === "object" &&
                Object.keys(idOrParams).length > 0
            ) {
                // Si son parámetros, agregarlos como query string
                const queryParams = new URLSearchParams(idOrParams).toString();
                url += `?${queryParams}`;
            }

            // Agregar relaciones si se especifican
            if (withRelations.length > 0) {
                const withParam = withRelations.join(",");
                url += `${url.includes("?") ? "&" : "?"}with=${withParam}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-Xsrf-Token": decodeURIComponent(
                        Cookies.get("XSRF-TOKEN")
                    ),
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Error ${response.status}: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error",
                body: error.message,
                type: "danger",
            });
            return null;
        }
    };
}

export default BasicRest;
