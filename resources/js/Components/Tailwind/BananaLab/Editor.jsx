"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
    Camera,
    Undo2,
    Redo2,
    Trash2,
    ChevronLeft,
    ImageIcon,
    Move,
    Type,
} from "lucide-react";
import PlantillaCuatroHuecos from "./plantilla-cuatro-huecos";
import MascaraSelector from "./mascara-selector";
import DragLayer from "./drag-layer";

// Layouts disponibles con huecos específicos
const layouts = [
    {
        id: "layout-1",
        name: "Cuatro fotos",
        template: "grid-cols-2 grid-rows-2",
        cells: 4,
        maskOptions: ["none", "circle", "heart", "star", "hexagon"],
    },
    {
        id: "layout-2",
        name: "Dos fotos horizontales",
        template: "grid-rows-2",
        cells: 2,
        maskOptions: ["none", "rounded", "wave", "diagonal"],
    },
    {
        id: "layout-3",
        name: "Tres fotos mixtas",
        template: "grid-cols-3 [grid-template-columns:1fr_2fr]",
        cells: 3,
        maskOptions: ["none", "circle", "triangle", "hexagon"],
    },
    {
        id: "layout-4",
        name: "Collage 2x2",
        template: "grid-cols-2 grid-rows-2",
        cells: 4,
        maskOptions: ["none", "circle", "polaroid", "vintage"],
    },
    {
        id: "layout-5",
        name: "Mosaico",
        template: "grid-cols-3 grid-rows-2",
        cells: 6,
        maskOptions: ["none", "circle", "square", "diamond"],
    },
    {
        id: "layout-6",
        name: "Álbum vertical",
        template: "grid-cols-2 grid-rows-3",
        cells: 6,
        maskOptions: ["none", "rounded", "leaf", "cloud"],
    },
    {
        id: "layout-7",
        name: "Portada con foto",
        template: "grid-cols-3 [grid-template-columns:2fr_1fr]",
        cells: 2,
        maskOptions: ["none", "circle", "frame", "vintage"],
    },
];

// Máscaras para imágenes
const imageMasks = {
    none: "",
    circle: "rounded-full",
    rounded: "rounded-xl",
    heart: "mask-heart",
    star: "mask-star",
    hexagon: "mask-hexagon",
    triangle: "mask-triangle",
    square: "mask-square",
    diamond: "mask-diamond",
    polaroid: "mask-polaroid",
    vintage: "mask-vintage",
    wave: "mask-wave",
    diagonal: "mask-diagonal",
    frame: "mask-frame",
    leaf: "mask-leaf",
    cloud: "mask-cloud",
};

// Componente Button personalizado
const Button = ({
    children,
    onClick,
    className = "",
    variant = "default",
    size = "default",
    disabled = false,
}) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

    const variantStyles = {
        default: "bg-purple-500 text-white hover:bg-purple-600",
        outline:
            "border border-input hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    const sizeStyles = {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md text-sm",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

// Componente Slider personalizado
const Slider = ({
    value = [50],
    min = 0,
    max = 100,
    step = 1,
    onValueChange,
}) => {
    const [currentValue, setCurrentValue] = useState(value[0]);

    const handleChange = (e) => {
        const newValue = Number.parseInt(e.target.value);
        setCurrentValue(newValue);
        if (onValueChange) {
            onValueChange([newValue]);
        }
    };

    return (
        <div className="relative flex w-full touch-none select-none items-center">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentValue}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
    );
};

// Componente para un elemento de imagen con posicionamiento y máscaras
const ImageElement = ({
    id,
    content,
    onSelect,
    isSelected,
    onDrop,
    filters,
    position,
    onMove,
    mask = "none",
}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "IMAGE",
        item: { id, type: "image" },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ["IMAGE_FILE"],
        drop: (item) => onDrop(id, item.files[0]),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    // Referencia para el elemento
    const elementRef = useRef(null);

    // Estado para el arrastre dentro del contenedor
    const [isDraggingInside, setIsDraggingInside] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentPos, setCurrentPos] = useState(position || { x: 0, y: 0 });

    // Aplicar filtros CSS basados en los valores de los filtros
    const filterStyle = {
        filter: `
      brightness(${filters?.brightness / 50})
      contrast(${filters?.contrast / 50})
      saturate(${filters?.saturation / 50})
      sepia(${filters?.tint / 100})
    `,
        transform: `scale(1.0)`,
        position: "relative",
        left: `${currentPos.x}px`,
        top: `${currentPos.y}px`,
        cursor: isSelected ? "move" : "pointer",
    };

    // Manejadores para el arrastre dentro del contenedor
    const handleMouseDown = (e) => {
        if (isSelected && content) {
            setIsDraggingInside(true);
            setStartPos({
                x: e.clientX - currentPos.x,
                y: e.clientY - currentPos.y,
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDraggingInside && elementRef.current) {
            const parentRect =
                elementRef.current.parentElement.getBoundingClientRect();
            const newX = e.clientX - startPos.x;
            const newY = e.clientY - startPos.y;

            // Limitar el movimiento dentro del contenedor padre
            const maxX = parentRect.width - elementRef.current.offsetWidth;
            const maxY = parentRect.height - elementRef.current.offsetHeight;

            const boundedX = Math.max(0, Math.min(newX, maxX));
            const boundedY = Math.max(0, Math.min(newY, maxY));

            setCurrentPos({ x: boundedX, y: boundedY });
        }
    };

    const handleMouseUp = () => {
        if (isDraggingInside) {
            setIsDraggingInside(false);
            // Actualizar la posición en el estado padre
            if (onMove) {
                onMove(id, currentPos);
            }
        }
    };

    // Efecto para agregar/quitar event listeners
    useEffect(() => {
        if (isDraggingInside) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDraggingInside, startPos]);

    // Referencia combinada para drag y drop
    const ref = useCallback(
        (node) => {
            elementRef.current = node;
            drag(node);
            drop(node);
        },
        [drag, drop]
    );

    // Función para abrir el explorador de archivos
    const openFileExplorer = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            if (e.target.files && e.target.files[0]) {
                onDrop(id, e.target.files[0]);
            }
        };
        input.click();
    };

    // Aplicar la máscara correspondiente
    const maskClass = imageMasks[mask] || "";

    return (
        <div
            ref={ref}
            className={`relative aspect-video bg-gray-100 rounded-md flex items-center justify-center overflow-hidden
        ${isSelected ? "ring-2 ring-purple-500" : ""}
        ${isOver ? "border-2 border-dashed border-purple-500" : ""}
        ${isDragging ? "opacity-50" : "opacity-100"}
      `}
            onClick={() => onSelect(id)}
            onMouseDown={handleMouseDown}
        >
            {content ? (
                <div className={`w-full h-full overflow-hidden ${maskClass}`}>
                    <img
                        src={content || "/placeholder.svg"}
                        alt="Imagen cargada"
                        className="w-full h-full object-cover"
                        style={filterStyle}
                    />
                </div>
            ) : (
                <div
                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 w-full h-full transition-colors"
                    onClick={openFileExplorer}
                >
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                        Haz clic para añadir imagen
                    </p>
                </div>
            )}
        </div>
    );
};

// Componente para un elemento de texto con posicionamiento
const TextElement = ({
    id,
    content,
    onSelect,
    isSelected,
    onChange,
    position,
    onMove,
    style = {},
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);
    const elementRef = useRef(null);

    // Estado para el arrastre dentro del contenedor
    const [isDraggingInside, setIsDraggingInside] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentPos, setCurrentPos] = useState(position || { x: 0, y: 0 });

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "TEXT",
        item: { id, type: "text" },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const handleDoubleClick = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleChange = (e) => {
        onChange(id, e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setIsEditing(false);
        }
    };

    // Manejadores para el arrastre dentro del contenedor
    const handleMouseDown = (e) => {
        if (isSelected && !isEditing) {
            e.stopPropagation();
            setIsDraggingInside(true);
            setStartPos({
                x: e.clientX - currentPos.x,
                y: e.clientY - currentPos.y,
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDraggingInside && elementRef.current) {
            const parentRect =
                elementRef.current.parentElement.getBoundingClientRect();
            const newX = e.clientX - startPos.x;
            const newY = e.clientY - startPos.y;

            // Limitar el movimiento dentro del contenedor padre
            const maxX = parentRect.width - elementRef.current.offsetWidth;
            const maxY = parentRect.height - elementRef.current.offsetHeight;

            const boundedX = Math.max(0, Math.min(newX, maxX));
            const boundedY = Math.max(0, Math.min(newY, maxY));

            setCurrentPos({ x: boundedX, y: boundedY });
        }
    };

    const handleMouseUp = () => {
        if (isDraggingInside) {
            setIsDraggingInside(false);
            // Actualizar la posición en el estado padre
            if (onMove) {
                onMove(id, currentPos);
            }
        }
    };

    // Efecto para agregar/quitar event listeners
    useEffect(() => {
        if (isDraggingInside) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDraggingInside, startPos]);

    // Referencia combinada
    const ref = useCallback(
        (node) => {
            elementRef.current = node;
            drag(node);
        },
        [drag]
    );

    // Estilos combinados
    const combinedStyle = {
        ...style,
        position: "absolute",
        left: `${currentPos.x}px`,
        top: `${currentPos.y}px`,
        cursor: isSelected && !isEditing ? "move" : "pointer",
        zIndex: 10,
    };

    return (
        <div
            ref={ref}
            className={`p-2 min-h-[40px] ${
                isSelected ? "ring-2 ring-purple-500" : ""
            } ${isDragging ? "opacity-50" : "opacity-100"}`}
            style={combinedStyle}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(id);
            }}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
        >
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="w-full p-1 border border-gray-300 rounded bg-white"
                    autoFocus
                />
            ) : (
                <div className="border border-dashed border-gray-300 p-2 rounded text-center bg-white/80 backdrop-blur-sm">
                    {content || "Editar texto"}
                </div>
            )}
        </div>
    );
};

// Componente para una celda que puede contener imágenes y texto
const LayoutCell = ({
    id,
    elements,
    onSelectElement,
    selectedElement,
    onDropImage,
    onUpdateText,
    onMoveElement,
    onUpdateImageFilter,
    onChangeMask,
    availableMasks = [],
}) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ["IMAGE_FILE", "IMAGE", "TEXT"],
        drop: (item, monitor) => {
            // Si es un archivo de imagen
            if (item.files) {
                // Buscar si ya hay un elemento de imagen en esta celda
                const imageElement = elements.find((el) => el.type === "image");
                if (imageElement) {
                    onDropImage(imageElement.id, item.files[0]);
                } else {
                    // Crear un nuevo elemento de imagen
                    const newId = `${id}-image-${Date.now()}`;
                    // Aquí se manejaría la creación de un nuevo elemento
                }
            }
            // Si es un elemento existente, se maneja en el componente padre
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    // Filtrar elementos por tipo
    const imageElements = elements.filter((el) => el.type === "image");
    const textElements = elements.filter((el) => el.type === "text");

    // Obtener la máscara actual
    const currentMask =
        imageElements.length > 0 ? imageElements[0].mask || "none" : "none";

    return (
        <div
            ref={drop}
            className={`relative border border-dashed border-gray-300 rounded-md p-2 min-h-[200px] ${
                isOver ? "bg-purple-50" : ""
            }`}
        >
            {/* Elementos de imagen */}
            {imageElements.map((element) => (
                <ImageElement
                    key={element.id}
                    id={element.id}
                    content={element.content}
                    onSelect={onSelectElement}
                    isSelected={selectedElement === element.id}
                    onDrop={onDropImage}
                    filters={element.filters}
                    position={element.position}
                    onMove={onMoveElement}
                    mask={element.mask || "none"}
                />
            ))}

            {/* Elementos de texto */}
            {textElements.map((element) => (
                <TextElement
                    key={element.id}
                    id={element.id}
                    content={element.content}
                    onSelect={onSelectElement}
                    isSelected={selectedElement === element.id}
                    onChange={onUpdateText}
                    position={element.position}
                    onMove={onMoveElement}
                    style={element.style}
                />
            ))}

            {/* Selector de máscara (visible solo cuando se selecciona una imagen) */}
            {selectedElement &&
                imageElements.some((el) => el.id === selectedElement) &&
                availableMasks.length > 0 && (
                    <div className="absolute bottom-2 right-2 bg-white rounded-md shadow-md p-1 z-20">
                        <select
                            value={currentMask}
                            onChange={(e) =>
                                onChangeMask(selectedElement, e.target.value)
                            }
                            className="text-xs border rounded p-1"
                        >
                            {availableMasks.map((mask) => (
                                <option key={mask} value={mask}>
                                    {mask.charAt(0).toUpperCase() +
                                        mask.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
        </div>
    );
};

// Componente para arrastrar archivos desde fuera
const FileDropZone = ({ onDrop }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ["IMAGE_FILE"],
        drop: (item) => onDrop(item.files[0]),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={drop}
            className={`border-2 ${
                isOver
                    ? "border-purple-500 bg-purple-50"
                    : "border-dashed border-gray-300"
            } 
        rounded-lg p-8 flex flex-col items-center justify-center text-center`}
        >
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500 mb-2">
                Arrastra y suelta imágenes aquí
            </p>
            <p className="text-xs text-gray-400">o</p>
            <label className="mt-2 cursor-pointer">
                <span className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600 transition-colors">
                    Seleccionar archivo
                </span>
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            onDrop(e.target.files[0]);
                        }
                    }}
                />
            </label>
        </div>
    );
};

// Componente para la miniatura de página
const PageThumbnail = ({ page, index, currentPage, onClick }) => {
    return (
        <div
            className={`border rounded-md p-2 cursor-pointer hover:border-purple-500 transition-colors
        ${
            currentPage === index
                ? "border-purple-500 ring-2 ring-purple-200"
                : ""
        }
      `}
            onClick={() => onClick(index)}
        >
            <div
                className={`bg-gray-100 aspect-[4/3] rounded-sm flex items-center justify-center text-xs text-gray-500`}
            >
                Pág. {index + 1}
            </div>
        </div>
    );
};

// Componente principal del editor
export default function EditorLibro() {
    const [pages, setPages] = useState([
        {
            id: "page-1",
            layout: "layout-1",
            cells: [
                {
                    id: "cell-1-1",
                    elements: [
                        {
                            id: "element-1-1-1",
                            type: "image",
                            content: "",
                            position: { x: 0, y: 0 },
                            filters: {
                                exposure: 50,
                                contrast: 50,
                                saturation: 50,
                                temperature: 50,
                                tint: 50,
                                brightness: 50,
                                shadows: 50,
                            },
                            mask: "none",
                        },
                        {
                            id: "element-1-1-2",
                            type: "text",
                            content: "Editar texto",
                            position: { x: 10, y: 10 },
                            style: {
                                fontFamily: "Arial",
                                fontSize: "16px",
                                fontWeight: "normal",
                                color: "#000000",
                                textAlign: "center",
                            },
                        },
                    ],
                },
                {
                    id: "cell-1-2",
                    elements: [
                        {
                            id: "element-1-2-1",
                            type: "image",
                            content: "",
                            position: { x: 0, y: 0 },
                            filters: {
                                exposure: 50,
                                contrast: 50,
                                saturation: 50,
                                temperature: 50,
                                tint: 50,
                                brightness: 50,
                                shadows: 50,
                            },
                            mask: "none",
                        },
                    ],
                },
                {
                    id: "cell-1-3",
                    elements: [
                        {
                            id: "element-1-3-1",
                            type: "image",
                            content: "",
                            position: { x: 0, y: 0 },
                            filters: {
                                exposure: 50,
                                contrast: 50,
                                saturation: 50,
                                temperature: 50,
                                tint: 50,
                                brightness: 50,
                                shadows: 50,
                            },
                            mask: "none",
                        },
                    ],
                },
                {
                    id: "cell-1-4",
                    elements: [
                        {
                            id: "element-1-4-1",
                            type: "image",
                            content: "",
                            position: { x: 0, y: 0 },
                            filters: {
                                exposure: 50,
                                contrast: 50,
                                saturation: 50,
                                temperature: 50,
                                tint: 50,
                                brightness: 50,
                                shadows: 50,
                            },
                            mask: "none",
                        },
                    ],
                },
            ],
        },
        {
            id: "page-2",
            layout: "layout-2",
            cells: [
                {
                    id: "cell-2-1",
                    elements: [
                        {
                            id: "element-2-1-1",
                            type: "image",
                            content: "",
                            position: { x: 0, y: 0 },
                            filters: {
                                exposure: 50,
                                contrast: 50,
                                saturation: 50,
                                temperature: 50,
                                tint: 50,
                                brightness: 50,
                                shadows: 50,
                            },
                            mask: "none",
                        },
                    ],
                },
                {
                    id: "cell-2-2",
                    elements: [
                        {
                            id: "element-2-2-1",
                            type: "image",
                            content: "",
                            position: { x: 0, y: 0 },
                            filters: {
                                exposure: 50,
                                contrast: 50,
                                saturation: 50,
                                temperature: 50,
                                tint: 50,
                                brightness: 50,
                                shadows: 50,
                            },
                            mask: "none",
                        },
                        {
                            id: "element-2-2-2",
                            type: "text",
                            content: "Editar texto",
                            position: { x: 20, y: 20 },
                            style: {
                                fontFamily: "Arial",
                                fontSize: "16px",
                                fontWeight: "normal",
                                color: "#000000",
                                textAlign: "center",
                            },
                        },
                    ],
                },
            ],
        },
    ]);

    const [currentPage, setCurrentPage] = useState(0);
    const [selectedElement, setSelectedElement] = useState(null);
    const [activeTab, setActiveTab] = useState("formas");
    const [editMode, setEditMode] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [textStyle, setTextStyle] = useState({
        fontFamily: "Arial",
        fontSize: "16px",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        textAlign: "center",
        color: "#000000",
    });
    const [selectedCelda, setSelectedCelda] = useState(null);
    const [selectedMask, setSelectedMask] = useState("none");

    // Función para cambiar el layout de la página actual
    const changeLayout = (layoutId) => {
        const selectedLayout = layouts.find((l) => l.id === layoutId);
        if (!selectedLayout) return;

        const updatedPages = [...pages];
        const currentPageData = updatedPages[currentPage];

        // Crear nuevas celdas basadas en el layout seleccionado
        const newCells = Array.from({ length: selectedLayout.cells }).map(
            (_, index) => {
                // Intentar reutilizar celdas existentes si es posible
                const existingCell = currentPageData.cells[index];

                return {
                    id: existingCell
                        ? existingCell.id
                        : `cell-${currentPageData.id}-${index + 1}`,
                    elements: existingCell
                        ? existingCell.elements
                        : [
                              {
                                  id: `element-${currentPageData.id}-${
                                      index + 1
                                  }-1`,
                                  type: "image",
                                  content: "",
                                  position: { x: 0, y: 0 },
                                  filters: {
                                      exposure: 50,
                                      contrast: 50,
                                      saturation: 50,
                                      temperature: 50,
                                      tint: 50,
                                      brightness: 50,
                                      shadows: 50,
                                  },
                                  mask: "none",
                              },
                          ],
                };
            }
        );

        updatedPages[currentPage] = {
            ...currentPageData,
            layout: layoutId,
            cells: newCells,
        };

        setPages(updatedPages);
        addToHistory(updatedPages);
    };

    // Función para manejar la subida de imágenes
    const handleImageUpload = (elementId, file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                const updatedPages = [...pages];

                // Buscar el elemento en todas las celdas
                let elementFound = false;

                updatedPages[currentPage].cells.forEach((cell) => {
                    const elementIndex = cell.elements.findIndex(
                        (el) => el.id === elementId
                    );

                    if (elementIndex !== -1) {
                        cell.elements[elementIndex].content = e.target.result;
                        elementFound = true;
                    }
                });

                if (elementFound) {
                    setPages(updatedPages);
                    addToHistory(updatedPages);
                }
            }
        };
        reader.readAsDataURL(file);
    };

    // Función para actualizar el texto
    const updateText = (elementId, text) => {
        const updatedPages = [...pages];

        // Buscar el elemento en todas las celdas
        let elementFound = false;

        updatedPages[currentPage].cells.forEach((cell) => {
            const elementIndex = cell.elements.findIndex(
                (el) => el.id === elementId
            );

            if (elementIndex !== -1) {
                cell.elements[elementIndex].content = text;
                elementFound = true;
            }
        });

        if (elementFound) {
            setPages(updatedPages);
            addToHistory(updatedPages);
        }
    };

    // Función para actualizar los filtros de imagen
    const updateImageFilter = (elementId, filterName, value) => {
        const updatedPages = [...pages];

        // Buscar el elemento en todas las celdas
        updatedPages[currentPage].cells.forEach((cell) => {
            const elementIndex = cell.elements.findIndex(
                (el) => el.id === elementId
            );

            if (elementIndex !== -1 && cell.elements[elementIndex].filters) {
                cell.elements[elementIndex].filters[filterName] = value;
            }
        });

        setPages(updatedPages);
    };

    // Función para actualizar la máscara de una imagen
    const updateImageMask = (elementId, maskType) => {
        const updatedPages = [...pages];

        // Buscar el elemento en todas las celdas
        updatedPages[currentPage].cells.forEach((cell) => {
            const elementIndex = cell.elements.findIndex(
                (el) => el.id === elementId
            );

            if (
                elementIndex !== -1 &&
                cell.elements[elementIndex].type === "image"
            ) {
                cell.elements[elementIndex].mask = maskType;
            }
        });

        setPages(updatedPages);
        addToHistory(updatedPages);
        setSelectedMask(maskType);
    };

    // Función para mover un elemento dentro de su celda
    const moveElement = (elementId, newPosition) => {
        const updatedPages = [...pages];

        // Buscar el elemento en todas las celdas
        updatedPages[currentPage].cells.forEach((cell) => {
            const elementIndex = cell.elements.findIndex(
                (el) => el.id === elementId
            );

            if (elementIndex !== -1) {
                cell.elements[elementIndex].position = newPosition;
            }
        });

        setPages(updatedPages);
    };

    // Obtener el elemento seleccionado
    const getSelectedElement = () => {
        if (!selectedElement) return null;

        // Buscar en todas las celdas
        for (const cell of pages[currentPage].cells) {
            const element = cell.elements.find(
                (el) => el.id === selectedElement
            );
            if (element) return element;
        }

        return null;
    };

    // Obtener la celda que contiene el elemento seleccionado
    const getSelectedElementCell = () => {
        if (!selectedElement) return null;

        // Buscar en todas las celdas
        for (const cell of pages[currentPage].cells) {
            const elementIndex = cell.elements.findIndex(
                (el) => el.id === selectedElement
            );
            if (elementIndex !== -1) return cell;
        }

        return null;
    };

    // Añadir una nueva página
    const addPage = () => {
        const newPageId = `page-${pages.length + 1}`;
        const newPage = {
            id: newPageId,
            layout: "layout-1",
            cells: Array.from({ length: 4 }).map((_, index) => ({
                id: `cell-${newPageId}-${index + 1}`,
                elements: [
                    {
                        id: `element-${newPageId}-${index + 1}-1`,
                        type: "image",
                        content: "",
                        position: { x: 0, y: 0 },
                        filters: {
                            exposure: 50,
                            contrast: 50,
                            saturation: 50,
                            temperature: 50,
                            tint: 50,
                            brightness: 50,
                            shadows: 50,
                        },
                        mask: "none",
                    },
                ],
            })),
        };

        const updatedPages = [...pages, newPage];
        setPages(updatedPages);
        setCurrentPage(updatedPages.length - 1);
        addToHistory(updatedPages);
    };

    // Añadir un nuevo elemento de texto a la celda seleccionada
    const addTextElement = () => {
        if (!selectedElement) return;

        const selectedCell = getSelectedElementCell();
        if (!selectedCell) return;

        const updatedPages = [...pages];
        const cellIndex = updatedPages[currentPage].cells.findIndex(
            (cell) => cell.id === selectedCell.id
        );

        if (cellIndex !== -1) {
            const newElementId = `${selectedCell.id}-text-${Date.now()}`;

            updatedPages[currentPage].cells[cellIndex].elements.push({
                id: newElementId,
                type: "text",
                content: "Nuevo texto",
                position: { x: 20, y: 20 },
                style: { ...textStyle },
            });

            setPages(updatedPages);
            setSelectedElement(newElementId);
            setEditMode("text");
            addToHistory(updatedPages);
        }
    };

    // Eliminar el elemento seleccionado
    const deleteSelectedElement = () => {
        if (!selectedElement) return;

        const updatedPages = [...pages];

        // Buscar y eliminar el elemento
        updatedPages[currentPage].cells.forEach((cell) => {
            const elementIndex = cell.elements.findIndex(
                (el) => el.id === selectedElement
            );

            if (elementIndex !== -1) {
                // No eliminar si es el único elemento de imagen en la celda
                if (
                    cell.elements[elementIndex].type === "image" &&
                    cell.elements.filter((el) => el.type === "image").length ===
                        1
                ) {
                    // En lugar de eliminar, limpiar el contenido
                    cell.elements[elementIndex].content = "";
                } else {
                    cell.elements.splice(elementIndex, 1);
                }
            }
        });

        setPages(updatedPages);
        setSelectedElement(null);
        setEditMode(null);
        addToHistory(updatedPages);
    };

    // Historial de cambios
    const addToHistory = (newPages) => {
        // Si estamos en medio del historial, eliminar los estados futuros
        if (historyIndex < history.length - 1) {
            setHistory(history.slice(0, historyIndex + 1));
        }

        // Añadir el nuevo estado al historial
        setHistory([...history, JSON.parse(JSON.stringify(newPages))]);
        setHistoryIndex(historyIndex + 1);
    };

    // Deshacer
    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setPages(JSON.parse(JSON.stringify(history[historyIndex - 1])));
        }
    };

    // Rehacer
    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setPages(JSON.parse(JSON.stringify(history[historyIndex + 1])));
        }
    };

    // Obtener el layout actual
    const getCurrentLayout = () => {
        return (
            layouts.find((layout) => layout.id === pages[currentPage].layout) ||
            layouts[0]
        );
    };

    // Actualizar el estilo del texto
    const updateTextStyle = (property, value) => {
        if (!selectedElement) return;

        const element = getSelectedElement();
        if (!element || element.type !== "text") return;

        const updatedPages = [...pages];

        // Buscar y actualizar el elemento
        updatedPages[currentPage].cells.forEach((cell) => {
            const elementIndex = cell.elements.findIndex(
                (el) => el.id === selectedElement
            );

            if (
                elementIndex !== -1 &&
                cell.elements[elementIndex].type === "text"
            ) {
                cell.elements[elementIndex].style = {
                    ...cell.elements[elementIndex].style,
                    [property]: value,
                };
            }
        });

        setPages(updatedPages);

        // Actualizar también el estado local de estilo de texto
        setTextStyle({
            ...textStyle,
            [property]: value,
        });
    };

    // Manejar la selección de una celda en la plantilla
    const handleCeldaSelect = (celdaId) => {
        setSelectedCelda(celdaId);
    };

    // Manejar la selección de una máscara
    const handleMaskSelect = (maskId) => {
        if (selectedElement) {
            updateImageMask(selectedElement, maskId);
        } else {
            setSelectedMask(maskId);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col min-h-screen">
                {/* Header */}
                <header className="border-b p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                            <ChevronLeft className="h-5 w-5 mr-1" />
                            Regresar
                        </Button>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">
                            Libro Personalizado
                        </h1>
                        <h2 className="text-xl">
                            «Buenos Deseos de Matrimonio»
                        </h2>
                    </div>

                    <Button className="bg-purple-500 hover:bg-purple-600">
                        Comprar
                    </Button>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar izquierdo */}
                    <aside className="w-64 border-r p-4 overflow-y-auto">
                        <div className="mb-4">
                            <div className="flex border rounded-md p-1 mb-4">
                                <button
                                    className={`flex-1 py-1 px-2 text-sm rounded ${
                                        activeTab === "formas"
                                            ? "bg-white shadow-sm"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => setActiveTab("formas")}
                                >
                                    Escoge tus formas
                                </button>
                                <button
                                    className={`flex-1 py-1 px-2 text-sm rounded ${
                                        activeTab === "filtros"
                                            ? "bg-white shadow-sm"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => setActiveTab("filtros")}
                                >
                                    Filtros
                                </button>
                                <button
                                    className={`flex-1 py-1 px-2 text-sm rounded ${
                                        activeTab === "niveles"
                                            ? "bg-white shadow-sm"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => setActiveTab("niveles")}
                                >
                                    Niveles
                                </button>
                            </div>

                            {activeTab === "formas" && (
                                <div className="space-y-4">
                                    <h3 className="font-medium">
                                        Layouts disponibles
                                    </h3>
                                    <div className="grid gap-4">
                                        {layouts.map((layout) => (
                                            <div
                                                key={layout.id}
                                                className={`border rounded-md p-2 cursor-pointer hover:border-purple-500 ${
                                                    pages[currentPage]
                                                        .layout === layout.id
                                                        ? "border-purple-500 ring-2 ring-purple-200"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    changeLayout(layout.id)
                                                }
                                            >
                                                <div
                                                    className={`grid ${layout.template} gap-2 h-24`}
                                                >
                                                    {Array.from({
                                                        length: layout.cells,
                                                    }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="bg-gray-100 rounded-sm flex items-center justify-center"
                                                        >
                                                            <ImageIcon className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-center mt-1">
                                                    {layout.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "filtros" && (
                                <div className="space-y-4">
                                    <h3 className="font-medium">
                                        Filtros de imagen
                                    </h3>
                                    <div className="grid gap-4">
                                        <div
                                            className="p-2 border rounded-md cursor-pointer hover:border-purple-500"
                                            onClick={() => {
                                                if (
                                                    selectedElement &&
                                                    getSelectedElement()
                                                        ?.type === "image"
                                                ) {
                                                    updateImageFilter(
                                                        selectedElement,
                                                        "saturation",
                                                        50
                                                    );
                                                    updateImageFilter(
                                                        selectedElement,
                                                        "contrast",
                                                        50
                                                    );
                                                    updateImageFilter(
                                                        selectedElement,
                                                        "brightness",
                                                        50
                                                    );
                                                }
                                            }}
                                        >
                                            <div className="bg-gray-100 h-24 rounded-sm flex items-center justify-center">
                                                <Camera className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <p className="text-center text-sm mt-2">
                                                Original
                                            </p>
                                        </div>
                                        <div
                                            className="p-2 border rounded-md cursor-pointer hover:border-purple-500"
                                            onClick={() => {
                                                if (
                                                    selectedElement &&
                                                    getSelectedElement()
                                                        ?.type === "image"
                                                ) {
                                                    updateImageFilter(
                                                        selectedElement,
                                                        "saturation",
                                                        0
                                                    );
                                                    updateImageFilter(
                                                        selectedElement,
                                                        "contrast",
                                                        60
                                                    );
                                                    updateImageFilter(
                                                        selectedElement,
                                                        "brightness",
                                                        50
                                                    );
                                                }
                                            }}
                                        >
                                            <div className="bg-gray-100 h-24 rounded-sm flex items-center justify-center">
                                                <Camera className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <p className="text-center text-sm mt-2">
                                                Blanco y Negro
                                            </p>
                                        </div>
                                        <div
                                            className="p-2 border rounded-md cursor-pointer hover:border-purple-500"
                                            onClick={() => {
                                                if (
                                                    selectedElement &&
                                                    getSelectedElement()
                                                        ?.type === "image"
                                                ) {
                                                    updateImageFilter(
                                                        selectedElement,
                                                        "saturation",
                                                        30
                                                    );
                                                    updateImageFilter(
                                                        selectedElement,
                                                        "contrast",
                                                        60
                                                    );
                                                    updateImageFilter(
                                                        selectedElement,
                                                        "tint",
                                                        30
                                                    );
                                                }
                                            }}
                                        >
                                            <div className="bg-gray-100 h-24 rounded-sm flex items-center justify-center">
                                                <Camera className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <p className="text-center text-sm mt-2">
                                                Sepia
                                            </p>
                                        </div>
                                        <div
                                            className="p-2 border rounded-md cursor-pointer hover:border-purple-500"
                                            onClick={() => {
                                                if (
                                                    selectedElement &&
                                                    getSelectedElement()
                                                        ?.type === "image"
                                                ) {
                                                    updateImageFilter(
                                                        selectedElement,
                                                        "saturation",
                                                        70
                                                    );
                                                    updateImageFilter(
                                                        selectedElement,
                                                        "contrast",
                                                        70
                                                    );
                                                    updateImageFilter(
                                                        selectedElement,
                                                        "temperature",
                                                        70
                                                    );
                                                }
                                            }}
                                        >
                                            <div className="bg-gray-100 h-24 rounded-sm flex items-center justify-center">
                                                <Camera className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <p className="text-center text-sm mt-2">
                                                Vintage
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "niveles" && (
                                <div className="space-y-4">
                                    {selectedElement &&
                                    getSelectedElement()?.type === "image" ? (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-sm">
                                                        Exposición
                                                    </label>
                                                    <span className="text-sm text-gray-500">
                                                        {
                                                            getSelectedElement()
                                                                ?.filters
                                                                ?.exposure
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={[
                                                        getSelectedElement()
                                                            ?.filters
                                                            ?.exposure || 50,
                                                    ]}
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    onValueChange={(value) =>
                                                        updateImageFilter(
                                                            selectedElement,
                                                            "exposure",
                                                            value[0]
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-sm">
                                                        Contraste
                                                    </label>
                                                    <span className="text-sm text-gray-500">
                                                        {
                                                            getSelectedElement()
                                                                ?.filters
                                                                ?.contrast
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={[
                                                        getSelectedElement()
                                                            ?.filters
                                                            ?.contrast || 50,
                                                    ]}
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    onValueChange={(value) =>
                                                        updateImageFilter(
                                                            selectedElement,
                                                            "contrast",
                                                            value[0]
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-sm">
                                                        Saturación
                                                    </label>
                                                    <span className="text-sm text-gray-500">
                                                        {
                                                            getSelectedElement()
                                                                ?.filters
                                                                ?.saturation
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={[
                                                        getSelectedElement()
                                                            ?.filters
                                                            ?.saturation || 50,
                                                    ]}
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    onValueChange={(value) =>
                                                        updateImageFilter(
                                                            selectedElement,
                                                            "saturation",
                                                            value[0]
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-sm">
                                                        Temperatura
                                                    </label>
                                                    <span className="text-sm text-gray-500">
                                                        {
                                                            getSelectedElement()
                                                                ?.filters
                                                                ?.temperature
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={[
                                                        getSelectedElement()
                                                            ?.filters
                                                            ?.temperature || 50,
                                                    ]}
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    onValueChange={(value) =>
                                                        updateImageFilter(
                                                            selectedElement,
                                                            "temperature",
                                                            value[0]
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-sm">
                                                        Tono
                                                    </label>
                                                    <span className="text-sm text-gray-500">
                                                        {
                                                            getSelectedElement()
                                                                ?.filters?.tint
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={[
                                                        getSelectedElement()
                                                            ?.filters?.tint ||
                                                            50,
                                                    ]}
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    onValueChange={(value) =>
                                                        updateImageFilter(
                                                            selectedElement,
                                                            "tint",
                                                            value[0]
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-sm">
                                                        Iluminaciones
                                                    </label>
                                                    <span className="text-sm text-gray-500">
                                                        {
                                                            getSelectedElement()
                                                                ?.filters
                                                                ?.brightness
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={[
                                                        getSelectedElement()
                                                            ?.filters
                                                            ?.brightness || 50,
                                                    ]}
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    onValueChange={(value) =>
                                                        updateImageFilter(
                                                            selectedElement,
                                                            "brightness",
                                                            value[0]
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-sm">
                                                        Sombras
                                                    </label>
                                                    <span className="text-sm text-gray-500">
                                                        {
                                                            getSelectedElement()
                                                                ?.filters
                                                                ?.shadows
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                                <Slider
                                                    value={[
                                                        getSelectedElement()
                                                            ?.filters
                                                            ?.shadows || 50,
                                                    ]}
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    onValueChange={(value) =>
                                                        updateImageFilter(
                                                            selectedElement,
                                                            "shadows",
                                                            value[0]
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="pt-4 border-t">
                                                <h4 className="font-medium text-sm mb-2">
                                                    Máscaras
                                                </h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {getCurrentLayout().maskOptions.map(
                                                        (mask) => (
                                                            <button
                                                                key={mask}
                                                                className={`p-2 border rounded text-xs ${
                                                                    getSelectedElement()
                                                                        ?.mask ===
                                                                    mask
                                                                        ? "border-purple-500 bg-purple-50"
                                                                        : ""
                                                                }`}
                                                                onClick={() =>
                                                                    updateImageMask(
                                                                        selectedElement,
                                                                        mask
                                                                    )
                                                                }
                                                            >
                                                                {mask
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    mask.slice(
                                                                        1
                                                                    )}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-40 text-gray-500">
                                            Selecciona una imagen para ajustar
                                            sus niveles
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Área principal de edición */}
                    <div className="flex-1 overflow-auto">
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-4">
                                Comienza a editar
                            </h2>

                            {/* Barra de herramientas */}
                            <div className="flex items-center gap-4 mb-6">
                                <button
                                    className="inline-flex items-center justify-center rounded-full w-10 h-10 border hover:bg-gray-100"
                                    onClick={() => setActiveTab("formas")}
                                >
                                    <Move className="h-5 w-5" />
                                </button>
                                <button
                                    className="inline-flex items-center justify-center rounded-full w-10 h-10 border hover:bg-gray-100"
                                    onClick={undo}
                                    disabled={historyIndex <= 0}
                                >
                                    <Undo2 className="h-5 w-5" />
                                </button>
                                <button
                                    className="inline-flex items-center justify-center rounded-full w-10 h-10 border hover:bg-gray-100"
                                    onClick={redo}
                                    disabled={
                                        historyIndex >= history.length - 1
                                    }
                                >
                                    <Redo2 className="h-5 w-5" />
                                </button>
                                <button
                                    className="inline-flex items-center justify-center rounded-full w-10 h-10 border hover:bg-gray-100"
                                    onClick={deleteSelectedElement}
                                    disabled={!selectedElement}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                                <button
                                    className="inline-flex items-center justify-center rounded-full w-10 h-10 border hover:bg-gray-100"
                                    onClick={addTextElement}
                                    disabled={!getSelectedElementCell()}
                                >
                                    <Type className="h-5 w-5" />
                                </button>

                                {selectedElement &&
                                    getSelectedElement()?.type === "text" && (
                                        <div className="flex items-center gap-2 ml-4">
                                            <div className="relative">
                                                <select
                                                    className="w-32 px-3 py-2 border rounded-md appearance-none"
                                                    value={
                                                        getSelectedElement()
                                                            ?.style
                                                            ?.fontFamily ||
                                                        "Arial"
                                                    }
                                                    onChange={(e) =>
                                                        updateTextStyle(
                                                            "fontFamily",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="Arial">
                                                        Arial
                                                    </option>
                                                    <option value="Times New Roman">
                                                        Times New Roman
                                                    </option>
                                                    <option value="Georgia">
                                                        Georgia
                                                    </option>
                                                    <option value="Verdana">
                                                        Verdana
                                                    </option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                    <svg
                                                        className="w-4 h-4 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <select
                                                    className="w-20 px-3 py-2 border rounded-md appearance-none"
                                                    value={
                                                        getSelectedElement()?.style?.fontSize?.replace(
                                                            "px",
                                                            ""
                                                        ) || "16"
                                                    }
                                                    onChange={(e) =>
                                                        updateTextStyle(
                                                            "fontSize",
                                                            `${e.target.value}px`
                                                        )
                                                    }
                                                >
                                                    <option value="12">
                                                        12
                                                    </option>
                                                    <option value="14">
                                                        14
                                                    </option>
                                                    <option value="16">
                                                        16
                                                    </option>
                                                    <option value="18">
                                                        18
                                                    </option>
                                                    <option value="20">
                                                        20
                                                    </option>
                                                    <option value="24">
                                                        24
                                                    </option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                    <svg
                                                        className="w-4 h-4 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </div>

                                            <div className="inline-flex rounded-md shadow-sm">
                                                <button
                                                    className={`px-3 py-2 text-sm font-medium border ${
                                                        getSelectedElement()
                                                            ?.style
                                                            ?.fontWeight ===
                                                        "bold"
                                                            ? "bg-gray-200"
                                                            : "bg-white"
                                                    } text-gray-700 hover:bg-gray-50`}
                                                    onClick={() =>
                                                        updateTextStyle(
                                                            "fontWeight",
                                                            getSelectedElement()
                                                                ?.style
                                                                ?.fontWeight ===
                                                                "bold"
                                                                ? "normal"
                                                                : "bold"
                                                        )
                                                    }
                                                >
                                                    B
                                                </button>
                                                <button
                                                    className={`px-3 py-2 text-sm font-medium border ${
                                                        getSelectedElement()
                                                            ?.style
                                                            ?.fontStyle ===
                                                        "italic"
                                                            ? "bg-gray-200"
                                                            : "bg-white"
                                                    } text-gray-700 hover:bg-gray-50`}
                                                    onClick={() =>
                                                        updateTextStyle(
                                                            "fontStyle",
                                                            getSelectedElement()
                                                                ?.style
                                                                ?.fontStyle ===
                                                                "italic"
                                                                ? "normal"
                                                                : "italic"
                                                        )
                                                    }
                                                >
                                                    I
                                                </button>
                                                <button
                                                    className={`px-3 py-2 text-sm font-medium border ${
                                                        getSelectedElement()
                                                            ?.style
                                                            ?.textDecoration ===
                                                        "underline"
                                                            ? "bg-gray-200"
                                                            : "bg-white"
                                                    } text-gray-700 hover:bg-gray-50`}
                                                    onClick={() =>
                                                        updateTextStyle(
                                                            "textDecoration",
                                                            getSelectedElement()
                                                                ?.style
                                                                ?.textDecoration ===
                                                                "underline"
                                                                ? "none"
                                                                : "underline"
                                                        )
                                                    }
                                                >
                                                    U
                                                </button>
                                            </div>

                                            <div className="h-6 border-l mx-2"></div>

                                            <div className="inline-flex rounded-md shadow-sm">
                                                <button
                                                    className={`px-3 py-2 text-sm font-medium border ${
                                                        getSelectedElement()
                                                            ?.style
                                                            ?.textAlign ===
                                                        "left"
                                                            ? "bg-gray-200"
                                                            : "bg-white"
                                                    } text-gray-700 hover:bg-gray-50`}
                                                    onClick={() =>
                                                        updateTextStyle(
                                                            "textAlign",
                                                            "left"
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        width="15"
                                                        height="15"
                                                        viewBox="0 0 15 15"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM2 7.5C2 7.22386 2.22386 7 2.5 7H7.5C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8H2.5C2.22386 8 2 7.77614 2 7.5ZM2 10.5C2 10.2239 2.22386 10 2.5 10H10.5C10.7761 10 11 10.2239 11 10.5C11 10.7761 10.7761 11 10.5 11H2.5C2.22386 11 2 10.7761 2 10.5Z"
                                                            fill="currentColor"
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                        ></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    className={`px-3 py-2 text-sm font-medium border ${
                                                        getSelectedElement()
                                                            ?.style
                                                            ?.textAlign ===
                                                        "center"
                                                            ? "bg-gray-200"
                                                            : "bg-white"
                                                    } text-gray-700 hover:bg-gray-50`}
                                                    onClick={() =>
                                                        updateTextStyle(
                                                            "textAlign",
                                                            "center"
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        width="15"
                                                        height="15"
                                                        viewBox="0 0 15 15"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM3.5 7C3.22386 7 3 7.22386 3 7.5C3 7.77614 3.22386 8 3.5 8H11.5C11.7761 8 12 7.77614 12 7.5C12 7.22386 11.7761 7 11.5 7H3.5ZM2 10.5C2 10.2239 2.22386 10 2.5 10H12.5C12.7761 10 13 10.2239 13 10.5C13 10.7761 12.7761 11 12.5 11H2.5C2.22386 11 2 10.7761 2 10.5Z"
                                                            fill="currentColor"
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                        ></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    className={`px-3 py-2 text-sm font-medium border ${
                                                        getSelectedElement()
                                                            ?.style
                                                            ?.textAlign ===
                                                        "right"
                                                            ? "bg-gray-200"
                                                            : "bg-white"
                                                    } text-gray-700 hover:bg-gray-50`}
                                                    onClick={() =>
                                                        updateTextStyle(
                                                            "textAlign",
                                                            "right"
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        width="15"
                                                        height="15"
                                                        viewBox="0 0 15 15"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM7 7.5C7 7.22386 7.22386 7 7.5 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H7.5C7.22386 8 7 7.77614 7 7.5ZM4 10.5C4 10.2239 4.22386 10 4.5 10H12.5C12.7761 10 13 10.2239 13 10.5C13 10.7761 12.7761 11 12.5 11H4.5C4.22386 11 4 10.7761 4 10.5Z"
                                                            fill="currentColor"
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                        ></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                <div className="ml-auto flex items-center gap-4">
                                    <button className="inline-flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-md">
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 15 15"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                        >
                                            <path
                                                d="M7.5 0.875C7.77614 0.875 8 1.09886 8 1.375V3H10.5C10.7761 3 11 3.22386 11 3.5C11 3.77614 10.7761 4 10.5 4H8V7H9.5C9.77614 7 10 7.22386 10 7.5C10 7.77614 9.77614 8 9.5 8H8V13.625C8 13.9011 7.77614 14.125 7.5 14.125C7.22386 14.125 7 13.9011 7 13.625V8H5.5C5.22386 8 5 7.77614 5 7.5C5 7.22386 5.22386 7 5.5 7H7V4H4.5C4.22386 4 4 3.77614 4 3.5C4 3.22386 4.22386 3 4.5 3H7V1.375C7 1.09886 7.22386 0.875 7.5 0.875Z"
                                                fill="currentColor"
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        Descripción
                                    </button>
                                    <button className="inline-flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-md">
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 15 15"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                        >
                                            <path
                                                d="M13.3536 2.35355C13.5488 2.15829 13.5488 1.84171 13.3536 1.64645C13.1583 1.45118 12.8417 1.45118 12.6464 1.64645L10.6828 3.61012C9.70652 3.21671 8.63759 3 7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C0.902945 9.08812 2.02314 10.1861 3.36061 10.9323L1.64645 12.6464C1.45118 12.8417 1.45118 13.1583 1.64645 13.3536C1.84171 13.5488 2.15829 13.5488 2.35355 13.3536L4.31723 11.3899C5.29348 11.7833 6.36241 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C14.0971 5.9119 12.9769 4.81391 11.6394 4.06771L13.3536 2.35355ZM9.90428 4.38861C9.15332 4.1361 8.34759 4 7.5 4C4.80285 4 2.52952 5.37816 1.09622 7.5C1.87284 8.6497 2.89609 9.56293 4.09974 10.1436L5.06334 9.18C4.70366 8.59872 4.5 7.91372 4.5 7.18C4.5 5.17153 6.12386 3.5 8.13233 3.5C8.86605 3.5 9.55105 3.70366 10.1323 4.06334L9.90428 4.38861ZM7.5 11C10.1971 11 12.4705 9.62184 13.9038 7.5C13.1272 6.3503 12.1039 5.43707 10.9003 4.85645L9.93666 5.82001C10.2963 6.40128 10.5 7.08628 10.5 7.82001C10.5 9.82847 8.87614 11.5 6.86767 11.5C6.13395 11.5 5.44895 11.2963 4.86767 10.9367L5.09572 10.6114C5.84668 10.8639 6.65241 11 7.5 11ZM8.5 7.82001C8.5 8.64591 7.82591 9.32001 7 9.32001C6.17409 9.32001 5.5 8.64591 5.5 7.82001C5.5 6.9941 6.17409 6.32001 7 6.32001C7.82591 6.32001 8.5 6.9941 8.5 7.82001Z"
                                                fill="currentColor"
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        Vista previa
                                    </button>
                                </div>
                            </div>

                            {/* Área de edición */}
                            <div className="grid grid-cols-1 gap-8">
                                {/* Plantilla actual */}
                                <div className="border rounded-lg p-4 bg-white">
                                    <div className="aspect-video">
                                        {pages[currentPage].layout ===
                                        "layout-1" ? (
                                            <PlantillaCuatroHuecos
                                                onSelect={handleCeldaSelect}
                                                selectedCelda={selectedCelda}
                                            />
                                        ) : (
                                            <div
                                                className={`grid ${
                                                    getCurrentLayout().template
                                                } gap-4 h-full`}
                                            >
                                                {pages[currentPage].cells.map(
                                                    (cell) => (
                                                        <LayoutCell
                                                            key={cell.id}
                                                            id={cell.id}
                                                            elements={
                                                                cell.elements
                                                            }
                                                            onSelectElement={
                                                                setSelectedElement
                                                            }
                                                            selectedElement={
                                                                selectedElement
                                                            }
                                                            onDropImage={
                                                                handleImageUpload
                                                            }
                                                            onUpdateText={
                                                                updateText
                                                            }
                                                            onMoveElement={
                                                                moveElement
                                                            }
                                                            onUpdateImageFilter={
                                                                updateImageFilter
                                                            }
                                                            onChangeMask={
                                                                updateImageMask
                                                            }
                                                            availableMasks={
                                                                getCurrentLayout()
                                                                    .maskOptions
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Selector de máscaras */}
                                <MascaraSelector
                                    onSelect={handleMaskSelect}
                                    selectedMask={selectedMask}
                                />

                                {/* Zona para arrastrar archivos */}
                                <FileDropZone
                                    onDrop={(file) => {
                                        if (
                                            selectedElement &&
                                            getSelectedElement()?.type ===
                                                "image"
                                        ) {
                                            handleImageUpload(
                                                selectedElement,
                                                file
                                            );
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar derecho - Navegación de páginas */}
                    <aside className="w-48 border-l p-4 overflow-y-auto">
                        <div className="space-y-4">
                            <h3 className="font-medium">Páginas</h3>
                            <div className="grid gap-3">
                                {pages.map((page, index) => (
                                    <PageThumbnail
                                        key={page.id}
                                        page={page}
                                        index={index}
                                        currentPage={currentPage}
                                        onClick={setCurrentPage}
                                    />
                                ))}
                                <button
                                    className="border border-dashed rounded-md p-2 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                    onClick={addPage}
                                >
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                    >
                                        <path
                                            d="M7.5 1C7.77614 1 8 1.22386 8 1.5V7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H8V13.5C8 13.7761 7.77614 14 7.5 14C7.22386 14 7 13.7761 7 13.5V8H1.5C1.22386 8 1 7.77614 1 7.5C1 7.22386 1.22386 7 1.5 7H7V1.5C7 1.22386 7.22386 1 7.5 1Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    Añadir página
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            <DragLayer />
        </DndProvider>
    );
}
