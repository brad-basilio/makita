"use client";

export default function FontSelector({ fonts, onSelect }) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">Fuente</label>
            <select
                className="w-full p-2 border rounded"
                onChange={(e) => onSelect(e.target.value)}
            >
                {fonts.map((font) => (
                    <option
                        key={font}
                        value={font}
                        style={{ fontFamily: font }}
                    >
                        {font}
                    </option>
                ))}
            </select>
        </div>
    );
}
