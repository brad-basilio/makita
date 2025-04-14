"use client";

export default function MascaraSelector({ onSelect, selectedMask = "none" }) {
    const mascaras = [
        { id: "none", name: "Sin máscara" },
        { id: "circle", name: "Círculo" },
        { id: "heart", name: "Corazón" },
        { id: "star", name: "Estrella" },
        { id: "hexagon", name: "Hexágono" },
    ];

    return (
        <div className="space-y-4">
            <h3 className="font-medium">Máscaras de imagen</h3>
            <div className="grid grid-cols-2 gap-3">
                {mascaras.map((mascara) => (
                    <div
                        key={mascara.id}
                        className={`border rounded-md p-2 cursor-pointer hover:border-purple-500 transition-colors
              ${
                  selectedMask === mascara.id
                      ? "border-purple-500 ring-2 ring-purple-200"
                      : ""
              }
            `}
                        onClick={() => onSelect(mascara.id)}
                    >
                        <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-2">
                            <div
                                className={`w-16 h-16 bg-purple-300 ${
                                    mascara.id === "circle"
                                        ? "rounded-full"
                                        : mascara.id === "heart"
                                        ? "mask-heart"
                                        : mascara.id === "star"
                                        ? "mask-star"
                                        : mascara.id === "hexagon"
                                        ? "mask-hexagon"
                                        : ""
                                }`}
                            ></div>
                        </div>
                        <p className="text-center text-sm">{mascara.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
