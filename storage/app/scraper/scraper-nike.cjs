const puppeteer = require("puppeteer");

// Obtener argumentos desde la línea de comandos
const args = process.argv.slice(2);
const searchQuery = args[0] || "mujer";

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        // Configurar User-Agent
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        );

        // Construir la URL dinámica
        const url = `https://www.nike.com.pe/search?q=${encodeURIComponent(
            searchQuery
        )}`;
        await page.goto(url, { waitUntil: "domcontentloaded" });

        // Esperar a que los productos se carguen
        await page.waitForSelector(".product", { timeout: 5000 });

        // Extraer los datos de los productos
        const products = await page.evaluate(() => {
            const baseUrl = "https://www.nike.com.pe";
            return Array.from(document.querySelectorAll(".product")).map(
                (product) => {
                    let name =
                        product
                            .querySelector(".product-title")
                            ?.innerText?.trim() || "Sin título";
                    let price =
                        product.querySelector(".price")?.innerText?.trim() ||
                        "Sin precio";

                    let relativeSrc =
                        product.querySelector(".tile-image")?.src ||
                        "Sin imagen";
                    // Construir la URL absoluta de la imagen
                    let image = relativeSrc.startsWith("http")
                        ? relativeSrc // Si ya es una URL absoluta, usarla tal cual
                        : baseUrl + relativeSrc; // Si es relativa, concatenar con la URL base
                    return { name, price, image };
                }
            );
        });

        console.log(JSON.stringify(products, null, 2));
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();
