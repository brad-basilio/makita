"use client";
import { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ImageIcon, Grip, X } from "lucide-react";

const CeldaEditable = ({
    id,
    onImageUpload,
    onTextChange,
    onSelect,
    isSelected,
    initialContent = null,
}) => {
    const [elements, setElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const celdaRef = useRef(null);

    // Efecto para inicializar elementos
    useEffect(() => {
        if (initialContent) {
            const initElements = [];
            if (initialContent.image) initElements.push(initialContent.image);
            if (initialContent.text) initElements.push(initialContent.text);
            setElements(initElements);
        }
    }, [initialContent]);

    // Configuración de drag and drop
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ["IMAGE_FILE", "TEXT_ELEMENT", "IMAGE_ELEMENT"],
        drop: (item, monitor) => {
            if (monitor.didDrop()) return;

            const celdaRect = celdaRef.current.getBoundingClientRect();
            const clientOffset = monitor.getClientOffset();

            const position = {
                x: clientOffset.x - celdaRect.left,
                y: clientOffset.y - celdaRect.top,
            };

            if (item.type === "IMAGE_FILE" && item.files) {
                handleImageDrop(item.files[0], position);
            } else if (item.type === "TEXT_ELEMENT") {
                handleTextDrop(position);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver({ shallow: true }),
        }),
    }));

    // Manejar la subida de imágenes
    const handleImageDrop = (file, position) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                const newElement = {
                    id: `img-${Date.now()}`,
                    type: "image",
                    content: e.target.result,
                    position,
                    filters: {
                        brightness: 50,
                        contrast: 50,
                        saturation: 50,
                        tint: 0,
                    },
                    mask: "none",
                };

                setElements([...elements, newElement]);
                setSelectedElement(newElement.id);
                onImageUpload?.(newElement);
            }
        };
        reader.readAsDataURL(file);
    };

    // Manejar la adición de texto
    const handleTextDrop = (position) => {
        const newElement = {
            id: `text-${Date.now()}`,
            type: "text",
            content: "Haz clic para editar",
            position,
            style: {
                fontSize: 16,
                fontFamily: "Arial",
                color: "#000000",
                fontWeight: "normal",
                fontStyle: "normal",
                textDecoration: "none",
            },
        };

        setElements([...elements, newElement]);
        setSelectedElement(newElement.id);
        onTextChange?.(newElement);
    };

    // ... (resto de funciones de manejo)

    return (
        <div
            ref={(el) => {
                celdaRef.current = el;
                drop(el);
            }}
            className={`relative aspect-square bg-gray-50 rounded-md flex items-center justify-center overflow-hidden
        ${isSelected ? "ring-2 ring-purple-500" : ""}
        ${isOver ? "border-2 border-dashed border-purple-500" : ""}
      `}
            onClick={() => {
                onSelect?.(id);
                setSelectedElement(null);
            }}
        >
            {elements.length === 0 && (
                <div className="flex flex-col items-center justify-center text-gray-400 p-4">
                    <ImageIcon className="h-8 w-8 mb-2" />
                    <p className="text-xs text-center">
                        Arrastra una imagen o texto aquí
                    </p>
                </div>
            )}

            {elements.map((element) => (
                <div key={element.id} className="absolute">
                    {element.type === "image" ? (
                        <ImageElement
                            element={element}
                            isSelected={selectedElement === element.id}
                            onSelect={(e) => {
                                e.stopPropagation();
                                setSelectedElement(element.id);
                            }}
                            onUpdate={(updates) => {
                                const updatedElements = elements.map((el) =>
                                    el.id === element.id
                                        ? { ...el, ...updates }
                                        : el
                                );
                                setElements(updatedElements);
                            }}
                        />
                    ) : (
                        <TextElement
                            element={element}
                            isSelected={selectedElement === element.id}
                            onSelect={(e) => {
                                e.stopPropagation();
                                setSelectedElement(element.id);
                            }}
                            onUpdate={(content) => {
                                const updatedElements = elements.map((el) =>
                                    el.id === element.id
                                        ? { ...el, content }
                                        : el
                                );
                                setElements(updatedElements);
                                onTextChange?.({ ...element, content });
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

// ... (Componentes ImageElement y TextElement mejorados)

export default CeldaEditable;
