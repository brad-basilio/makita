export function getLuminance(color) {
    const rgb = color.match(/\d+/g); // Convierte "rgb(R, G, B)" en [R, G, B]
    const r = parseInt(rgb[0]);
    const g = parseInt(rgb[1]);
    const b = parseInt(rgb[2]);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance;
}

export function adjustTextColor(element) {
    const backgroundColor = window.getComputedStyle(element).backgroundColor;
    const luminance = getLuminance(backgroundColor);

    if (luminance < 0.55) {
        element.classList.add("text-white"); // Fondo oscuro → texto blanco
        element.classList.remove("text-black");
    } else {
        element.classList.add("text-black"); // Fondo claro → texto negro
        element.classList.remove("text-white");
    }
}