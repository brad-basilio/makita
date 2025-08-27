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
    const nameRef = useRef();
    const summaryRef = useRef();
    const priceRef = useRef();
    const discountRef = useRef();
    const tagsRef = useRef();
    const bannerRef = useRef();
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

    /*************************/

    useEffect(() => {
        if (itemData && itemData.images) {
            const existingImages = itemData.images.map((img) => ({
                id: img.id, // ID de la imagen en la BD
                url: `/storage/images/item_image/${img.url}`, // Ruta de la imagen almacenada
            }));
            setGallery(existingImages);
        }
    }, [itemData]);

    const onModalOpen = (data) => {
        console.log('data total',data);
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
        nameRef.current.value = data?.name || "";
        summaryRef.current.value = data?.summary || "";
        priceRef.current.value = data?.price || 0;
        discountRef.current.value = data?.discount || 0;

        SetSelectValue(tagsRef.current, data?.tags ?? [], "id", "name");

        bannerRef.current.value = null;
        imageRef.current.value = null;
        bannerRef.image.src = `/storage/images/item/${
            data?.banner ?? "undefined"
        }`;
        imageRef.image.src = `/storage/images/item/${
            data?.image ?? "undefined"
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

        if (data?.specifications) {
            setSpecifications(data.specifications.map(spec => ({
                type: spec.type,
                title: spec.title,
                description: spec.description
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

        const request = {
            id: idRef.current.value || undefined,
            category_id: categoryRef.current.value,
            family_id: familyRef.current.value,
            platform_id: platformRef.current.value,
            name: nameRef.current.value,
            summary: summaryRef.current.value,
            price: priceRef.current.value,
            discount: discountRef.current.value,
            tags: $(tagsRef.current).val(),
            applications: $(applicationsRef.current).val(),
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
        const banner = bannerRef.current.files[0];
        if (banner) {
            formData.append("banner", banner);
        }

        //TODO: Preparar los datos de la galería

        // Galería
        gallery.forEach((img, index) => {
            if (!img.toDelete) {
                if (img.file) {
                    formData.append(`gallery[${index}]`, img.file); // Imágenes nuevas
                } else {
                    formData.append(`gallery_ids[${index}]`, img.id); // IDs de imágenes existentes
                }
            }
        });

        const deletedImages = gallery
            .filter((img) => img.toDelete)
            .map((img) => parseInt(img.id, 10)); // Asegurar que sean enteros
        if (deletedImages.length > 0) {
            formData.append("deleted_images", JSON.stringify(deletedImages)); // Imágenes eliminadas
        }

        console.log(formData);

        const result = await itemsRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
        setGallery([]);
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
                                <div className="card-header bg-primary text-white">
                                    <h6 className="mb-0"><i className="mdi mdi-information-outline me-2"></i>Información Principal</h6>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <InputFormGroup
                                                eRef={nameRef}
                                                label="Nombre del Producto"
                                                required
                                                placeholder="Ingrese el nombre del producto"
                                            />
                                        </div>
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
                                <div className="card-header bg-info text-white">
                                    <h6 className="mb-0"><i className="mdi mdi-tag-multiple me-2"></i>Clasificación y Organización</h6>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
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
                                        <div className="col-md-4">
                                            <SelectAPIFormGroup
                                                eRef={platformRef}
                                                label="Plataforma"
                                                searchAPI="/api/admin/platforms/paginate"
                                                searchBy="name"
                                                filter={["family_id", "=", selectedFamily]}
                                                dropdownParent="#principal-container"
                                            />
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
                                    <div className="row">
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
                                                id="tags"
                                                eRef={tagsRef}
                                                searchAPI={"/api/admin/tags/paginate"}
                                                searchBy="name"
                                                label="Etiquetas"
                                                dropdownParent="#principal-container"
                                                tags
                                                multiple
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Precios y Características */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-success text-white">
                                    <h6 className="mb-0"><i className="mdi mdi-currency-usd me-2"></i>Información de Precios</h6>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
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
                                        <div className="col-md-6">
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
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-warning text-dark">
                                    <h6 className="mb-0"><i className="mdi mdi-star me-2"></i>Características Principales</h6>
                                </div>
                                <div className="card-body">
                                    <DynamicField
                                        ref={featuresRef}
                                        label=""
                                        structure=""
                                        onChange={setFeatures}
                                        placeholder="Agregue las características del producto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                
                    {/* Especificaciones */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-secondary text-white">
                                    <h6 className="mb-0"><i className="mdi mdi-format-list-bulleted me-2"></i>Especificaciones Generales</h6>
                                </div>
                                <div className="card-body">
                                    <DynamicField
                                        ref={specificationsRef}
                                        label=""
                                        structure={{ title: "", description: "" }}
                                        value={specifications.filter(spec => spec.type === 'general')}
                                        onChange={(generalSpecs) => {
                                            const technicalSpecs = specifications.filter(spec => spec.type === 'technical');
                                            const updatedSpecs = [...generalSpecs.map(spec => ({...spec, type: 'general'})), ...technicalSpecs];
                                            setSpecifications(updatedSpecs);
                                        }}
                                        placeholder="Agregue especificaciones generales del producto"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-dark text-white">
                                    <h6 className="mb-0"><i className="mdi mdi-cog me-2"></i>Especificaciones Técnicas</h6>
                                </div>
                                <div className="card-body">
                                    <DynamicField
                                        label=""
                                        structure={{ title: "", description: "" }}
                                        value={specifications.filter(spec => spec.type === 'technical')}
                                        onChange={(technicalSpecs) => {
                                            const generalSpecs = specifications.filter(spec => spec.type === 'general');
                                            const updatedSpecs = [...generalSpecs, ...technicalSpecs.map(spec => ({...spec, type: 'technical'}))];
                                            setSpecifications(updatedSpecs);
                                        }}
                                        placeholder="Agregue especificaciones técnicas del producto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                
                    {/* Imágenes y Multimedia */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-info text-white">
                                    <h6 className="mb-0"><i className="mdi mdi-image-multiple me-2"></i>Imágenes y Multimedia</h6>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="row">
                                                <ImageFormGroup
                                                    eRef={bannerRef}
                                                    label="Banner Principal"
                                                    aspect={2 / 1}
                                                    col="col-12"
                                                />
                                                <ImageFormGroup
                                                    eRef={imageRef}
                                                    label="Imagen Principal"
                                                    aspect={1}
                                                    col="col-lg-6 col-md-12 col-sm-6"
                                                />
                                                <ImageFormGroup
                                                    eRef={textureRef}
                                                    label="Textura/Material"
                                                    aspect={1}
                                                    col="col-lg-6 col-md-12 col-sm-6"
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
                                            {gallery.length} imagen{gallery.length !== 1 ? 'es' : ''} seleccionada{gallery.length !== 1 ? 's' : ''}
                                        </small>
                                        <div className="d-flex flex-wrap gap-2">
                                            {gallery.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className="position-relative border rounded"
                                                    style={{
                                                        width: "100px",
                                                        height: "100px",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <img
                                                        src={`${image.url}`}
                                                        alt={`preview-${index}`}
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
                                                        onClick={(e) => removeGalleryImage(e, index)}
                                                        title="Eliminar imagen"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
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

                    {/* Descripción del Producto */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-purple text-white">
                                    <h6 className="mb-0"><i className="mdi mdi-text-box me-2"></i>Descripción del Producto</h6>
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
