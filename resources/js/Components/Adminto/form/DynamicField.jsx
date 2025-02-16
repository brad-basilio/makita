import React, { useState } from "react";

const DynamicField = ({ label, structure, onChange, typeOptions = [] }) => {
    const [fields, setFields] = useState([]);

    const handleAdd = () => {
        if (typeof structure === "object") {
            setFields([...fields, { ...structure }]);
        } else {
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
            newFields[index][key] = value;
        } else {
            newFields[index] = value;
        }
        setFields(newFields);
        onChange(newFields);
    };

    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>

            {fields.map((field, index) => {
                const isLastOdd = fields.length % 2 !== 0 && index === fields.length - 1;
                return (
                    <div key={index} className="row g-2 mb-2">
                        {typeof field === "object" ? (
                            Object.keys(structure).map((key) => (
                                <div key={key} className={isLastOdd ? "col-9" : "col-6"}>
                                    {key === "type" ? (
                                        <select
                                            className="form-select"
                                            value={field[key]}
                                            onChange={(e) => handleFieldChange(index, key, e.target.value)}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {typeOptions.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={field[key]}
                                            onChange={(e) => handleFieldChange(index, key, e.target.value)}
                                            placeholder={key}
                                        />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className={isLastOdd ? "col-9" : "col-6"}>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={field}
                                    onChange={(e) => handleFieldChange(index, null, e.target.value)}
                                    placeholder="Característica"
                                />
                            </div>
                        )}
                        <div className="col-3">
                            <button type="button" className="btn btn-danger w-100" onClick={() => handleRemove(index)}>
                                X
                            </button>
                        </div>
                    </div>
                );
            })}

            <button type="button" className="btn btn-primary" onClick={handleAdd}>
                + Agregar
            </button>
        </div>
    );
};

export default DynamicField;
