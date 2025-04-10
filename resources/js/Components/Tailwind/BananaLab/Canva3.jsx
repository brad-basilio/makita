

import { useState, useRef } from "react"
import { ChevronLeft, Upload, Smartphone, FolderOpen } from "lucide-react"

export default function Canva3() {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: "caballito-playa-amor.jpg",
      size: "24,2 MB",
      progress: 40,
      thumbnail: "/assets/img/backgrounds/resources/default-image.png",
    },
    {
      id: 2,
      name: "caballito-playa-amor.jpg",
      size: "24,2 MB",
      progress: 40,
      thumbnail: "/assets/img/backgrounds/resources/default-image.png",
    },
    {
      id: 3,
      name: "caballito-playa-amor.jpg",
      size: "24,2 MB",
      progress: 40,
      thumbnail: "/assets/img/backgrounds/resources/default-image.png",
    },
  ])

  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para procesar los archivos arrastrados
    console.log("Archivos arrastrados:", e.dataTransfer.files)
  }

  const handleFileInputChange = (e) => {
    // Aquí iría la lógica para procesar los archivos seleccionados
    console.log("Archivos seleccionados:", e.target.files)
  }

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Botón Regresar - Solo visible en móvil */}
      <button className="flex items-center customtext-secondary mb-4 ">
        <ChevronLeft className="h-5 w-5" />
        <span className="ml-1">Regresar</span>
      </button>

      {/* Título y descripción */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Sube tus fotos</h1>
        <p className="text-sm md:text-base text-gray-700">
          Para obtener mejores resultados, las imágenes deben tener un peso mínimo de 1 MB en formato JPG o PNG.
        </p>
      </div>

      {/* Área de arrastrar y soltar */}
      <div
        className="border-2 border-dashed border-pink-200 rounded-lg p-6 mb-6"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <p className="font-medium mb-2 hidden md:block">Arrastra y suelta archivos de imagen para subir</p>
          <p className="text-sm md:text-base">O selecciona documentos desde tu dispositivo para cargarlos.</p>

          <div className="flex justify-center gap-8 mt-6">
            {/* En desktop mostramos 3 opciones, en móvil solo 2 */}
            <div className="hidden md:flex flex-col items-center">
              <button
                onClick={handleUploadClick}
                className="bg-pink-100 p-4 rounded-full mb-2 hover:bg-pink-200 transition-colors"
              >
                <Upload className="h-6 w-6 customtext-primary" />
              </button>
              <span className="text-sm text-center">Subir imágenes</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                multiple
                accept="image/jpeg,image/png"
              />
            </div>

            <div className="flex flex-col items-center">
              <button className="bg-pink-100 p-4 rounded-full mb-2 hover:bg-pink-200 transition-colors">
                <Smartphone className="h-6 w-6 customtext-primary" />
              </button>
              <span className="text-sm text-center">
                Cargar imágenes
                <br />
                desde el teléfono
              </span>
            </div>

            <div className="flex flex-col items-center">
              <button className="bg-pink-100 p-4 rounded-full mb-2 hover:bg-pink-200 transition-colors">
                <FolderOpen className="h-6 w-6 customtext-primary" />
              </button>
              <span className="text-sm text-center">
                Proyectos
                <br />
                existentes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de archivos */}
      <div className="space-y-3 mb-6">
        {files.map((file) => (
          <div key={file.id} className="bg-pink-50 rounded-lg p-3 flex items-center gap-3">
            <img
              src={file.thumbnail || "/assets/img/backgrounds/resources/default-image.png"}
              alt={file.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-pink-200">
                  <div
                    style={{ width: `${file.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-300"
                  ></div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{file.size}</p>
              <p className="text-sm text-gray-600">{file.progress}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* Botón Continuar */}
      <div className="flex justify-end">
        <a href="/editor" className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-accent transition-colors">
          Continuar
        </a>
      </div>
    </div>
  )
}
