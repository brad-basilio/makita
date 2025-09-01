"use client"

import { useEffect, useState, useRef } from "react"
import { X, Download, Loader2 } from "lucide-react"
import axios from "axios"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

// Componente personalizado para bullets de paginación
const CustomPaginationBullet = ({ isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer transition-all duration-300 p-1 flex items-center justify-center"
    >
      {isActive ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="8" fill="#219FB9"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle opacity="0.4" cx="8" cy="8" r="8" fill="#219FB9" fillOpacity="0.32"/>
        </svg>
      )}
    </button>
  )
}

const swiperStyles = ``

const CompareDetailsModal = ({ isOpen, onClose, products, onRemoveProduct }) => {
  const [details, setDetails] = useState([])
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [swiperInstance, setSwiperInstance] = useState(null)
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
    setExporting(true)
    
    try {
      // Ocultar elementos que no queremos en el PDF
      const elementsToHide = document.querySelectorAll('.print-hide')
      const originalDisplays = []
      
      if (details.length === 0) {
        console.log('No hay detalles para generar PDF')
        return
      }
      
      // Guardar estilos originales y ocultar elementos
      elementsToHide.forEach((element, index) => {
        originalDisplays[index] = element.style.display
        element.style.display = 'none'
      })
      
      // Generar canvas del contenido
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: contentRef.current.scrollWidth,
        height: contentRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0,
          onclone: (clonedDoc) => {
          // Asegurar que el contenido clonado tenga el tamaño correcto
          const clonedElement = clonedDoc.querySelector('[ref="contentRef"]')
          if (clonedElement) {
            clonedElement.style.width = 'auto'
            clonedElement.style.height = 'auto'
          }

          // Asegurar que las imágenes se muestren correctamente
          // Usar una búsqueda segura (querySelectorAll('img')) y comparar por alt
          // en vez de construir un selector con el nombre del producto, ya que
          // nombres pueden contener comillas u otros caracteres que rompan el selector.
          try {
            const allImgs = clonedDoc.querySelectorAll('img')
            if (allImgs && allImgs.length) {
              allImgs.forEach(img => {
                try {
                  const alt = img.getAttribute('alt') || ''
                  // Encontrar si este alt coincide exactamente con algún producto
                  const match = products.find(p => (p.name || '') === alt)
                  if (match) {
                    img.style.maxWidth = '100%'
                    img.style.height = 'auto'
                  }
                } catch (e) {
                  // Ignorar errores individuales para no romper el proceso de clonación
                }
              })
            }
          } catch (err) {
            // Si por alguna razón querySelectorAll falla, no queremos que toda la
            // generación del PDF falle. Dejamos que continúe.
            console.warn('No se pudieron ajustar imágenes en onclone:', err)
          }
          
          // Ajustar títulos para mejor legibilidad
          const titles = clonedDoc.querySelectorAll('h2, h3, h4')
          titles.forEach(title => {
            title.style.pageBreakAfter = 'avoid'
            title.style.pageBreakInside = 'avoid'
          })
        }
      })
      
      // Restaurar elementos ocultos
      elementsToHide.forEach((element, index) => {
        element.style.display = originalDisplays[index]
      })
      
      console.log('Canvas generado directamente:', {
        width: canvas.width,
        height: canvas.height,
        dataURL: canvas.toDataURL().substring(0, 100) + '...'
      })
      
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('El canvas generado está vacío')
      }
      
      // Crear PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      // Calcular dimensiones manteniendo proporción
      const canvasRatio = canvas.width / canvas.height
      const maxWidth = pdfWidth - 20 // margen de 10mm a cada lado
      const maxHeight = pdfHeight - 20 // margen de 10mm arriba y abajo
      
      let imgWidth, imgHeight
      
      if (canvasRatio > (maxWidth / maxHeight)) {
        imgWidth = maxWidth
        imgHeight = maxWidth / canvasRatio
      } else {
        imgHeight = maxHeight
        imgWidth = maxHeight * canvasRatio
      }
      
      const x = (pdfWidth - imgWidth) / 2
      const y = (pdfHeight - imgHeight) / 2
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
      
      // Agregar enlaces a los productos si están disponibles
      if (details && details.length > 0) {
        const linkHeight = imgHeight / details.length
        
        details.forEach((product, index) => {
          const linkY = y + (index * linkHeight)
          const linkX = x
          const linkWidth = imgWidth
          
          pdf.link(linkX, linkY, linkWidth, linkHeight, {
            url: `${window.location.origin}/producto/${product.slug}`
          })
        })
      }
      
      pdf.save('comparacion-productos.pdf')
      
    } catch (error) {
      console.error('Error al generar PDF:', error)
    } finally {
      setExporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto ">
      <style dangerouslySetInnerHTML={{ __html: swiperStyles }} />
      <div className="relative  overflow-hidden pt-10 bg-white">
        <button
          onClick={onClose}
          className="print-hide absolute right-12 top-4  flex items-center justify-center w-10 h-10 rounded-md z-[999] bg-primary  text-white hover:bg-[#219FB9]"
          type="button"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
  <div className="bg-white w-full min-w-0 md:min-w-[800px] max-w-7xl pb-8 relative max-h-[90vh] overflow-y-auto scrollbar-none shadow-2xl">

          {!loading && (

            <div className="sticky pt-8 top-0 z-20 bg-white  pb-4 mb-6 rounded-t-xl shadow-md px-4 md:px-8" style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between pt-2">
                <h2 className="text-2xl md:text-3xl font-bold text-[#262626] ">Comparar productos</h2>
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={generatePDF}
                    disabled={loading || exporting || details.length === 0}
                    className="gap-2 print-hide flex tracking-wider items-center border border-gray-300 bg-[#219FB9]  hover:bg-primary text-white px-4 py-3 rounded-md  shadow-sm hover:brightness-100 disabled:opacity-60 disabled:cursor-not-allowed"
                    type="button"
                  >
                    {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : ""}
                    <span>{exporting ? "Generando PDF..." : "Descargar PDF"}</span>
                  </button>

                </div>
              </div>
              <p className="text-sm line-clamp-1 text-[#262626] mt-1">
                Puede añadir un máximo de cuatro artículos para comparar
              </p>

                <div className=" lg:hidden items-center gap-2">
                  <button
                    onClick={generatePDF}
                    disabled={loading || exporting || details.length === 0}
                    className="gap-2 mt-4 print-hide flex tracking-wider items-center border border-gray-300 bg-[#219FB9]  hover:bg-primary text-white px-4 py-3 rounded-md  shadow-sm hover:brightness-100 disabled:opacity-60 disabled:cursor-not-allowed"
                    type="button"
                  >
                    {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : ""}
                    <span>{exporting ? "Generando PDF..." : "Descargar PDF"}</span>
                  </button>

                </div>

            </div>
          )}


          <div ref={contentRef} className="bg-white rounded-lg px-4 md:px-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="customtext-neutral-dark ">Cargando detalles de productos...</p>
              </div>
            ) : details.length === 0 ? (
              <div className="text-center py-16 bg-gray-50  rounded-lg">
                <p className="customtext-neutral-dark text-lg">No hay productos para comparar.</p>
                <p className="customtext-neutral-dark  text-sm mt-2">
                  Añada productos para iniciar la comparación.
                </p>
              </div>
            ) : (
              <>
                {/* Mobile Swiper */}
                <div className="md:hidden">
                  <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    onSwiper={setSwiperInstance}
                    onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
                    className="compare-swiper w-full"
                  >
                    {details.map((product) => (
                      <SwiperSlide key={product.id} className="w-full" style={{ width: '100%' }}>
                        <div className="overflow-hidden w-full h-full flex flex-col bg-white rounded-lg min-w-0">
                          <div className="relative pt-12 max-w-[350px]">
                            <button
                              onClick={() => onRemoveProduct(product.id)}
                              className="absolute top-2 left-0 bg-primary text-white rounded w-9 h-9 flex items-center justify-center hover:bg-secondary shadow-md print-hide"
                            >
                              <X size={20} />
                            </button>
                            <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
                              <img
                                src={`/storage/images/item/${product.image}`}
                                alt={product.name}
                                className="w-full h-full object-contain p-4"
                                onError={e => e.target.src = '/assets/img/noimage/no_img.jpg'}
                              />
                            </div>
                          </div>

                          <div className="flex-grow flex flex-col p-4">
                            <div className="mb-2">
                              <span className="inline-block text-[#219FB9] rounded-full text-sm font-medium">
                                {product.code}
                              </span>
                            </div>

                            <h3 className="font-bold mb-3 text-lg leading-tight customtext-neutral-dark min-h-[3rem] flex items-start break-words">
                              {product.name}
                            </h3>

                            <div className="mb-4">
                              <div
                                className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-w-0"
                                dangerouslySetInnerHTML={{ __html: product?.description }}
                              />
                            </div>

                            <a
                              href={`/producto/${product.slug}`}
                              className="mb-4 w-full block text-center bg-primary hover:bg-secondary text-white py-3 rounded  text-base transition-all duration-200 shadow-sm hover:shadow-md print-hide"
                            >
                              Ver
                            </a>

                            <div className="w-full">
                              <h4 className="font-bold text-lg tracking-wider mt-2 mb-4 text-gray-800  border-gray-200 pb-2">
                                Especificaciones técnicas
                              </h4>

                              <div className="space-y-1">
                                {(() => {
                                  // Convertir especificaciones a array si es un objeto
                                  let specs = [];
                                  if (Array.isArray(product.specifications)) {
                                    specs = product.specifications;
                                  } else if (product.specifications && typeof product.specifications === 'object') {
                                    specs = Object.values(product.specifications);
                                  }

                                  return specs.length > 0 ? (
                                    specs.slice(0, 10).map((spec, idx2) => (
                                      <div
                                        key={spec.key || spec.name || idx2}
                                        className={`p-3  ${idx2 % 2 === 0 ? "bg-gray-50" : "bg-white "}`}
                                      >
                                        <p className="text-base text-[#262626]">
                                          <span className="font-bold tracking-wider text-sm  customtext-neutral-dark">{spec.key || spec.name}</span><br /> {spec.value}
                                        </p>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-md">
                                      <p className="text-gray-500 text-sm">Sin especificaciones técnicas disponibles</p>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* Paginación personalizada para móvil */}
                  {details.length > 1 && (
                    <div className="flex justify-center items-center mt-4 px-4">
                      <div className="flex gap-3">
                        {details.map((_, index) => (
                          <CustomPaginationBullet
                            key={index}
                            isActive={index === activeSlide}
                            onClick={() => {
                              if (swiperInstance) {
                                swiperInstance.slideTo(index)
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {details.map((product) => (
                    <div key={product.id} className="overflow-hidden h-full flex flex-col bg-white rounded-lg min-w-0">
                      <div className="relative pt-12">
                        <button
                          onClick={() => onRemoveProduct(product.id)}
                          className="absolute top-2 left-0 bg-primary text-white rounded w-9 h-9 flex items-center justify-center hover:bg-secondary shadow-md print-hide"
                        >
                          <X size={20} />
                        </button>
                        <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
                          <img
                            src={`/storage/images/item/${product.image}`}
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                            onError={e => e.target.src = '/assets/img/noimage/no_img.jpg'}
                          />
                        </div>
                      </div>

                      <div className="flex-grow flex flex-col p-4">
                        <div className="mb-2">
                          <span className="inline-block text-[#219FB9] rounded-full text-sm font-medium">
                            {product.code}
                          </span>
                        </div>

                        <h3 className="font-bold mb-3 text-lg leading-tight customtext-neutral-dark min-h-[3rem] flex items-start">
                          {product.name}
                        </h3>

                        <div className="mb-4">
                          <div
                            className="text-sm text-gray-600 line-clamp-2 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: product?.description }}
                          />
                        </div>

                        <a
                          href={`/producto/${product.slug}`}
                          className="mb-4 w-full block text-center bg-primary hover:bg-secondary text-white py-3 rounded  text-base transition-all duration-200 shadow-sm hover:shadow-md print-hide"
                        >
                          Ver
                        </a>

                        <div className="w-full">
                          <h4 className="font-bold text-lg tracking-wider mt-2 mb-4 text-gray-800  border-gray-200 pb-2">
                            Especificaciones técnicas
                          </h4>

                          <div className="space-y-1">
                            {(() => {
                              // Convertir especificaciones a array si es un objeto
                              let specs = [];
                              if (Array.isArray(product.specifications)) {
                                specs = product.specifications;
                              } else if (product.specifications && typeof product.specifications === 'object') {
                                specs = Object.values(product.specifications);
                              }

                              return specs.length > 0 ? (
                                specs.slice(0, 10).map((spec, idx2) => (
                                  <div
                                    key={spec.key || spec.name || idx2}
                                    className={`p-3  ${idx2 % 2 === 0 ? "bg-gray-50" : "bg-white "}`}
                                  >
                                    <p className="text-base text-[#262626]">
                                      <span className="font-bold tracking-wider text-sm  customtext-neutral-dark">{spec.key || spec.name}</span><br /> {spec.value}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-md">
                                  <p className="text-gray-500 text-sm">Sin especificaciones técnicas disponibles</p>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Botón cerrar abajo */}
          <div className="flex justify-end mt-8 print-hide mr-8">
            <button
              onClick={onClose}
              className="bg-primary  text-white px-8 py-3 rounded text-lg  transition-colors"
              type="button"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompareDetailsModal
