import React, { useState } from "react";

const DynamicField = ({ label, structure, onChange, typeOptions = [] }) => {
    const [fields, setFields] = useState([]);

    const handleAdd = () => {
        if (typeof structure === "object") {
            // Especificaciones: Se agregan como objetos con valores vacíos
            setFields([...fields, { ...structure }]);
        } else {
            // Características: Se agregan como strings vacíos
            setFields([...fields, ""]);
        }
    };

    const handleRemove = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
        onChange(newFields);
    };

    const handleFieldChange = (index, key, value) => {
        const newFields = [...fields];
        if (typeof newFields[index] === "object") {
            // Si es un objeto (especificaciones)
            newFields[index][key] = value;
        } else {
            // Si es un string (características)
            newFields[index] = value;
        }
        setFields(newFields);
        onChange(newFields);
    };

    return (
        <div className="mb-3">
            <label>{label}</label>
            {fields.map((field, index) => (
                <div key={index} className="d-flex flex-column mb-2">
                    {typeof field === "object" ? (
                        // Para especificaciones (inputs con claves)
                        Object.keys(structure).map((key) => (
                            key === "type" ? (
                                // Si el key es "type", mostrar un <select>
                                <select
                                    key={key}
                                    className="form-control mb-1"
                                    value={field[key]}
                                    onChange={(e) => handleFieldChange(index, key, e.target.value)}
                                >
                                    <option value="">Seleccionar...</option>
                                    {typeOptions.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                // Para los demás campos, mostrar <input>
                                <input
                                    key={key}
                                    type="text"
                                    className="form-control mb-1"
                                    value={field[key]}
                                    onChange={(e) => handleFieldChange(index, key, e.target.value)}
                                    placeholder={key}
                                />
                            )
                        ))
                    ) : (
                        // Para características (solo input de texto)
                        <input
                            type="text"
                            className="form-control"
                            value={field}
                            onChange={(e) => handleFieldChange(index, null, e.target.value)}
                            placeholder="Característica"
                        />
                    )}
                    <button type="button" className="btn btn-danger" onClick={() => handleRemove(index)}>
                        X
                    </button>
                </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={handleAdd}>
                + Agregar
            </button>
        </div>
    );
};

export default DynamicField;
