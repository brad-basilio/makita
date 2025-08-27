import React, { useState, useEffect, useRef  } from "react";

const DynamicField = ({ label, structure, value = [], onChange, typeOptions = [] }) => {
    
    const [fields, setFields] = useState([]);
    const isInitialMount = useRef(true);
   
    // useEffect(() => {
    //     // if (JSON.stringify(value) !== JSON.stringify(fields)) {
    //     //     setFields(value);
    //     // }
    //     const normalizedValues = value.map(item => ({
    //         ...item,
    //         type: item.type?.charAt(0).toUpperCase() + item.type?.slice(1).toLowerCase()
    //     }));
    //     setFields(normalizedValues);
    // }, [value])

    useEffect(() => {
        if (isInitialMount.current) {
            // Solo ejecuta en el primer render
            const normalizedValues = value.map(item => ({
                ...item,
                type: item.type?.charAt(0).toUpperCase() + item.type?.slice(1).toLowerCase()
            }));
            setFields(normalizedValues);
            isInitialMount.current = false;
        } else {
            // Actualización normal, compara antes de actualizar
            if (JSON.stringify(value) !== JSON.stringify(fields)) {
                const normalizedValues = value.map(item => ({
                    ...item,
                    type: item.type?.charAt(0).toUpperCase() + item.type?.slice(1).toLowerCase()
                }));
                setFields(normalizedValues);
            }
        }
    }, [value]);

    const handleAdd = () => {
        // if (typeof structure === "object") {
        //     setFields([...fields, { ...structure }]);
        // } else {
        //     setFields([...fields, ""]);
        // }
        const newFields = [...fields, { ...structure }];
        setFields(newFields);
        onChange([...fields, structure])
    };

    const handleRemove = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
        onChange(newFields);
    };

    const handleFieldChange = (index, key, value) => {
        const newFields = [...fields];
        // if (typeof newFields[index] === "object") {
        //     newFields[index][key] = value;
        // } else {
        //     newFields[index] = value;
        // }
        newFields[index][key] = key === 'type' 
            ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
            : value;

        setFields(newFields);
        onChange(newFields);
    };

    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>

            {fields.map((field, index) => {
                const isLastOdd = fields.length % 2 !== 0 && index === fields.length - 1;
                const isGeneralSpec = structure.hasOwnProperty('description') && Object.keys(structure).length === 1;
                const isTechnicalSpec = structure.hasOwnProperty('title') && structure.hasOwnProperty('description') && structure.hasOwnProperty('tooltip');
                
                return (
                    <div key={index} className="mb-3 p-3 border rounded position-relative" style={{ backgroundColor: '#ffffff', border: '1px solid #dee2e6' }}>
                        <div className="row">
                            {typeof field === "object" ? (
                                <div className="col-12">
                                    {isGeneralSpec ? (
                                        // Especificaciones Generales: solo descripción
                                        <div className="mb-2">
                                            <label className="form-label text-muted mb-1" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                                Descripción
                                            </label>
                                            <textarea
                                                className="form-control"
                                                value={field.description || ""}
                                                onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                                                placeholder="Ingrese la descripción general"
                                                rows={4}
                                                style={{ 
                                                    minHeight: '120px', 
                                                    maxHeight: '200px', 
                                                    resize: 'vertical'
                                                }}
                                            />
                                        </div>
                                    ) : isTechnicalSpec ? (
                        // Especificaciones Técnicas: título, descripción y tooltip
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-muted mb-1" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                    Título
                                </label>
                                <textarea
                                    className="form-control"
                                    value={field.title || ""}
                                    onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                                    placeholder="Título de la especificación"
                                    rows={2}
                                    style={{ 
                                        minHeight: '60px', 
                                        maxHeight: '100px', 
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-muted mb-1" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                    Descripción
                                </label>
                                <textarea
                                    className="form-control"
                                    value={field.description || ""}
                                    onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                                    placeholder="Descripción técnica detallada"
                                    rows={3}
                                    style={{ 
                                        minHeight: '80px', 
                                        maxHeight: '150px', 
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                            <div className="col-12 mb-2">
                                <label className="form-label text-muted mb-1" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                    Tooltip (información adicional)
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={field.tooltip || ""}
                                    onChange={(e) => handleFieldChange(index, 'tooltip', e.target.value)}
                                    placeholder="Información adicional que aparecerá en tooltip"
                                />
                            </div>
                        </div>
                                    ) : (
                                        // Estructura genérica para otros casos
                                        <div className="row">
                                            {Object.keys(structure).map((key) => (
                                                <div key={key} className="col-md-6 mb-2">
                                                    <label className="form-label text-muted mb-1" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                                        {key === 'type' ? 'Tipo' : key.charAt(0).toUpperCase() + key.slice(1)}
                                                    </label>
                                                    {key === "type" ? (
                                                        <select
                                                            className="form-select"
                                                            value={field[key] || ""}
                                                            onChange={(e) => handleFieldChange(index, key, e.target.value)}
                                                        >
                                                            <option value="">Seleccionar tipo</option>
                                                            {typeOptions.map((option) => (
                                                                <option key={option} value={option}>{option}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <textarea
                                                            className="form-control"
                                                            value={field[key] || ""}
                                                            onChange={(e) => handleFieldChange(index, key, e.target.value)}
                                                            placeholder={`Ingrese ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                                            rows={4}
                                                            style={{ 
                                                                minHeight: '120px', 
                                                                maxHeight: '200px', 
                                                                resize: 'vertical'
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="col-12 mb-2">
                                    <label className="form-label text-muted mb-1" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                        Característica
                                    </label>
                                    <textarea
                                        className="form-control"
                                        value={field}
                                        onChange={(e) => handleFieldChange(index, null, e.target.value)}
                                        placeholder="Describe la característica del producto"
                                        rows={4}
                                        style={{ 
                                            minHeight: '120px', 
                                            maxHeight: '200px', 
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                            )}
                            
                            {/* Botón eliminar flotante */}
                            <button
                                type="button"
                                className="btn btn-danger btn-sm rounded-circle position-absolute"
                                style={{
                                    top: '8px',
                                    right: '8px',
                                    width: '28px',
                                    height: '28px',
                                    padding: '0',
                                    zIndex: 10,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                                onClick={() => handleRemove(index)}
                                title="Eliminar campo"
                            >
                                <i className="mdi mdi-close" style={{ fontSize: '14px', color: 'white' }}></i>
                            </button>
                        </div>
                    </div>
                );
            })}

            <div className="text-center mt-3">
                <button 
                    type="button" 
                    className="btn btn-primary px-4 py-2" 
                    onClick={handleAdd}
                >
                    <i className="mdi mdi-plus me-2"></i>
                    Agregar
                </button>
            </div>
        </div>
    );
};

export default DynamicField;
