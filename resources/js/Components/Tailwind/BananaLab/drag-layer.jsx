"use client";

import { useDragLayer } from "react-dnd";

export default function DragLayer() {
    const { itemType, isDragging, item, currentOffset } = useDragLayer(
        (monitor) => ({
            item: monitor.getItem(),
            itemType: monitor.getItemType(),
            currentOffset: monitor.getSourceClientOffset(),
            isDragging: monitor.isDragging(),
        })
    );

    if (!isDragging) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                pointerEvents: "none",
                zIndex: 100,
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: currentOffset?.x,
                    top: currentOffset?.y,
                    opacity: 0.8,
                }}
            >
                {itemType === "IMAGE" && (
                    <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-500">Imagen</span>
                    </div>
                )}
                {itemType === "TEXT" && (
                    <div className="px-4 py-2 bg-gray-200 rounded-md">
                        <span className="text-xs text-gray-500">Texto</span>
                    </div>
                )}
                {itemType === "IMAGE_ELEMENT" && (
                    <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-500">Imagen</span>
                    </div>
                )}
                {itemType === "TEXT_ELEMENT" && (
                    <div className="px-4 py-2 bg-gray-200 rounded-md">
                        <span className="text-xs text-gray-500">Texto</span>
                    </div>
                )}
            </div>
        </div>
    );
}
