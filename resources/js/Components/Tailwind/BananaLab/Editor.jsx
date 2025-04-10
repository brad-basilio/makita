

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, RefreshCw, Camera, Trash2, ChevronDown, Eye, Save, Type, ImageIcon, Upload } from "lucide-react"
import ModalDetalles from "./components/ModalDetalles"
import ModalVistaPrevia from "./components/ModalVistaPrevia"

// Datos de ejemplo para las plantillas de diseño
const plantillasDiseno = [
  { id: 1, layout: "grid-cols-2 grid-rows-1", nombre: "Pág. 1" },
  {
    id: 2,
    layout: "grid-cols-2 grid-rows-2 [&>*:first-child]:col-span-1 [&>*:first-child]:row-span-2",
    nombre: "Pág. 2",
  },
  {
    id: 3,
    layout: "grid-cols-2 grid-rows-2 [&>*:last-child]:col-span-1 [&>*:last-child]:row-span-2",
    nombre: "Pág. 3",
  },
  { id: 4, layout: "grid-cols-2 grid-rows-2", nombre: "Pág. 4" },
  { id: 5, layout: "grid-cols-3 grid-rows-2", nombre: "Pág. 5" },
  { id: 6, layout: "grid-cols-3 grid-rows-3", nombre: "Pág. 6" },
  { id: 7, layout: "grid-cols-2 grid-rows-2 [&>*:nth-child(1)]:col-span-2", nombre: "Pág. 7" },
]

// Filtros predefinidos
const filtros = [
  { id: "normal", nombre: "Normal", clase: "" },
  { id: "sepia", nombre: "Sepia", clase: "sepia" },
  { id: "grayscale", nombre: "B&N", clase: "grayscale" },
  { id: "warm", nombre: "Cálido", clase: "brightness-105 contrast-105 saturate-150 hue-rotate-15" },
  { id: "cool", nombre: "Frío", clase: "brightness-105 contrast-105 saturate-90 hue-rotate-180" },
  { id: "vintage", nombre: "Vintage", clase: "sepia brightness-90 contrast-110" },
]

export default function Editor() {
  // Estados para manejar la funcionalidad
  const [layoutSeleccionado, setLayoutSeleccionado] = useState(1)
  const [fotosSeleccionadas, setFotosSeleccionadas] = useState([])
  const [textoIzquierda, setTextoIzquierda] = useState("")
  const [textoDerecha, setTextoDerecha] = useState("")
  const [modoEdicion, setModoEdicion] = useState("seleccion") // seleccion, ai, texto
  const [fotoSeleccionadaIndex, setFotoSeleccionadaIndex] = useState(null)
  const [vistaActual, setVistaActual] = useState("niveles") // niveles, filtros
  const [ajustesImagen, setAjustesImagen] = useState({
    exposicion: 50,
    contraste: 50,
    saturacion: 50,
    temperatura: 50,
    tono: 50,
    iluminaciones: 50,
    sombras: 50,
  })
  const [filtroSeleccionado, setFiltroSeleccionado] = useState("normal")
  const [mostrarBarraTexto, setMostrarBarraTexto] = useState(false)
  const [fuenteSeleccionada, setFuenteSeleccionada] = useState("Tipografía")
  const [tamanoFuente, setTamanoFuente] = useState(16)
  const [colorTexto, setColorTexto] = useState("#000000")
  const [totalFotos, setTotalFotos] = useState(24)

  const fileInputRef = useRef(null)

  // Obtener la plantilla actual
  const plantillaActual = plantillasDiseno.find((p) => p.id === layoutSeleccionado)

  // Función para manejar la selección de plantilla
  const seleccionarPlantilla = (id) => {
    setLayoutSeleccionado(id)

    // Ajustar el número de fotos según la plantilla
    const plantilla = plantillasDiseno.find((p) => p.id === id)
    const numCeldas = plantilla.layout.includes("grid-cols-3")
      ? plantilla.layout.includes("grid-rows-3")
        ? 9
        : 6
      : plantilla.layout.includes("[&>*:first-child]:row-span-2") ||
          plantilla.layout.includes("[&>*:last-child]:row-span-2") ||
          plantilla.layout.includes("[&>*:nth-child(1)]:col-span-2")
        ? 3
        : plantilla.layout.includes("grid-rows-2")
          ? 4
          : 2

    // Asegurarse de que haya suficientes fotos para la plantilla
    if (fotosSeleccionadas.length < numCeldas) {
      const nuevasFotos = [...fotosSeleccionadas]
      while (nuevasFotos.length < numCeldas) {
        nuevasFotos.push({
          id: Date.now() + nuevasFotos.length,
          src: "/placeholder.svg?height=150&width=150",
          alt: `Foto ${nuevasFotos.length + 1}`,
          filtro: "normal",
          ajustes: { ...ajustesImagen },
        })
      }
      setFotosSeleccionadas(nuevasFotos)
    }
  }

  // Inicializar con algunas fotos de ejemplo
  useEffect(() => {
    if (fotosSeleccionadas.length === 0) {
      const fotos = [
        {
          id: 1,
          src: "/assets/img/backgrounds/resources/image1.png",
          alt: "Foto 1",
          filtro: "normal",
          ajustes: { ...ajustesImagen },
        },
        {
          id: 2,
          src: "/assets/img/backgrounds/resources/image2.png",
          alt: "Foto 2",
          filtro: "normal",
          ajustes: { ...ajustesImagen },
        },
      ]
      setFotosSeleccionadas(fotos)
    }
  }, [])

  // Función para manejar la subida de fotos
  const handleSubirFotos = () => {
    fileInputRef.current.click()
  }

  // Función para manejar el cambio de archivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Crear URLs para las imágenes seleccionadas
    const nuevasFotos = files.map((file, index) => ({
      id: Date.now() + index,
      src: URL.createObjectURL(file),
      alt: file.name,
      filtro: "normal",
      ajustes: { ...ajustesImagen },
    }))

    setFotosSeleccionadas([...fotosSeleccionadas, ...nuevasFotos])
    setTotalFotos((prev) => prev + files.length)
  }

  // Función para seleccionar una foto para editar
  const seleccionarFoto = (index) => {
    setFotoSeleccionadaIndex(index)
    if (index !== null && fotosSeleccionadas[index]) {
      const foto = fotosSeleccionadas[index]
      setFiltroSeleccionado(foto.filtro || "normal")
      setAjustesImagen(foto.ajustes || { ...ajustesImagen })
    }
  }

  // Función para aplicar filtro a la foto seleccionada
  const aplicarFiltro = (filtroId) => {
    if (fotoSeleccionadaIndex === null) return

    const nuevasFotos = [...fotosSeleccionadas]
    nuevasFotos[fotoSeleccionadaIndex] = {
      ...nuevasFotos[fotoSeleccionadaIndex],
      filtro: filtroId,
    }

    setFotosSeleccionadas(nuevasFotos)
    setFiltroSeleccionado(filtroId)
  }

  // Función para aplicar ajustes a la foto seleccionada
  const aplicarAjuste = (tipo, valor) => {
    if (fotoSeleccionadaIndex === null) return

    const nuevosAjustes = { ...ajustesImagen, [tipo]: valor }
    setAjustesImagen(nuevosAjustes)

    const nuevasFotos = [...fotosSeleccionadas]
    nuevasFotos[fotoSeleccionadaIndex] = {
      ...nuevasFotos[fotoSeleccionadaIndex],
      ajustes: nuevosAjustes,
    }

    setFotosSeleccionadas(nuevasFotos)
  }

  // Función para eliminar una foto
  const eliminarFoto = (index) => {
    const nuevasFotos = [...fotosSeleccionadas]

    // Si la foto tiene una URL de objeto, liberarla
    const foto = nuevasFotos[index]
    if (foto && foto.src && foto.src.startsWith("blob:")) {
      URL.revokeObjectURL(foto.src)
    }

    nuevasFotos.splice(index, 1)
    setFotosSeleccionadas(nuevasFotos)

    if (fotoSeleccionadaIndex === index) {
      setFotoSeleccionadaIndex(null)
    }

    setTotalFotos((prev) => prev - 1)
  }

  // Función para cambiar el modo de edición
  const cambiarModo = (modo) => {
    setModoEdicion(modo)
    if (modo === "texto") {
      setMostrarBarraTexto(true)
    } else {
      setMostrarBarraTexto(false)
    }
  }

  // Función para editar texto
  const handleEditarTexto = (lado, texto) => {
    if (lado === "izquierda") {
      setTextoIzquierda(texto)
    } else {
      setTextoDerecha(texto)
    }
  }

  // Función para obtener los estilos CSS de los ajustes de imagen
  const obtenerEstilosAjuste = (ajustes) => {
    if (!ajustes) return ""

    return {
      filter: `
        brightness(${(ajustes.exposicion / 50) * 0.5 + 0.75})
        contrast(${(ajustes.contraste / 50) * 0.5 + 0.75})
        saturate(${(ajustes.saturacion / 50) * 0.5 + 0.75})
        hue-rotate(${(ajustes.tono - 50) * 3.6}deg)
        sepia(${ajustes.temperatura > 50 ? (ajustes.temperatura - 50) / 50 : 0})
        brightness(${ajustes.iluminaciones > 50 ? (ajustes.iluminaciones - 50) / 50 + 1 : 1})
        brightness(${ajustes.sombras < 50 ? ajustes.sombras / 50 : 1})
      `,
    }
  }

  // Función para obtener la clase CSS del filtro
  const obtenerClaseFiltro = (filtroId) => {
    const filtro = filtros.find((f) => f.id === filtroId)
    return filtro ? filtro.clase : ""
  }

  // Limpiar URLs de objetos al desmontar
  useEffect(() => {
    return () => {
      fotosSeleccionadas.forEach((foto) => {
        if (foto.src && foto.src.startsWith("blob:")) {
          URL.revokeObjectURL(foto.src)
        }
      })
    }
  }, [])

  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [modalVistaPreviaAbierto, setModalVistaPreviaAbierto] = useState(false);
  // Función para manejar el clic en el botón Comprar
  const handleComprar = () => {
    setModalDetallesAbierto(true)
  }

  // Función para continuar desde el modal de detalles
  const continuarDesdeDetalles = () => {
    setModalDetallesAbierto(false)
    setModalVistaPreviaAbierto(true)
  }

  // Función para continuar desde el modal de vista previa
  const continuarDesdeVistaPrevia = () => {
    setModalVistaPreviaAbierto(false)
    // Aquí podrías redirigir al proceso de compra o realizar otra acción
  }
  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto">
      {/* Barra superior */}
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">Libro Personalizado</h1>
          <h2 className="text-xl">«Buenos Deseos de Matrimonio»</h2>
        </div>

        <button  onClick={handleComprar} className="bg-primary text-white px-6 py-2 rounded-full" >
          Comprar
        </button>
      </div>

      <div className="text-sm text-gray-600 px-4 py-2">{totalFotos} fotos cargadas</div>

      {/* Botón para volver o subir más fotos */}
      <div className="px-4 mb-4">
        <button
          className="flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full"
          onClick={handleSubirFotos}
        >
          <Upload className="h-5 w-5 mr-1" />
          <span>{fotosSeleccionadas.length > 0 ? "Subir más fotos" : "Volver para fotos"}</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="px-4 mb-4">
        <h2 className="text-xl font-semibold">Comienza a editar</h2>
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row">
        {/* Barra lateral izquierda */}
        <div className="w-full md:w-64 p-4 border-r">
          {/* Pestañas de Niveles y Filtros */}
          <div className="flex border-b mb-4">
            <button
              className={`flex-1 py-2 text-center ${
                vistaActual === "niveles" ? "border-b-2 border-purple-500 font-medium" : ""
              }`}
              onClick={() => setVistaActual("niveles")}
            >
              Niveles
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                vistaActual === "filtros" ? "border-b-2 border-purple-500 font-medium" : ""
              }`}
              onClick={() => setVistaActual("filtros")}
            >
              Filtros
            </button>
          </div>

          {vistaActual === "niveles" && fotoSeleccionadaIndex !== null && (
            <div className="space-y-4">
              {/* Controles de ajuste de imagen */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Exposición</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ajustesImagen.exposicion}
                  onChange={(e) => aplicarAjuste("exposicion", Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Contraste</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ajustesImagen.contraste}
                  onChange={(e) => aplicarAjuste("contraste", Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Saturación</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ajustesImagen.saturacion}
                  onChange={(e) => aplicarAjuste("saturacion", Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Temperatura</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ajustesImagen.temperatura}
                  onChange={(e) => aplicarAjuste("temperatura", Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Tono</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ajustesImagen.tono}
                  onChange={(e) => aplicarAjuste("tono", Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Iluminaciones</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ajustesImagen.iluminaciones}
                  onChange={(e) => aplicarAjuste("iluminaciones", Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Sombras</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ajustesImagen.sombras}
                  onChange={(e) => aplicarAjuste("sombras", Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          )}

          {vistaActual === "filtros" && fotoSeleccionadaIndex !== null && (
            <div className="grid grid-cols-2 gap-2">
              {filtros.map((filtro) => (
                <button
                  key={filtro.id}
                  className={`p-2 rounded ${
                    filtroSeleccionado === filtro.id ? "ring-2 ring-purple-500 bg-purple-50" : "bg-gray-100"
                  }`}
                  onClick={() => aplicarFiltro(filtro.id)}
                >
                  <div className="aspect-square overflow-hidden rounded mb-1">
                    <div className={`w-full h-full bg-gray-300 ${filtro.clase}`}></div>
                  </div>
                  <span className="text-xs">{filtro.nombre}</span>
                </button>
              ))}
            </div>
          )}

          {fotoSeleccionadaIndex === null && (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-2" />
              <p>Selecciona una foto para editar</p>
            </div>
          )}
        </div>

        {/* Área de edición central */}
        <div className="flex-1 p-4">
          {/* Herramientas de edición */}
          <div className="flex items-center mb-4 space-x-2">
            <button
              className={`p-3 rounded-full ${
                modoEdicion === "seleccion" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => cambiarModo("seleccion")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 9L9 9L9 5L5 5L5 9ZM5 14L9 14L9 10L5 10L5 14ZM5 19L9 19L9 15L5 15L5 19ZM10 9L14 9L14 5L10 5L10 9ZM10 14L14 14L14 10L10 10L10 14ZM10 19L14 19L14 15L10 15L10 19ZM15 9L19 9L19 5L15 5L15 9ZM15 14L19 14L19 10L15 10L15 14ZM15 19L19 19L19 15L15 15L15 19Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <button
              className={`p-3 rounded-full ${
                modoEdicion === "ai" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => cambiarModo("ai")}
            >
              <span className="font-bold">AI</span>
            </button>

            <button
              className={`p-3 rounded-full ${
                modoEdicion === "texto" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => cambiarModo("texto")}
            >
              <Type className="h-4 w-4" />
            </button>

            <button className="p-3 rounded-full bg-gray-100 text-gray-800">
              <RefreshCw className="h-4 w-4" />
            </button>

            <button className="p-3 rounded-full bg-gray-100 text-gray-800">
              <Trash2 className="h-4 w-4" />
            </button>

            {/* Barra de herramientas de texto */}
            {mostrarBarraTexto && (
              <div className="flex items-center ml-4 space-x-2">
                <div className="relative">
                  <button className="flex items-center justify-between bg-white border rounded px-3 py-1 min-w-[120px]">
                    <span>{fuenteSeleccionada}</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    className="px-2 py-1 bg-white border rounded"
                    onClick={() => setTamanoFuente(Math.max(8, tamanoFuente - 1))}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{tamanoFuente}</span>
                  <button
                    className="px-2 py-1 bg-white border rounded"
                    onClick={() => setTamanoFuente(Math.min(72, tamanoFuente + 1))}
                  >
                    +
                  </button>
                </div>

                <input
                  type="color"
                  value={colorTexto}
                  onChange={(e) => setColorTexto(e.target.value)}
                  className="w-8 h-8 p-0 border-0 rounded"
                />
              </div>
            )}

            <div className="ml-auto flex items-center space-x-4">
              <button className="flex items-center text-gray-700">
                <Eye className="h-5 w-5 mr-1" />
                <span>Vista previa</span>
              </button>

              <button className="flex items-center text-gray-700">
                <Save className="h-5 w-5 mr-1" />
                <span>Guardar cambios</span>
              </button>
            </div>
          </div>

          {/* Área de diseño */}
          <div className="flex gap-4">
            {/* Panel izquierdo */}
            <div className="w-1/2 aspect-square border border-dashed border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden">
              {fotosSeleccionadas.length > 0 ? (
                <div className={`grid w-full h-full ${plantillaActual.layout}`}>
                  {fotosSeleccionadas.slice(0, 4).map((foto, index) => (
                    <div
                      key={index}
                      className={`relative overflow-hidden ${
                        fotoSeleccionadaIndex === index ? "ring-2 ring-purple-500" : ""
                      }`}
                      onClick={() => seleccionarFoto(index)}
                    >
                      <img
                        src={foto.src || "/assets/img/backgrounds/resources/default-image.png"}
                        alt={foto.alt}
                        className={`w-full h-full object-cover ${obtenerClaseFiltro(foto.filtro || "normal")}`}
                        style={obtenerEstilosAjuste(foto.ajustes)}
                      />
                      <button
                        className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          eliminarFoto(index)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Arrastra una foto aquí</p>
                </div>
              )}

              {/* Campo de texto */}
              <div className="absolute bottom-4 left-4 right-4">
                <input
                  type="text"
                  value={textoIzquierda}
                  onChange={(e) => handleEditarTexto("izquierda", e.target.value)}
                  placeholder="Editar texto"
                  className="w-full bg-transparent border-b border-dotted border-blue-400 text-gray-800 px-2 py-1 focus:outline-none"
                  style={{ fontFamily: fuenteSeleccionada, fontSize: `${tamanoFuente}px`, color: colorTexto }}
                />
              </div>
            </div>

            {/* Panel derecho */}
            <div className="w-1/2 aspect-square border border-dashed border-gray-300 rounded-lg overflow-hidden relative">
              <img
                src= "/assets/img/backgrounds/resources/default-image.png"
                alt="Imagen principal"
                className="w-full h-full object-cover"
              />

              {/* Campo de texto */}
              <div className="absolute bottom-4 left-4 right-4">
                <input
                  type="text"
                  value={textoDerecha}
                  onChange={(e) => handleEditarTexto("derecha", e.target.value)}
                  placeholder="Editar texto"
                  className="w-full bg-transparent border border-dotted border-purple-400 rounded text-gray-800 px-2 py-1 focus:outline-none"
                  style={{ fontFamily: fuenteSeleccionada, fontSize: `${tamanoFuente}px`, color: colorTexto }}
                />
              </div>
            </div>
          </div>

          {/* Plantillas de diseño */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Páginas</h3>
              <div className="flex items-center">
                <button className="p-1 text-gray-500">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="mx-2">Tapa</span>
                <button className="p-1 text-gray-500">
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {plantillasDiseno.map((plantilla) => (
                <button
                  key={plantilla.id}
                  className={`border border-dashed rounded p-2 aspect-square ${
                    layoutSeleccionado === plantilla.id ? "border-purple-500 bg-purple-50" : "border-gray-300"
                  }`}
                  onClick={() => seleccionarPlantilla(plantilla.id)}
                >
                  <div className={`grid h-full w-full ${plantilla.layout}`}>
                    {Array.from({
                      length: plantilla.layout.includes("grid-cols-3")
                        ? plantilla.layout.includes("grid-rows-3")
                          ? 9
                          : 6
                        : plantilla.layout.includes("[&>*:first-child]:row-span-2") ||
                            plantilla.layout.includes("[&>*:last-child]:row-span-2") ||
                            plantilla.layout.includes("[&>*:nth-child(1)]:col-span-2")
                          ? 3
                          : plantilla.layout.includes("grid-rows-2")
                            ? 4
                            : 2,
                    }).map((_, i) => (
                      <div key={i} className="bg-gray-200"></div>
                    ))}
                  </div>
                  <span className="text-xs mt-1 block text-center">{plantilla.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
       {/* Modales */}
       <ModalDetalles
        isOpen={modalDetallesAbierto}
        onClose={() => setModalDetallesAbierto(false)}
        onContinue={continuarDesdeDetalles}
      />

      <ModalVistaPrevia
        isOpen={modalVistaPreviaAbierto}
        onClose={() => setModalVistaPreviaAbierto(false)}
        onContinue={continuarDesdeVistaPrevia}
      />
    </div>
  )
}
