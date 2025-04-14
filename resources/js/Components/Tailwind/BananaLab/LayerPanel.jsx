"use client";

export default function LayerPanel({
    pages,
    currentPage,
    selectedElement,
    onSelectElement,
    onSelectPage,
    onBringToFront,
    onSendToBack,
    onDuplicate,
    onDelete,
}) {
    return (
        <div className="fixed right-4 bottom-20 w-64 bg-white shadow-xl rounded-lg border p-4 z-50">
            <h3 className="font-medium mb-3">Capas</h3>

            <div className="space-y-2 mb-4">
                {pages[currentPage].cells.flatMap((cell) =>
                    cell.elements.map((element) => (
                        <div
                            key={element.id}
                            className={`p-2 border rounded flex items-center justify-between cursor-pointer
                ${
                    selectedElement === element.id
                        ? "bg-purple-50 border-purple-300"
                        : ""
                }
              `}
                            onClick={() => onSelectElement(element.id)}
                        >
                            <span className="text-sm">
                                {element.type === "image" ? "Imagen" : "Texto"}
                            </span>
                            <div className="flex gap-1">
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <Eye size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-between border-t pt-3">
                <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={onBringToFront}
                    disabled={!selectedElement}
                >
                    <Layers size={16} />
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={onSendToBack}
                    disabled={!selectedElement}
                >
                    <Layers size={16} />
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={onDuplicate}
                    disabled={!selectedElement}
                >
                    <Copy size={16} />
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded text-red-500"
                    onClick={onDelete}
                    disabled={!selectedElement}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
