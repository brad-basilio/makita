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
        const filtered = data.filter(Boolean)
        setDetails(filtered)
        // Debug: log specifications structure for each product so we can inspect shapes
        try {
          filtered.forEach(p => {
            // Use console.group for clearer output
            console.groupCollapsed && console.groupCollapsed(`compare: specs for product ${p?.id || p?.code || '(no-id)'} `)
            console.log('compare: product id:', p?.id || p?.code || '(no-id)')
            try {
              console.log('compare: specifications:', JSON.stringify(p?.specifications, null, 2))
            } catch (e) {
              console.log('compare: specifications (non-serializable):', p?.specifications)
            }
            console.groupEnd && console.groupEnd()
          })
        } catch (e) {
          console.log('compare: error logging specifications', e)
        }
        setLoading(false)
      })
    } else {
      setDetails([])
    }
  }, [isOpen, products])

  const generatePDF = async () => {
    setExporting(true)

    // Helper: crea un nodo DOM temporal con layout de escritorio para renderizar el PDF
    const createPrintableDiv = (items) => {
      const wrapper = document.createElement('div')
      wrapper.id = 'printable-compare'
      wrapper.style.position = 'absolute'
      wrapper.style.left = '-9999px'
      wrapper.style.top = '0'
      wrapper.style.width = '1000px'
      wrapper.style.background = '#ffffff'
      wrapper.style.padding = '24px'
      wrapper.style.boxSizing = 'border-box'
      wrapper.style.fontFamily = 'Arial, Helvetica, sans-serif'

      const escape = (str) => {
        if (str === undefined || str === null) return ''
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
      }

      // Header
      let html = `
        <div style="width:100%;margin-bottom:12px;">
          <h2 style="font-size:22px;margin:0 0 8px 0;color:#262626;">Comparar productos</h2>
          <p style="margin:0;color:#666;">Se exporta la información de los productos comparados.</p>
        </div>
      `

      // Grid de 2 columnas
      html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;align-items:start;">'

      items.forEach(product => {
        const name = escape(product.name)
        const code = escape(product.code)
        const img = escape(product.image)
          // Description: insertar como HTML (permitir etiquetas) según lo solicitado
          // --- WARNING: this will insert raw HTML from product.description ---
          const desc = product.description || ''

        // Construir HTML de especificaciones como tabla
        let specsHtml = ''

        const stringifySpecValue = (v) => {
          if (v === null || v === undefined) return ''
          if (typeof v === 'object') {
            // Prefer common fields
            if (Array.isArray(v)) {
              return v.map(item => {
                if (item === null || item === undefined) return ''
                if (typeof item === 'object') {
                  return item.value || item.val || item.v || item.name || JSON.stringify(item)
                }
                return String(item)
              }).join(', ')
            }
            if ('value' in v || 'val' in v || 'v' in v) return String(v.value || v.val || v.v)
            if ('name' in v && 'value' in v) return String(v.value)
            try { return JSON.stringify(v) } catch (e) { return String(v) }
          }
          return String(v)
        }

        const buildTableFromPairs = (pairs) => {
          if (!pairs || pairs.length === 0) return ''
          let t = '<table style="width:100%;border-collapse:collapse;font-size:12px;">'
          t += '<tbody>'
          // Header row: KEY | VALUE
          t += pairs.map(([kk, vv]) => {
            const keyEsc = escape(kk)
            // allow line breaks in values
            const rawVal = stringifySpecValue(vv)
            const valWithBreaks = escape(rawVal).replace(/\n/g, '<br/>')
            // Left: key (bold), Right: value
            return `\n<tr><td style="border:1px solid #eee;padding:6px;width:40%;vertical-align:top;background:#fafafa"><strong>${keyEsc}</strong></td><td style="border:1px solid #eee;padding:6px;vertical-align:top">${valWithBreaks}</td></tr>`
          }).join('')
          t += '\n</tbody></table>'
          return t
        }

        const normalizeSpecItem = (item) => {
          // Return [key, value]
          if (item === null || item === undefined) return ['', '']
          if (typeof item === 'object') {
            // If the spec item uses title/description (common in your data), prefer that
            if ('title' in item || 'description' in item) {
              const key = item.title || item.name || item.key || ''
              const val = item.description || item.value || item.val || ''
              return [String(key), String(val)]
            }
            const key = item.key || item.name || item.k || ''
            const val = item.value || item.val || item.v || ''
            return [String(key), String(val)]
          }
          if (typeof item === 'string') {
            let s = item.trim()
            // try JSON first
            try {
              const parsed = JSON.parse(s)
              if (typeof parsed === 'object') return normalizeSpecItem(parsed)
            } catch (e) {
              // not JSON
            }

            // remove outer braces/brackets
            s = s.replace(/^\s*[{\[]\s*|\s*[}\]]\s*$/g, '')

            // Try to capture labeled key/value (key ... value ...)
            const keyLabelMatch = s.match(/key\s*["'\.:\=]*\s*["']?([^"',\n\}]+)["']?/i)
            const valueLabelMatch = s.match(/value\s*["'\.:\=]*\s*["']?([\s\S]+)["']?$/i)
            if (keyLabelMatch || valueLabelMatch) {
              const key = keyLabelMatch ? keyLabelMatch[1].trim() : ''
              const val = valueLabelMatch ? valueLabelMatch[1].trim().replace(/^[",\s]+|[",\s]+$/g, '') : ''
              return [key, val]
            }

            // Try generic key:value or key.value or key="value"
            const kvMatch = s.match(/^["']?\s*([^"':=\n\|\.\[\]]+?)\s*["']?\s*[:\.\=]\s*["']?([\s\S]+?)["']?\s*$/)
            if (kvMatch) {
              const k = kvMatch[1].trim()
              const v = kvMatch[2].trim().replace(/^,|,$/g, '')
              return [k, v]
            }

            // Try split by newline: first line key, rest value
            const lines = s.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
            if (lines.length >= 2) {
              // If the first line looks like a value (starts with a digit), treat the whole thing as value
              if (/^\s*\d/.test(lines[0])) {
                return ['', lines.join(' ')]
              }
              return [lines[0], lines.slice(1).join(' ')]
            }

            // Try split by common separators
            const parts = s.split(/\s*[,;|]\s*/)
            if (parts.length >= 2) {
              // If the first chunk looks like a numeric value, treat entire string as value
              if (/^\s*\d/.test(parts[0])) {
                return ['', parts.join(', ')]
              }
              return [parts[0].replace(/^"|"$/g, '').trim(), parts.slice(1).join(', ').replace(/^"|"$/g, '').trim()]
            }

            // Fallback: treat whole as value
            return ['', s.replace(/^"|"$/g, '')]
          }
          // other types
          return [String(item), '']
        }

        const getPairsFromSpecifications = (specs) => {
          const pairs = []
          if (!specs && specs !== 0) return pairs
          if (Array.isArray(specs)) {
            specs.forEach(s => {
              const [k, v] = normalizeSpecItem(s)
              if (k || v) pairs.push([k, v])
            })
            return pairs
          }
          if (typeof specs === 'object') {
            // If it's an object map where values are objects with title/description,
            // convert to pairs accordingly. Otherwise fall back to k->v.
            Object.entries(specs).forEach(([k, v]) => {
              if (v !== null && typeof v === 'object') {
                // Prefer title/description
                if ('title' in v || 'description' in v) {
                  pairs.push([String(v.title || k), String(v.description || stringifySpecValue(v))])
                // If object uses key/value fields (your logged shape), use them
                } else if ('key' in v || 'value' in v) {
                  pairs.push([String(v.key || k), stringifySpecValue(v.value)])
                } else {
                  // fallback: map object's key name to a stringified value
                  pairs.push([String(k), stringifySpecValue(v)])
                }
              } else {
                pairs.push([String(k), String(v)])
              }
            })
            return pairs
          }
          if (typeof specs === 'string') {
            const s = specs.trim()
            // try JSON first
            try {
              const parsed = JSON.parse(s)
              return getPairsFromSpecifications(parsed)
            } catch (e) {
              // not JSON
            }

            // Try to extract labeled key/value pairs inside the string
            const labeledPairs = []
            const keyRegex = /key\s*["'\.:\=]*\s*["']?([^"'\,\}]+)["']?/ig
            const valueRegex = /value\s*["'\.:\=]*\s*["']?([\s\S]*?)(?=(,|\}|$))/ig
            const km = keyRegex.exec(s)
            const vm = valueRegex.exec(s)
            if (km || vm) {
              const k = km ? km[1].trim() : ''
              const v = vm ? vm[1].trim().replace(/^,|,$/g, '') : ''
              if (k || v) labeledPairs.push([k, v])
            }
            if (labeledPairs.length > 0) return labeledPairs

            // Split by lines and try normalize each line
            const lines = s.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
            if (lines.length > 1) {
              lines.forEach(line => {
                const [k, v] = normalizeSpecItem(line)
                if (k || v) pairs.push([k, v])
              })
              return pairs
            }

            // If single line, try to parse multiple pairs separated by ',' or ';'
            const chunks = s.split(/\s*[,;|]\s*/).map(c => c.trim()).filter(Boolean)
            if (chunks.length > 1) {
              chunks.forEach(chunk => {
                const [k, v] = normalizeSpecItem(chunk)
                if (k || v) pairs.push([k, v])
              })
              return pairs
            }

            // Last resort: try normalize whole string
            const [k, v] = normalizeSpecItem(s)
            if (k || v) pairs.push([k, v])
            return pairs
          }
          return pairs
        }

        const pairs = getPairsFromSpecifications(product.specifications)
        specsHtml = buildTableFromPairs(pairs)

        if (!specsHtml) {
          specsHtml = '<p style="color:#888;font-size:12px;margin:6px 0;">Sin especificaciones técnicas disponibles</p>'
        }

        html += `
          <div style="border:1px solid #eee;border-radius:8px;padding:12px;background:#fff;box-sizing:border-box;">
            <div style="width:100%;display:flex;align-items:center;justify-content:center;margin-bottom:8px;min-height:100%;">
              <img src="/storage/images/item/${img || ''}" alt="${name}" style="max-width:220px;max-height:100$;object-fit:contain;" />
            </div>
            <div style="font-size:13px;color:#219FB9;font-weight:600;margin-bottom:6px;">${code}</div>
            <h3 style="font-size:16px;margin:0 0 8px 0;color:#222;">${name}</h3>
            <div style="font-size:12px;color:#444;margin-bottom:8px;">${desc}</div>
            <div style="font-size:13px;color:#222;font-weight:600;margin-bottom:6px;">Especificaciones técnicas</div>
            <div style="font-size:12px;color:#444;max-height:220px;overflow:auto;">${specsHtml}</div>
          </div>
        `
      })

      html += '</div>'
      wrapper.innerHTML = html
      return wrapper
    }

    let printableNode = null
    try {
      if (!details || details.length === 0) {
        console.log('No hay detalles para generar PDF')
        return
      }

      // Ocultar elementos UI que no queremos en el PDF durante el proceso
      const elementsToHide = document.querySelectorAll('.print-hide')
      const originalDisplays = []
      elementsToHide.forEach((el, i) => {
        originalDisplays[i] = el.style.display
        el.style.display = 'none'
      })

      // Creamos un nodo temporal con layout de escritorio (consistente)
      printableNode = createPrintableDiv(details)
      document.body.appendChild(printableNode)

      // Renderizar canvas desde el nodo temporal
      const canvas = await html2canvas(printableNode, {
        scale: 1.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      // Restaurar visibilidad de elementos ocultos
      elementsToHide.forEach((el, i) => {
        el.style.display = originalDisplays[i]
      })

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('El canvas generado está vacío')
      }

      // Crear PDF y usar JPEG comprimido para reducir tamaño
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const imgData = canvas.toDataURL('image/jpeg', 0.8)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const canvasRatio = canvas.width / canvas.height
      const maxWidth = pdfWidth - 20
      const maxHeight = pdfHeight - 20
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
      pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight)

      // Enlaces: como el layout es estático, no colocamos zonas exactas, pero
      // podemos añadir enlaces generales al principio por producto (opcional).
      // Guardamos el archivo
      pdf.save('comparacion-productos.pdf')

    } catch (error) {
      console.error('Error al generar PDF (printable):', error)
    } finally {
      // Limpiar nodo temporal
      try { if (printableNode && printableNode.parentNode) printableNode.parentNode.removeChild(printableNode) } catch(e){}
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
