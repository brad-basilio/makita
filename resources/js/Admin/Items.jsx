import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";
import ItemsRest from "../Actions/Admin/ItemsRest";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";
import SelectAPIFormGroup from "../Components/Adminto/form/SelectAPIFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import Number2Currency from "../Utils/Number2Currency";
import ReactAppend from "../Utils/ReactAppend";
import SetSelectValue from "../Utils/SetSelectValue";
import ItemsGalleryRest from "../Actions/Admin/ItemsGalleryRest";
import DynamicField from "../Components/Adminto/form/DynamicField";
import ModalImportItem from "./Components/ModalImportItem";

const itemsRest = new ItemsRest();

const Items = ({ categories, brands, collections }) => {
    //!FALTA EDIT AND DELETEDE GALERIA

    const [itemData, setItemData] = useState([]);

    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref

    const idRef = useRef();
    const categoryRef = useRef();
    const familyRef = useRef();
    const platformRef = useRef();
    const applicationsRef = useRef();
    const symbologiesRef = useRef();
    const technologiesRef = useRef();
    const nameRef = useRef();
    const summaryRef = useRef();
    const priceRef = useRef();
    const discountRef = useRef();
    //const tagsRef = useRef();

    const imageRef = useRef();
    const textureRef = useRef();
    const descriptionRef = useRef();
    // Nuevos campos

    const stockRef = useRef();

    const featuresRef = useRef([]);

    const specificationsRef = useRef([]);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedFamily, setSelectedFamily] = useState(null);
    /*ADD NEW LINES GALLERY */

    const [gallery, setGallery] = useState([]);
    const galleryRef = useRef();

    /*ADD NEW LINES DOWNLOADABLES */
    const [downloadables, setDownloadables] = useState([]);
    const downloadablesRef = useRef();

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setGallery((prev) => [...prev, ...newImages]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setGallery((prev) => [...prev, ...newImages]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeGalleryImage = (e, index) => {
        e.preventDefault();
        const image = gallery[index];
        if (image.id) {
            // Si la imagen tiene ID, significa que está guardada en la base de datos.
            setGallery((prev) =>
                prev.map((img, i) =>
                    i === index ? { ...img, toDelete: true } : img
                )
            );
        } else {
            // Si es una imagen nueva, simplemente la eliminamos.
            setGallery((prev) => prev.filter((_, i) => i !== index));
        }
    };

    // Funciones para manejar archivos descargables
    const handleDownloadablesChange = (e) => {
        const files = Array.from(e.target.files);
        const maxFileSize = 10 * 1024 * 1024; // 10MB en bytes
        
        const validFiles = [];
        const oversizedFiles = [];
        
        files.forEach((file) => {
            if (file.size > maxFileSize) {
                oversizedFiles.push(file.name);
            } else {
                validFiles.push({
                    file,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                });
            }
        });
        
        if (oversizedFiles.length > 0) {
            Swal.fire({
                title: "Archivos muy pesados",
                html: `Los siguientes archivos exceden el límite de 10MB y no se pueden subir:<br><br><strong>${oversizedFiles.join('<br>')}</strong><br><br>Por favor, comprime los archivos o utiliza un servicio de almacenamiento en la nube.`,
                icon: "warning",
                confirmButtonText: "Entendido"
            });
        }
        
        if (validFiles.length > 0) {
            setDownloadables((prev) => [...prev, ...validFiles]);
        }
    };

    const handleDownloadablesDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const maxFileSize = 10 * 1024 * 1024; // 10MB en bytes
        
        const validFiles = [];
        const oversizedFiles = [];
        
        files.forEach((file) => {
            if (file.size > maxFileSize) {
                oversizedFiles.push(file.name);
            } else {
                validFiles.push({
                    file,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                });
            }
        });
        
        if (oversizedFiles.length > 0) {
            Swal.fire({
                title: "Archivos muy pesados",
                html: `Los siguientes archivos exceden el límite de 10MB y no se pueden subir:<br><br><strong>${oversizedFiles.join('<br>')}</strong><br><br>Por favor, comprime los archivos o utiliza un servicio de almacenamiento en la nube.`,
                icon: "warning",
                confirmButtonText: "Entendido"
            });
        }
        
        if (validFiles.length > 0) {
            setDownloadables((prev) => [...prev, ...validFiles]);
        }
    };

    const removeDownloadableFile = (e, index) => {
        e.preventDefault();
        const file = downloadables[index];
        if (file.id) {
            // Si el archivo tiene ID, significa que está guardado en la base de datos.
            setDownloadables((prev) =>
                prev.map((f, i) =>
                    i === index ? { ...f, toDelete: true } : f
                )
            );
        } else {
            // Si es un archivo nuevo, simplemente lo eliminamos.
            setDownloadables((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'mdi-file-pdf';
            case 'doc':
            case 'docx':
                return 'mdi-file-word';
            case 'xls':
            case 'xlsx':
                return 'mdi-file-excel';
            case 'ppt':
            case 'pptx':
                return 'mdi-file-powerpoint';
            case 'zip':
            case 'rar':
                return 'mdi-folder-zip';
            case 'txt':
                return 'mdi-file-document';
            default:
                return 'mdi-file';
        }
    };

    /*************************/

    useEffect(() => {
        if (itemData && itemData.images) {
            const existingImages = itemData.images.map((img) => ({
                id: img.id, // ID de la imagen en la BD
                url: `/storage/images/item/${img.url}`, // Ruta de la imagen almacenada
            }));
            setGallery(existingImages);
        }
        
        if (itemData && itemData.downloadables) {
            const existingFiles = itemData.downloadables.map((file) => ({
                id: file.id, // ID del archivo en la BD
                name: file.original_name || file.name,
                url: `/storage/images/downloads/item/${file.url}`,
                size: file.size || 0,
                type: file.mime_type || 'application/octet-stream',
            }));
            setDownloadables(existingFiles);
        }
    }, [itemData]);

    const onModalOpen = (data) => {
        console.log('data total', data);
        setItemData(data || null); // Guardamos los datos en el estado
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id || "";
        $(categoryRef.current)
            .val(data?.category_id || null)
            .trigger("change");
        SetSelectValue(
            familyRef.current,
            data?.family?.id,
            data?.family?.name
        );
        SetSelectValue(
            platformRef.current,
            data?.platform?.id,
            data?.platform?.name
        );
        SetSelectValue(applicationsRef.current, data?.applications ?? [], "id", "name");
        SetSelectValue(symbologiesRef.current, data?.symbologies ?? [], "id", "name");
        SetSelectValue(technologiesRef.current, data?.technologies ?? [], "id", "name");
        nameRef.current.value = data?.name || "";
        summaryRef.current.value = data?.summary || "";
        priceRef.current.value = data?.price || 0;
        discountRef.current.value = data?.discount || 0;

       // SetSelectValue(tagsRef.current, data?.tags ?? [], "id", "name");


        imageRef.current.value = null;

        imageRef.image.src = `/storage/images/item/${data?.image ?? "undefined"
            }`;

        descriptionRef.editor.root.innerHTML = data?.description ?? "";

        //TODO: Cargar las imágenes existentes de la galería

        // Cargar las imágenes de la galería
        if (data?.images) {
            const existingImages = data.images.map((img) => ({
                id: img.id, // ID de la imagen en la base de datos
                url: `/api/items/gallery/media/${img.url}`, // Ruta de la imagen almacenada
            }));
            setGallery(existingImages);
        } else {
            setGallery([]); // Limpiar la galería si no hay imágenes
        }

        // Cargar los archivos descargables
        if (data?.downloadables) {
            const existingFiles = data.downloadables.map((file) => ({
                id: file.id, // ID del archivo en la base de datos
                name: file.original_name || file.name,
                url: `/storage/downloads/item/${file.url}`,
                size: file.size || 0,
                type: file.mime_type || 'application/octet-stream',
            }));
            setDownloadables(existingFiles);
        } else {
            setDownloadables([]); // Limpiar los archivos si no hay
        }

        if (data?.specifications) {
            setSpecifications(data.specifications.map(spec => ({
                type: spec.type,
                title: spec.title,
                description: spec.description,
                tooltip: spec.tooltip
            })));
        } else {
            setSpecifications([]);
        }
        // Nuevos campos

        stockRef.current.value = data?.stock;

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

       // const tagsValue = $(tagsRef.current).val();
        const applicationsValue = $(applicationsRef.current).val();
        const symbologiesValue = $(symbologiesRef.current).val();
        const technologiesValue = $(technologiesRef.current).val();
        const request = {
            id: idRef.current.value || undefined,
            category_id: categoryRef.current.value,
            family_id: familyRef.current.value,
            platform_id: platformRef.current.value,
            name: nameRef.current.value,
            summary: summaryRef.current.value,
            price: priceRef.current.value,
            discount: discountRef.current.value,
          //  tags: tagsValue,
            applications: applicationsValue,
            symbologies: symbologiesValue,
            technologies:technologiesValue,
            description: descriptionRef.current.value,
            stock: stockRef.current.value,
            specifications: JSON.stringify(specifications),
        };

        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }
        formData.append("features", JSON.stringify(features)); // Características (array de strings)
        formData.append("specifications", JSON.stringify(specifications)); // Especificaciones (array de objetos)

        const image = imageRef.current.files[0];
        if (image) {
            formData.append("image", image);
        }


        //TODO: Preparar los datos de la galería

        // Galería
        let galleryIndex = 0;
        const galleryIds = [];

        gallery.forEach((img, index) => {
            if (!img.toDelete) {
                if (img.file) {
                    formData.append(`gallery[${galleryIndex}]`, img.file);
                    galleryIndex++;
                } else {
                    galleryIds.push(img.id);
                }
            }
        });

        // Enviar los IDs de imágenes existentes como array
        if (galleryIds.length > 0) {
            galleryIds.forEach((id, index) => {
                formData.append(`gallery_ids[${index}]`, id);
            });
        }

        const deletedImages = gallery
            .filter((img) => img.toDelete)
            .map((img) => img.id);

        if (deletedImages.length > 0) {
            formData.append("deleted_images", JSON.stringify(deletedImages));
        }

        // Archivos descargables
        let downloadablesIndex = 0;
        const downloadableIds = [];

        downloadables.forEach((file, index) => {
            if (!file.toDelete) {
                if (file.file) {
                    formData.append(`downloadables[${downloadablesIndex}]`, file.file);
                    downloadablesIndex++;
                } else {
                    downloadableIds.push(file.id);
                }
            }
        });

        // Enviar los IDs de archivos existentes como array
        if (downloadableIds.length > 0) {
            downloadableIds.forEach((id, index) => {
                formData.append(`downloadable_ids[${index}]`, id);
            });
        }

        const deletedDownloadables = downloadables
            .filter((file) => file.toDelete)
            .map((file) => file.id);

        if (deletedDownloadables.length > 0) {
            formData.append("deleted_downloadables", JSON.stringify(deletedDownloadables));
        }

        const result = await itemsRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
        setGallery([]);
        setDownloadables([]);
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await itemsRest.boolean({ id, field: "visible", value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onBooleanChange = async ({ id, field, value }) => {
        const result = await itemsRest.boolean({ id, field, value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar curso",
            text: "¿Estás seguro de eliminar este curso?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await itemsRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };
    const [features, setFeatures] = useState([]); // Características
    const [specifications, setSpecifications] = useState([]); // Especificaciones

    // Opciones del campo "type"
    const typeOptions = ["General", "Principal"];
    const [showImportModal, setShowImportModal] = useState(false);
    const modalImportRef = useRef();
    const onModalImportOpen = () => {
        $(modalImportRef.current).modal("show");
    };
    return (
        <>
            <Table
                gridRef={gridRef}
                title="Items"
                rest={itemsRest}
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refrescar tabla",
                            onClick: () =>
                                $(gridRef.current)
                                    .dxDataGrid("instance")
                                    .refresh(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Agregar",
                            hint: "Agregar",
                            onClick: () => onModalOpen(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "upload",
                            text: "Importar Datos",
                            hint: "Importar Datos",
                            onClick: () => onModalImportOpen(),
                        },
                    });
                }}
                exportable={true}
                exportableName="Items"
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "category.name",
                        caption: "Categoría",
                        width: "120px",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <>
                                        <b className="d-block fst-italic text-muted">
                                            {data.collection?.name}
                                        </b>
                                        <b className="d-block">
                                            {data.category?.name}
                                        </b>
                                        <small className="text-muted">
                                            {data.subcategory?.name}
                                        </small>
                                    </>
                                )
                            );
                        },
                    },
                    {
                        dataField: "subcategory.name",
                        caption: "Subcategoría",
                        visible: false,
                    },
                    {
                        dataField: "brand.name",
                        caption: "Marca",
                        width: "120px",
                    },
                    {
                        dataField: "name",
                        caption: "Nombre",
                        minWidth: "300px",
                        cellTemplate: (container, { data }) => {

                            const truncateWords = (text, maxWords) => {
                                if (!text) return '';
                                const words = text.split(' ');
                                if (words.length > maxWords) {
                                    return words.slice(0, maxWords).join(' ') + '...';
                                }
                                return text;
                            };

                            const truncatedSummary = truncateWords(data.summary, 12);

                            container.html(
                                renderToString(
                                    <>
                                        <b>{data.name}</b>
                                        <br />
                                        <span>
                                            {truncatedSummary}
                                        </span>
                                    </>
                                )
                            );
                        },
                    },
                    {
                        dataField: "final_price",
                        caption: "Precio",
                        dataType: "number",
                        width: "75px",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <>
                                        {data.discount > 0 && (
                                            <small
                                                className="d-block text-muted"
                                                style={{
                                                    textDecoration:
                                                        "line-through",
                                                }}
                                            >
                                                S/.{Number2Currency(data.price)}
                                            </small>
                                        )}
                                        <span>
                                            S/.
                                            {Number2Currency(
                                                data.discount > 0
                                                    ? data.discount
                                                    : data.price
                                            )}
                                        </span>
                                    </>
                                )
                            );
                        },
                    },
                    {
                        dataField: "image",
                        caption: "Imagen",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/item/${data.image}`}
                                    style={{
                                        width: "80px",
                                        height: "48px",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        borderRadius: "4px",
                                    }}
                                    onError={(e) =>
                                    (e.target.src =
                                        "/api/cover/thumbnail/null")
                                    }
                                />
                            );
                        },
                    },
                    {
                        dataField: "is_new",
                        caption: "Nuevo",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const is_newValue = data.is_new === 1 || data.is_new === '1' || data.is_new === true;
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={is_newValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "is_new",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        dataField: "offering",
                        caption: "En oferta",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const offeringValue = data.offering === 1 || data.offering === '1' || data.offering === true;
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={offeringValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "offering",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        dataField: "recommended",
                        caption: "Recomendado",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const recommendedValue = data.recommended === 1 || data.recommended === '1' || data.recommended === true;
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={recommendedValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "recommended",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        dataField: "featured",
                        caption: "Destacado",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const featuredValue = data.featured === 1 || data.featured === '1' || data.featured === true;

                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={featuredValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "featured",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible}
                                    onChange={(e) =>
                                        onVisibleChange({
                                            id: data.id,
                                            value: e.target.checked,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            container.css("text-overflow", "unset");
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                })
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                })
                            );
                        },
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ]}
            />
            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar Producto" : "Agregar Producto"}
                onSubmit={onModalSubmit}
                size="xl"
            >
                <div className="container-fluid" id="principal-container">
                    <input ref={idRef} type="hidden" />

                    {/* Información Principal */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-primary border-bottom-0" style={{ padding: '15px 20px' }}>
                                    <div className="d-flex align-items-center">
                                        <i className="mdi mdi-information-outline text-white fs-5 me-3"></i>
                                        <div>
                                            <h6 className="mb-0 text-white fw-semibold">Información Principal</h6>
                                            <small className="text-white">Datos básicos del producto</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <InputFormGroup
                                                eRef={nameRef}
                                                label="Nombre del Producto"
                                                required
                                                placeholder="Ingrese el nombre del producto"
                                            />
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <TextareaFormGroup
                                                eRef={summaryRef}
                                                label="Resumen del Producto"
                                                rows={3}
                                                placeholder="Descripción breve del producto"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clasificación y Organización */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-primary border-bottom-0" style={{ padding: '15px 20px' }}>
                                    <div className="d-flex align-items-center">
                                        <i className="mdi mdi-tag-multiple text-white fs-5 me-3"></i>
                                        <div>
                                            <h6 className="mb-0 text-white fw-semibold">Clasificación y Organización</h6>
                                            <small className="text-white">Categorías, familias y etiquetas</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <SelectFormGroup
                                                eRef={categoryRef}
                                                label="Categoría"
                                                required
                                                dropdownParent="#principal-container"
                                                onChange={(e) =>
                                                    setSelectedCategory(e.target.value)
                                                }
                                            >
                                                <option value="">Seleccione una categoría</option>
                                                {categories.map((item, index) => (
                                                    <option key={index} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </SelectFormGroup>
                                        </div>
                                        <div className="col-md-6">
                                            <SelectAPIFormGroup
                                                eRef={familyRef}
                                                label="Familia"
                                                searchAPI="/api/admin/families/paginate"
                                                searchBy="name"
                                                filter={["category_id", "=", selectedCategory]}
                                                dropdownParent="#principal-container"
                                                onChange={(e) =>
                                                    setSelectedFamily(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <SelectAPIFormGroup
                                                eRef={platformRef}
                                                label="Plataforma"
                                                searchAPI="/api/admin/platforms/paginate"
                                                searchBy="name"
                                                filter={["family_id", "=", selectedFamily]}
                                                dropdownParent="#principal-container"
                                            />
                                        </div>



                                        <div className="col-md-6">
                                            <SelectAPIFormGroup
                                                id="applications"
                                                eRef={applicationsRef}
                                                searchAPI="/api/admin/applications/paginate"
                                                searchBy="name"
                                                label="Aplicaciones"
                                                dropdownParent="#principal-container"
                                                tags
                                                multiple
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <SelectAPIFormGroup
                                                id="symbologies"
                                                eRef={symbologiesRef}
                                                searchAPI="/api/admin/symbologies/paginate"
                                                searchBy="name"
                                                label="Simbologías"
                                                dropdownParent="#principal-container"
                                                tags
                                                multiple
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <SelectAPIFormGroup
                                                id="technologies"
                                                eRef={technologiesRef}
                                                searchAPI="/api/admin/technologies/paginate"
                                                searchBy="name"
                                                label="Tecnologías"
                                                dropdownParent="#principal-container"
                                                tags
                                                multiple
                                            />
                                        </div>
                                       {/* <div className="col-md-6">
                                            <SelectAPIFormGroup
                                                id="tags"
                                                eRef={tagsRef}
                                                searchAPI={"/api/admin/tags/paginate"}
                                                searchBy="name"
                                                label="Etiquetas"
                                                dropdownParent="#principal-container"
                                                tags
                                                multiple
                                            />
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Precios y Características */}
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-primary border-bottom-0" style={{ padding: '15px 20px' }}>
                                    <div className="d-flex align-items-center">
                                        <i className="mdi mdi-currency-usd text-white fs-5 me-3"></i>
                                        <div>
                                            <h6 className="mb-0 text-white fw-semibold">Información de Precios</h6>
                                            <small className="text-white">Precios y stock disponible</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <InputFormGroup
                                                eRef={priceRef}
                                                label="Precio Regular (S/.)"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                required
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <InputFormGroup
                                                eRef={discountRef}
                                                label="Precio con Descuento (S/.)"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                            />
                                            <small className="text-muted">Dejar vacío si no hay descuento</small>
                                        </div>
                                        <div className="col-md-4">
                                            <InputFormGroup
                                                label="Stock Disponible"
                                                eRef={stockRef}
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Especificaciones */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '8px' }}>
                                <div className="card-header bg-primary border-bottom-0" style={{ padding: '15px 20px' }}>
                                    <div className="d-flex align-items-center">
                                        <i className="mdi mdi-format-list-bulleted text-white fs-5 me-3"></i>
                                        <div>
                                            <h6 className="mb-0 text-white fw-semibold">Especificaciones Generales</h6>
                                            <small className="text-white">Características principales del producto</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body" style={{ padding: '20px' }}>
                                    <DynamicField
                                        ref={specificationsRef}
                                        label=""
                                        structure={{ description: "" }}
                                        value={specifications.filter(spec => spec.type === 'general')}
                                        onChange={(generalSpecs) => {
                                            const technicalSpecs = specifications.filter(spec => spec.type === 'technical');
                                            const updatedSpecs = [...generalSpecs.map(spec => ({ ...spec, type: 'general' })), ...technicalSpecs];
                                            setSpecifications(updatedSpecs);
                                        }}
                                        placeholder="Descripción general del producto"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '8px' }}>
                                <div className="card-header bg-primary border-bottom-0" style={{ padding: '15px 20px' }}>
                                    <div className="d-flex align-items-center">
                                        <i className="mdi mdi-cog text-white fs-5 me-3"></i>
                                        <div>
                                            <h6 className="mb-0 text-white fw-semibold">Especificaciones Técnicas</h6>
                                            <small className="text-white">Detalles técnicos y funcionales</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body" style={{ padding: '20px' }}>
                                    <DynamicField
                                        label=""
                                        structure={{ title: "", description: "", tooltip: "" }}
                                        value={specifications.filter(spec => spec.type === 'technical')}
                                        onChange={(technicalSpecs) => {
                                            const generalSpecs = specifications.filter(spec => spec.type === 'general');
                                            const updatedSpecs = [...generalSpecs, ...technicalSpecs.map(spec => ({ ...spec, type: 'technical' }))];
                                            setSpecifications(updatedSpecs);
                                        }}
                                        placeholder="Especificaciones técnicas del producto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Imágenes y Multimedia */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-primary border-bottom-0" style={{ padding: '15px 20px' }}>
                                    <div className="d-flex align-items-center">
                                        <i className="mdi mdi-image-multiple text-white fs-5 me-3"></i>
                                        <div>
                                            <h6 className="mb-0 text-white fw-semibold">Imágenes y Multimedia</h6>
                                            <small className="text-white">Galería de imágenes del producto</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="row">

                                                <ImageFormGroup
                                                    eRef={imageRef}
                                                    label="Imagen Principal"
                                                    aspect={1}

                                                />

                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="col-12">
                                                <h6 className="mb-2">Galería de Imágenes</h6>

                                                <input
                                                    id="input-item-gallery"
                                                    ref={galleryRef}
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    hidden
                                                    onChange={handleGalleryChange}
                                                />
                                                <div
                                                    className="border border-2 border-dashed rounded p-4 text-center"
                                                    style={{
                                                        cursor: "pointer",
                                                        backgroundColor: "#f8f9fa",
                                                        minHeight: "120px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        transition: "all 0.3s ease",
                                                    }}
                                                    onClick={() => galleryRef.current.click()}
                                                    onDrop={handleDrop}
                                                    onDragOver={handleDragOver}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = "#e9ecef";
                                                        e.target.style.borderColor = "#6c757d";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = "#f8f9fa";
                                                        e.target.style.borderColor = "#dee2e6";
                                                    }}
                                                >
                                                    <div>
                                                        <i className="mdi mdi-cloud-upload fs-3 text-muted mb-2 d-block"></i>
                                                        <span className="text-muted">
                                                            Arrastra y suelta imágenes aquí o haz clic para seleccionar
                                                        </span>
                                                        <small className="d-block text-muted mt-1">
                                                            Formatos soportados: JPG, PNG, GIF
                                                        </small>
                                                    </div>
                                                </div>

                                                {/* Vista previa de imágenes */}
                                                {gallery.length > 0 && (
                                                    <div className="mt-3">
                                                        <small className="text-muted mb-2 d-block">
                                                            {gallery.filter(image => !image.toDelete).length} imagen{gallery.filter(image => !image.toDelete).length !== 1 ? 'es' : ''} seleccionada{gallery.filter(image => !image.toDelete).length !== 1 ? 's' : ''}
                                                        </small>
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {gallery.filter(image => !image.toDelete).map((image, index) => {
                                                                // Obtener el índice original para la función removeGalleryImage
                                                                const originalIndex = gallery.findIndex(img => img === image);
                                                                return (
                                                                    <div
                                                                        key={originalIndex}
                                                                        className="position-relative border rounded"
                                                                        style={{
                                                                            width: "100px",
                                                                            height: "100px",
                                                                            overflow: "hidden",
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={`${image.url}`}
                                                                            alt={`preview-${originalIndex}`}
                                                                            className="w-100 h-100"
                                                                            style={{
                                                                                objectFit: "cover",
                                                                            }}
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-danger btn-sm position-absolute"
                                                                            style={{
                                                                                top: "5px",
                                                                                right: "5px",
                                                                                width: "24px",
                                                                                height: "24px",
                                                                                padding: "0",
                                                                                fontSize: "12px",
                                                                                lineHeight: "1"
                                                                            }}
                                                                            onClick={(e) => removeGalleryImage(e, originalIndex)}
                                                                            title="Eliminar imagen"
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Archivos Descargables */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-success border-bottom-0" style={{ padding: '15px 20px' }}>
                                    <div className="d-flex align-items-center">
                                        <i className="mdi mdi-download text-white fs-5 me-3"></i>
                                        <div>
                                            <h6 className="mb-0 text-white fw-semibold">Archivos Descargables</h6>
                                            <small className="text-white">Manuales, catálogos y documentos del producto</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <input
                                        id="input-item-downloadables"
                                        ref={downloadablesRef}
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                                        hidden
                                        onChange={handleDownloadablesChange}
                                    />
                                    <div
                                        className="border border-2 border-dashed rounded p-4 text-center"
                                        style={{
                                            cursor: "pointer",
                                            backgroundColor: "#f8f9fa",
                                            minHeight: "120px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.3s ease",
                                        }}
                                        onClick={() => downloadablesRef.current.click()}
                                        onDrop={handleDownloadablesDrop}
                                        onDragOver={handleDragOver}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = "#e9ecef";
                                            e.target.style.borderColor = "#6c757d";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = "#f8f9fa";
                                            e.target.style.borderColor = "#dee2e6";
                                        }}
                                    >
                                        <div>
                                            <i className="mdi mdi-file-upload fs-3 text-muted mb-2 d-block"></i>
                                            <span className="text-muted">
                                                Arrastra y suelta archivos aquí o haz clic para seleccionar
                                            </span>
                                            <small className="d-block text-muted mt-1">
                                                Formatos soportados: PDF, DOC, XLS, PPT, TXT, ZIP, RAR
                                            </small>
                                            <small className="d-block text-warning mt-1">
                                                <i className="mdi mdi-alert-circle me-1"></i>
                                                Tamaño máximo por archivo: 10MB
                                            </small>
                                        </div>
                                    </div>

                                    {/* Lista de archivos */}
                                    {downloadables.length > 0 && (
                                        <div className="mt-3">
                                            <small className="text-muted mb-2 d-block">
                                                {downloadables.filter(file => !file.toDelete).length} archivo{downloadables.filter(file => !file.toDelete).length !== 1 ? 's' : ''} seleccionado{downloadables.filter(file => !file.toDelete).length !== 1 ? 's' : ''}
                                            </small>
                                            <div className="list-group">
                                                {downloadables.filter(file => !file.toDelete).map((file, index) => {
                                                    // Obtener el índice original para la función removeDownloadableFile
                                                    const originalIndex = downloadables.findIndex(f => f === file);
                                                    return (
                                                        <div
                                                            key={originalIndex}
                                                            className="list-group-item d-flex align-items-center justify-content-between"
                                                        >
                                                            <div className="d-flex align-items-center">
                                                                <i className={`mdi ${getFileIcon(file.name)} fs-4 text-primary me-3`}></i>
                                                                <div>
                                                                    <div className="fw-medium">{file.name}</div>
                                                                    <small className="text-muted">
                                                                        {file.size ? formatFileSize(file.size) : 'Tamaño desconocido'}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                {file.url && !file.file && (
                                                                    <a
                                                                        href={file.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        title="Descargar archivo"
                                                                    >
                                                                        <i className="mdi mdi-download"></i>
                                                                    </a>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={(e) => removeDownloadableFile(e, originalIndex)}
                                                                    title="Eliminar archivo"
                                                                >
                                                                    <i className="mdi mdi-delete"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Descripción del Producto */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-bottom">
                                    <h6 className="mb-0 text-dark"><i className="mdi mdi-text-box me-2 text-muted"></i>Descripción del Producto</h6>
                                </div>
                                <div className="card-body">
                                    <QuillFormGroup eRef={descriptionRef} label="" placeholder="Escriba una descripción detallada del producto..." />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal modalRef={modalImportRef} title={"Importar Datos"} size="sm">
                <ModalImportItem gridRef={gridRef} modalRef={modalImportRef} />
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Items">
            <Items {...properties} />
        </BaseAdminto>
    );
});
