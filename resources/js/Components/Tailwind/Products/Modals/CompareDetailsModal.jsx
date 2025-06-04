"use client"

import { useEffect, useState, useRef } from "react"
import { X, Download, Loader2 } from "lucide-react"
import axios from "axios"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"



const CompareDetailsModal = ({ isOpen, onClose, products, onRemoveProduct }) => {
  const [details, setDetails] = useState([])
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => {
    if (isOpen && products && products.length > 0) {
      setLoading(true)
      // Petición para cada producto
      Promise.all(
        products.map((product) =>
          axios
            .get(`/api/items/${product.id}`)
            .then((res) => res.data)
            .catch(() => null),
        ),
      ).then((data) => {
        setDetails(data.filter(Boolean))
        setLoading(false)
      })
    } else {
      setDetails([])
    }
  }, [isOpen, products])

  const generatePDF = async () => {
    if (!contentRef.current || exporting) return

    try {
      setExporting(true)

      // Crear un clon del contenido para manipularlo sin afectar la UI
      const contentClone = contentRef.current.cloneNode(true)

      // Aplicar estilos para el PDF
      contentClone.style.width = "800px" // Ancho fijo para mejor control
      contentClone.style.paddingLeft = "40px"
      contentClone.style.paddingRight = "40px"
      contentClone.style.paddingTop = "10px"
      contentClone.style.paddingBottom = "10px"
      contentClone.style.backgroundColor = "#ffffff"
      // Recopilar enlaces de productos ANTES de eliminar elementos
      const productLinks = []
      const detailButtons = contentClone.querySelectorAll('a[href*="/producto/"]')
      detailButtons.forEach((button, index) => {
        const href = button.getAttribute('href')
        if (href) {
          // Convertir href relativo a URL absoluta
          const fullUrl = href.startsWith('http') ? href : `${window.location.origin}${href}`
          productLinks.push({
            url: fullUrl,
            index: index
          })          // En lugar de modificar el botón existente, crear un nuevo enlace centrado
          const newLink = document.createElement('a')
          newLink.href = fullUrl
          newLink.innerHTML = '🔗 Ver detalles completos'
          newLink.style.cssText = `
            display: block;
            width: 80%;
            text-align: center;
            background-color: #0066cc;
            color: white;
            text-decoration: none;
            padding: 12px 16px;
            margin: 12px auto;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            box-sizing: border-box;
          `
          
          // Reemplazar el botón original con el nuevo enlace
          button.parentNode.replaceChild(newLink, button)
        }
      })

      // Eliminar solo los elementos que NO son botones de ver detalles
      const elementsToRemove = contentClone.querySelectorAll(".print-hide:not(a[href*='/producto/'])")
      elementsToRemove.forEach((element) => element.remove())
      // Limitar especificaciones solo para el PDF para evitar overflow
      const specificationContainers = contentClone.querySelectorAll('.space-y-2')
      specificationContainers.forEach(container => {
        const specs = container.querySelectorAll('div[class*="p-3"]')
        const maxSpecsForPDF = Math.min(5, specs.length) // Máximo 5 especificaciones para PDF
        
        // Remover especificaciones extras solo en el clon del PDF
        for (let i = maxSpecsForPDF; i < specs.length; i++) {
          if (specs[i]) {
            specs[i].remove()
          }
        }
        
        // Si se removieron especificaciones, añadir un indicador
        if (specs.length > maxSpecsForPDF) {
          const moreSpecsDiv = document.createElement('div')
          moreSpecsDiv.className = 'p-3 rounded-md bg-gray-100 text-center'
          moreSpecsDiv.innerHTML = `
            <p class="font-medium text-sm text-gray-600">
              ... y ${specs.length - maxSpecsForPDF} especificaciones más
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Ver producto completo para más detalles
            </p>
          `
          container.appendChild(moreSpecsDiv)
        }
      })
      // Crear un contenedor temporal para renderizar el clon
      const tempContainer = document.createElement("div")
      tempContainer.style.position = "absolute"
      tempContainer.style.left = "-9999px"
      tempContainer.style.top = "0"
      tempContainer.appendChild(contentClone)
      document.body.appendChild(tempContainer)

      // Añadir un título al PDF
      const titleElement = document.createElement("h1")
      titleElement.textContent = "Comparación de Productos"
      titleElement.style.textAlign = "center"
      titleElement.style.fontSize = "32px"
      titleElement.style.fontWeight = "bold"
      titleElement.style.marginBottom = "20px"
      titleElement.style.color = "#333"
      titleElement.style.fontFamily = "Arial, sans-serif"
      contentClone.insertBefore(titleElement, contentClone.firstChild)



      // Esperar a que el DOM se actualice
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Configuración mejorada para html2canvas
      const canvas = await html2canvas(contentClone, {
        scale: 2, // Mayor resolución
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        windowWidth: contentClone.scrollWidth,
        windowHeight: contentClone.scrollHeight,
      })

      // Limpiar el contenedor temporal
      document.body.removeChild(tempContainer)

      // Crear PDF con mejor calidad
      const imgData = canvas.toDataURL("image/jpeg", 0.5)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // Calcular dimensiones manteniendo la proporción
      const imgWidth = pageWidth - 20 // 10mm de margen a cada lado
      const imgHeight = (canvas.height * imgWidth) / canvas.width      // Dividir en múltiples páginas si es necesario
      const maxPageHeight = pageHeight - 20 // Altura disponible descontando márgenes (10mm arriba y abajo)
        if (imgHeight <= maxPageHeight) {
        // Si cabe en una sola página
        pdf.addImage(
          imgData,
          "JPEG",
          10, // Margen izquierdo de 10mm
          10, // Margen superior de 10mm
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        )
          // Añadir enlaces clickeables
        if (productLinks.length > 0) {
          productLinks.forEach((linkInfo, linkIndex) => {
            // Calcular posición aproximada del botón en mm con mejor espaciado
            const buttonY = 80 + (linkIndex * 90) // Posición Y estimada del botón en mm
            const buttonHeight = 15 // Altura estimada del botón en mm (más grande)
            const buttonWidth = imgWidth - 30 // Ancho del botón con márgenes
            
            pdf.link(
              20, // X del enlace (centrado)
              buttonY, // Y del enlace  
              buttonWidth, // Ancho del enlace
              buttonHeight, // Alto del enlace
              { url: linkInfo.url }
            )
          })
        }
      } else {
        // Dividir en múltiples páginas
        let remainingHeight = imgHeight
        let sourceY = 0
        let pageNumber = 0

        while (remainingHeight > 0) {
          if (pageNumber > 0) {
            pdf.addPage()
          }

          // Calcular la altura de contenido para esta página
          const currentPageHeight = Math.min(remainingHeight, maxPageHeight)
          
          // Crear un canvas temporal para esta sección
          const pageCanvas = document.createElement('canvas')
          const pageCtx = pageCanvas.getContext('2d')
          
          // Configurar el canvas temporal con la altura de esta página
          pageCanvas.width = canvas.width
          pageCanvas.height = (canvas.height * currentPageHeight) / imgHeight
          
          // Dibujar la sección correspondiente del canvas original
          pageCtx.drawImage(
            canvas,
            0, (canvas.height * sourceY) / imgHeight, // Origen en el canvas original
            canvas.width, (canvas.height * currentPageHeight) / imgHeight, // Tamaño de la sección
            0, 0, // Destino en el canvas temporal
            pageCanvas.width, pageCanvas.height // Tamaño en el canvas temporal
          )
            // Convertir a imagen y añadir al PDF
          const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.8)
          pdf.addImage(
            pageImgData,
            "JPEG",
            10, // Margen izquierdo
            10, // Margen superior
            imgWidth,
            (imgWidth * pageCanvas.height) / pageCanvas.width, // Mantener proporción
            undefined,
            "FAST"
          )          // Añadir enlaces clickeables si estamos en la primera página
          if (pageNumber === 0 && productLinks.length > 0) {
            productLinks.forEach((linkInfo, linkIndex) => {
              // Calcular posición aproximada del botón con mejor espaciado
              const buttonY = 80 + (linkIndex * 90) // Posición Y estimada del botón
              const buttonHeight = 15 // Altura estimada del botón (más grande)
              const buttonWidth = imgWidth - 30 // Ancho del botón con márgenes
              
              // Solo añadir el enlace si está visible en esta página
              if (buttonY < maxPageHeight) {
                pdf.link(
                  20, // X del enlace (centrado)
                  buttonY, // Y del enlace  
                  buttonWidth, // Ancho del enlace
                  buttonHeight, // Alto del enlace
                  { url: linkInfo.url }
                )
              }
            })
          }

          // Actualizar para la siguiente página
          remainingHeight -= currentPageHeight
          sourceY += currentPageHeight
          pageNumber++
        }
      }

      pdf.save("comparacion_productos.pdf")
    } catch (error) {
      console.error("Error al generar PDF:", error)
    } finally {
      setExporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-10">
      <div className="bg-white  rounded-xl w-full max-w-7xl pb-8   relative max-h-[90vh] overflow-y-auto scrollbar-none shadow-2xl border border-gray-200 dark:border-gray-800">
        {/* Cabecera con título y botones */}
        <div className="sticky pt-8 top-0 z-20 bg-white  pb-4 mb-6 rounded-t-xl shadow-md px-4 md:px-8" style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-2xl md:text-3xl font-bold customtext-neutral-dark ">Comparar productos</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={generatePDF}
                disabled={loading || exporting || details.length === 0}
                className="gap-2 print-hide flex items-center border border-gray-300 bg-primary brightness-125 text-white px-4 py-2 rounded-md  shadow-sm hover:brightness-100 disabled:opacity-60 disabled:cursor-not-allowed"
                type="button"
              >
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                <span>{exporting ? "Generando PDF..." : "Descargar PDF"}</span>
              </button>
              <button
                onClick={onClose}
                className="print-hide flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-700"
                type="button"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="text-sm customtext-neutral-dark dark:text-gray-400 mt-1">
            Puede añadir un máximo de cuatro artículos para comparar
          </p>
          <hr className="mt-4 border-gray-200 dark:border-gray-800" />
        </div>

        {/* Contenido principal para comparación y PDF */}
        <div ref={contentRef} className="bg-white  rounded-lg  px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="customtext-neutral-dark ">Cargando detalles de productos...</p>
            </div>
          ) : details.length === 0 ? (
            <div className="text-center py-16 bg-gray-50  rounded-lg">
              <p className="customtext-neutral-dark text-lg">No hay productos para comparar.</p>
              <p className="customtext-neutral-dark text-sm mt-2">
                Añada productos para iniciar la comparación.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {details.map((product) => (
                <div key={product.id} className="overflow-hidden h-full flex flex-col bg-white  rounded-lg shadow border border-gray-200 dark:border-gray-800">
                  <div className="relative">
                    <div className="bg-gray-100  aspect-square flex items-center justify-center overflow-hidden">
                      <img
                        src={`/storage/images/item/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                    <button
                      onClick={() => onRemoveProduct(product.id)}
                      className="absolute top-2 right-2 bg-white  text-gray-700 dark:text-gray-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md print-hide"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex-grow flex flex-col p-4">
                    <span className="inline-block self-start mb-2 px-2 py-1  customtext-primary rounded text-xs font-semibold bg-primary/10">
                      {product.code}
                    </span>

                    <h3 className="font-bold text-lg mb-2 line-clamp-2 customtext-neutral-dark dark:text-white">
                      {product.name}
                    </h3>

                    <div
                      className="prose prose-sm dark:prose-invert line-clamp-2 customtext-neutral-dark  mb-4"
                      dangerouslySetInnerHTML={{ __html: product?.description }}
                    />

                    <a
                      href={`/producto/${product.slug}`}
                      className="mb-4 w-full block text-center bg-primary hover:bg-primary/90 text-white py-2 rounded-md font-medium text-sm transition-colors print-hide"
                    >
                      Ver detalles
                    </a>

                    <hr className="my-4 border-gray-200 dark:border-gray-800" />

                    <div className="w-full">
                      <h4 className="font-semibold text-sm mb-3 customtext-neutral-dark dark:text-white">
                        Especificaciones técnicas
                      </h4>

                      <div className="space-y-2">
                        {(product.specifications || []).slice(0, 10).length > 0 ? (
                          (product.specifications || []).slice(0, 10).map((spec, idx2) => (
                            <div
                              key={spec.key || spec.name || idx2}
                              className={`p-3 rounded-md ${idx2 % 2 === 0 ? "bg-gray-50 " : "bg-white  border border-gray-100 dark:border-gray-800"}`}
                            >
                              <p className="font-medium text-sm customtext-neutral-dark dark:text-white">
                                {spec.key || spec.name}
                              </p>
                              <p className="text-sm customtext-neutral-dark dark:text-gray-400 mt-1">{spec.value}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-center customtext-neutral-dark dark:text-gray-400 py-4">Sin especificaciones</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón cerrar abajo */}
        <div className="flex justify-end mt-8 print-hide mr-8">
          <button
            onClick={onClose}
            className="bg-primary  text-white px-8 py-3 rounded text-lg font-bold transition-colors"
            type="button"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompareDetailsModal
