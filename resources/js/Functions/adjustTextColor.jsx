export function getLuminance(color) {
    // Convierte el color a RGB
    let rgb;
    if (color.startsWith("rgb")) {
        rgb = color.match(/\d+(\.\d+)?/g).map(Number); // Extraer valores RGB (incluyendo canales alfa)
    } else if (color.startsWith("#")) {
        // Convertir HEX a RGB
        const hex = color.replace("#", "");
        rgb = [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16),
        ];
    } else {
        throw new Error("Formato de color no soportado");
    }

    // Si el color tiene transparencia (rgba), combinarlo con el fondo blanco (#FFFFFF)
    if (rgb.length === 4) {
        const alpha = rgb[3];
        rgb = rgb.map((c, i) => Math.round(c * alpha + 255 * (1 - alpha)));
    }

    // Normalizar los valores RGB (0-255 a 0-1)
    const [r, g, b] = rgb.map((c) => {
        const channel = c / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });

    // Calcular la luminancia según WCAG
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function adjustTextColor(element) {
    const backgroundColor = window.getComputedStyle(element).backgroundColor;
    const backgroundLuminance = getLuminance(backgroundColor);

    // Luminancia de blanco (#FFFFFF) y negro (#000000)
    const whiteLuminance = getLuminance("rgb(255, 255, 255)");
    const blackLuminance = getLuminance("rgb(0, 0, 0)");

    // Calcular el contraste relativo
    const contrastWithWhite = (whiteLuminance + 0.05) / (backgroundLuminance + 0.05);
    const contrastWithBlack = (backgroundLuminance + 0.05) / (blackLuminance + 0.05);

    // Aplicar umbrales mínimos de contraste según WCAG
    if (contrastWithWhite >= 4.5 || contrastWithWhite > contrastWithBlack) {
        element.classList.add("text-black"); // Fondo claro → texto oscuro
        element.classList.remove("text-white");
    } else {
        element.classList.add("text-white"); // Fondo oscuro → texto blanco
        element.classList.remove("text-black");
    }
}