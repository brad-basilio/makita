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
        const url = `https://www.gapfactory.com/browse/search.do?searchText=${encodeURIComponent(
            searchQuery
        )}`;
        await page.goto(url, { waitUntil: "domcontentloaded" });

        // Esperar a que los productos se carguen
        await page.waitForSelector(".product-card", { timeout: 10000 });

        // Extraer los datos de los productos
        const products = await page.evaluate(() => {
            const baseUrl = "https://www.gapfactory.com";
            return Array.from(document.querySelectorAll(".product-card")).map(
                (product) => {
                    let name =
                        product
                            .querySelector(".sitewide-0")
                            ?.innerText?.trim() || "Sin Titulo";
                    let price =
                        product
                            .querySelector(".product-price__highlight")
                            ?.innerText?.trim() || "Sin precio";

                    // Obtener la imagen del producto
                    let imgElement = product.querySelector(
                        ".cat_product-image a img"
                    );
                    let relativeSrc = imgElement
                        ? imgElement.getAttribute("src")
                        : null;

                    // Construir la URL absoluta de la imagen
                    let image = relativeSrc
                        ? new URL(relativeSrc, baseUrl).href
                        : "Sin imagen";

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
