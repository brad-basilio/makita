const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const os = require("os");
const path = require("path");
// Obtener argumentos desde la línea de comandos
const args = process.argv.slice(2);
const searchQuery = args[0] || "mujer";
const offset = parseInt(args[1]) || 0;
const limit = parseInt(args[2]) || 12;
const exchangeRate = parseFloat(args[3]) || 1;

puppeteer.use(StealthPlugin());
(async () => {
    let browser;
    try {
        // Configurar Puppeteer
        /* browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-web-security",
                "--disable-features=IsolateOrigins,site-per-process",

                
            ],
        });*/
        // Generar un directorio temporal único para los datos del usuario
        const userDataDir = path.join(
            os.tmpdir(),
            `puppeteer-user-data-${Date.now()}`
        );

        // Configurar Puppeteer
        browser = await puppeteer.launch({
            executablePath: "/usr/bin/google-chrome-stable",
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-crashpad",
                "--disable-software-rasterizer",
                "--disable-extensions",
                "--disable-background-networking",
                "--remote-debugging-port=9222",
                `--user-data-dir=${userDataDir}`, // Directorio temporal único
            ],
        });

        const page = await browser.newPage();

        // Configurar User-Agent
        /*   await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        );*/
        await page.setCookie(
            {
                name: "cf_clearance",
                value: "X5TAc77eB9Ywx.BHKDTIYzah5Er8Fv2IfK5kGEsdv4M-1741028405-1.2.1.1-zjMK18OcbQGhCRo0kUTbzZEQrHirhfASG0SJ.ITA1FqF0B46AtyGpvE296a.uB56LukTPUL29zlfXKSv40SQLQjxp8PB1.3UQ8Iuz6uUgEB40dGM9TXe5HHvHUS_rlr5OWio31XZUPyyQd8EgGBn89oVwh9MxAOyiDDKoLC2wG077zJU5zRHZEIPt3XeiqRefJGYBfCJKErfHQZj0PTd._i79u5xTmXlXK55b5P3rEaZvwYBTCY3R03mwYTIIGcM3lGBeAK_f_TNXKBUqUyQ4vIbDFl2Pj7NnIPNt9TZ6wajuk9EnDkIgME9JTpdvMEkyVQQDS81MLQa__o8NtblX_dBlqR49WUpomyyyY7KaGHnkX_k342Y7ncS_U68G17bWkWoj3_FAUGWzE.IRd2t3bncTlEgLGn4R2vPD2AxxpI",
                domain: ".invictastores.com",
            },
            {
                name: "PHPSESSID",
                value: "87a1c02e895b3cfa24462e894945095d",
                domain: ".invictastores.com",
            },
            {
                name: "CookieConsent",
                value: "{stamp:%274Bvzadxlnuo5xSv9c4PSOeZG705O1wRr8oOgNh+IQXFU348a78QYiw==%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cmethod:%27explicit%27%2Cver:1%2Cutc:1740068934608%2Cregion:%27pe%27}",
                domain: "invictastores.com",
            }
        );

        // Configurar User-Agent real
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        // Desactivar detección de WebDriver
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, "webdriver", {
                get: () => undefined,
            });
        });

        // Simular resolución de pantalla
        await page.setViewport({ width: 1920, height: 1080 });
        /* await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );*/
        /* await page.setExtraHTTPHeaders({
            "Accept-Language": "en-US,en;q=0.9",
            Referer: "https://www.google.com/",
        });*/

        // Construir la URL dinámica
        const url = `https://invictastores.com/search/${encodeURIComponent(
            searchQuery
        )}`;
        // Capturar logs de la consola del navegador
        /*    page.on("console", async (msg) => {
            const args = await Promise.all(
                msg.args().map((arg) => arg.jsonValue())
            );
            console.log("🖥 LOG DESDE EL NAVEGADOR:", msg.text(), ...args);
        });*/
        // Captura una captura de pantalla para depuración
        // await page.screenshot({ path: "debug.png" });
        await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
        //await page.waitForNavigation({ waitUntil: "networkidle2" });
        // Simular interacciones humanas
        await page.mouse.move(300, 300);
        await page.mouse.down();
        await page.mouse.up();
        await page.waitForTimeout(Math.random() * 2000 + 1000); // Espera entre 1 y 3 segundos

        // Simular scroll en la página
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);
        });

        // Esperar a que los productos se carguen
        await page.waitForSelector(".ProductCard", { timeout: 60000 });
        // Asegurar que todos los precios con descuento se carguen antes de continuar

        // Extraer los datos de los productos
        const products = await page.evaluate((exchangeRate) => {
            const baseUrl = "https://invictastores.com";
            return Array.from(document.querySelectorAll(".ProductCard")).map(
                (product, index) => {
                    console.log(`📌 Producto #${index + 1}`);
                    let name =
                        product
                            .querySelector(".ProductCard-Name")
                            ?.innerText?.trim() || "Sin título";

                    let priceText =
                        product
                            .querySelector(
                                ".ProductCard-Content .ProductPrice .ProductPrice-HighPrice"
                            )
                            ?.innerText?.trim() || "Sin precio";
                    let priceFloat =
                        parseFloat(priceText.match(/\d+(\.\d+)?/)?.[0]) || null;
                    let price = (priceFloat * exchangeRate).toFixed(2);

                    let discountText =
                        product
                            .querySelector(".ProductPrice-DiscountedPrice")
                            ?.innerText?.trim() || "Sin precio";

                    let discountFloat =
                        parseFloat(discountText.match(/\d+(\.\d+)?/)?.[0]) ||
                        null;
                    let discount = (discountFloat * exchangeRate).toFixed(2);

                    let discount_percent = null;

                    let final_price = 0;

                    if (price === null) {
                        price = discount;
                    }
                    if (parseFloat(discount) < parseFloat(price)) {
                        final_price = discount;
                        discount_percent = Math.round(
                            100 - (parseFloat(discount) * 100) / price
                        );
                    } else {
                        final_price = price;
                        discount = null;
                    }

                    let url =
                        product.querySelector(".ProductCard-Content a")?.href ||
                        "#";

                    let relativeSrc =
                        product.querySelector(
                            ".ProductCard-Picture .Image-Image"
                        )?.src || "Sin imagen";
                    // Construir la URL absoluta de la imagen
                    let image = relativeSrc.startsWith("http")
                        ? relativeSrc
                        : baseUrl + relativeSrc;

                    return {
                        name,
                        price,
                        discount,
                        final_price,
                        discount_percent,
                        image,
                        url,
                    };
                }
            );
        }, exchangeRate);

        // Imprimir los productos en formato JSON
        console.log(JSON.stringify(products, null, 2));
    } catch (error) {
        // Manejar errores y devolver un JSON con el error
        console.error(
            JSON.stringify({
                status: "error",
                message: "Error en el scraping",
                error: error.message,
            })
        );
    } finally {
        // Cerrar el navegador
        if (browser) {
            await browser.close();
        }
    }
})();
