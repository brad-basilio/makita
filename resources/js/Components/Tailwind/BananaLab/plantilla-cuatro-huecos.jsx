"use client";

import { useState } from "react";
import CeldaEditable from "./celda-editable";

export default function PlantillaCuatroHuecos({ onSelect, selectedCelda }) {
    const [celdas, setCeldas] = useState([
        { id: "celda-1", content: null },
        { id: "celda-2", content: null },
        { id: "celda-3", content: null },
        { id: "celda-4", content: null },
    ]);

    const handleCeldaSelect = (celdaId) => {
        onSelect && onSelect(celdaId);
    };

    const handleImageUpload = (celdaId, imageElement) => {
        setCeldas(
            celdas.map((celda) =>
                celda.id === celdaId
                    ? {
                          ...celda,
                          content: {
                              ...celda.content,
                              image: imageElement,
                          },
                      }
                    : celda
            )
        );
    };

    const handleTextChange = (celdaId, textElement) => {
        setCeldas(
            celdas.map((celda) =>
                celda.id === celdaId
                    ? {
                          ...celda,
                          content: {
                              ...celda.content,
                              text: textElement,
                          },
                      }
                    : celda
            )
        );
    };

    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
            {celdas.map((celda) => (
                <CeldaEditable
                    key={celda.id}
                    id={celda.id}
                    onImageUpload={(imageElement) =>
                        handleImageUpload(celda.id, imageElement)
                    }
                    onTextChange={(textElement) =>
                        handleTextChange(celda.id, textElement)
                    }
                    onSelect={handleCeldaSelect}
                    isSelected={selectedCelda === celda.id}
                    initialContent={celda.content}
                />
            ))}
        </div>
    );
}
