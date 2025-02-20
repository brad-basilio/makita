const puppeteer = require("puppeteer");

// Obtener argumentos desde la línea de comandos
const args = process.argv.slice(2);
const searchQuery = args[0] || "mujer";

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Configurar User-Agent
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        );

        // Construir la URL dinámica
        const url = `https://invictastores.com/search/${encodeURIComponent(
            searchQuery
        )}`;
        await page.goto(url, { waitUntil: "domcontentloaded" });

        // Esperar a que los productos se carguen
        await page.waitForSelector(".ProductCard", { timeout: 10000 });

        // Extraer los datos de los productos
        const products = await page.evaluate(() => {
            const baseUrl = "https://invictastores.com";
            return Array.from(document.querySelectorAll(".ProductCard")).map(
                (product) => {
                    let name =
                        product
                            .querySelector(".ProductCard-Name")
                            ?.innerText?.trim() || "Sin Titulo";
                    let price =
                        product
                            .querySelector(".ProductPrice-HighPrice")
                            ?.innerText?.trim() || "Sin precio";

                    let relativeSrc =
                        product.querySelector(
                            ".ProductCard-Picture .Image-Image"
                        )?.src || "Sin imagen";
                    // Construir la URL absoluta de la imagen
                    let image = relativeSrc.startsWith("http")
                        ? relativeSrc // Si ya es una URL absoluta, usarla tal cual
                        : baseUrl + relativeSrc; // Si es relativa, concatenar con la URL base
                    console.log(name, price, image);
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
