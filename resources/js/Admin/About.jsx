import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import AboutusRest from "../Actions/Admin/AboutusRest";
import WebDetailsRest from "../Actions/Admin/WebDetailsRest";
import BasicEditing from "../Components/Adminto/Basic/BasicEditing";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import ArrayDetails2Object from "../Utils/ArrayDetails2Object";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import { title } from "framer-motion/client";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";

const aboutusRest = new AboutusRest();
const webDetailsRest = new WebDetailsRest();

const About = ({ details: detailsDB }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const titleRef = useRef();
    const imageRef = useRef();
    const timelineRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [timelineData, setTimelineData] = useState([]);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        descriptionRef.editor.root.innerHTML = data?.description ?? "";
        titleRef.current.value = data?.title ?? "";
        imageRef.current.value = null;
        imageRef.image.src = `/storage/images/aboutus/${
            data?.image ?? "undefined"
        }`;
        
        // Cargar datos del timeline
        try {
            const timeline = data?.timeline ? JSON.parse(data.timeline) : [];
            setTimelineData(timeline);
        } catch (e) {
            setTimelineData([]);
        }
        
        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            title: titleRef.current.value,
            timeline: JSON.stringify(timelineData),
        };

        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }

        const image = imageRef.current.files[0];
        if (image) {
            formData.append("image", image);
        }

        const result = await aboutusRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onStatusChange = async ({ id, status }) => {
        const result = await aboutusRest.status({ id, status });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await aboutusRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar recurso",
            text: "¿Estas seguro de eliminar este about?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await aboutusRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const [details, setDetails] = useState(ArrayDetails2Object(detailsDB));
    const [videoEditing, setVideoEditing] = useState(false);

    const onVideoChange = async (e) => {
        const result = webDetailsRest.save({
            page: "about",
            name: "video",
            description: e.target.value,
        });
        if (!result) return;
        setDetails((old) => ({ ...old, [`about.video`]: e.target.value }));
        setVideoEditing(false);
    };

    // Funciones para manejar el timeline
    const addTimelineItem = () => {
        setTimelineData([...timelineData, { year: '', name: '', description: '' }]);
    };

    const removeTimelineItem = (index) => {
        const newData = timelineData.filter((_, i) => i !== index);
        setTimelineData(newData);
    };

    const updateTimelineItem = (index, field, value) => {
        const newData = [...timelineData];
        newData[index][field] = value;
        setTimelineData(newData);
    };

    return (
        <>
            <Table
                gridRef={gridRef}
              title={"Secciones de la pagina Sobre Nosotros"}
                rest={aboutusRest}
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
                   /* container.unshift({
                      widget: 'dxButton', location: 'after',
                      options: {
                      icon: 'plus',
                         text: 'Nuevo about',
                        hint: 'Nuevo about',
                        onClick: () => onModalOpen()
                   }
                     });*/
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "name",
                        caption: "Sección",
                    },
                    {
                        dataField: "title",
                        caption: "Titulo",
                    },
                    {
                        dataField: "image",
                        caption: "Imagen",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/aboutus/${data.image}`}
                                    style={{
                                        width: "80px",
                                        height: "80px",
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
                        dataField: "timeline",
                        caption: "Timeline",
                        cellTemplate: (container, { data }) => {
                            try {
                                const timeline = data?.timeline ? JSON.parse(data.timeline) : [];
                                ReactAppend(
                                    container,
                                    <span className="badge badge-info">
                                        {timeline.length} eventos
                                    </span>
                                );
                            } catch (e) {
                                ReactAppend(
                                    container,
                                    <span className="badge badge-secondary">Sin timeline</span>
                                );
                            }
                        },
                    },
                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible == 1}
                                    onChange={() =>
                                        onVisibleChange({
                                            id: data.id,
                                            value: !data.visible,
                                        })
                                    }
                                />
                            );
                        },
                    },

                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
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
                title={isEditing ? "Editar about" : "Agregar about"}
                onSubmit={onModalSubmit}
                size="md"
            >
                <div className="row" id="aboutuses-container">
                    <input ref={idRef} type="hidden" />
                    <InputFormGroup
                        eRef={nameRef}
                        label="Sección"
                        col="col-12"
                        rows={2}
                        required
                        disabled={isEditing}
                    />
                    <InputFormGroup
                        eRef={titleRef}
                        label="Título"
                        col="col-12"
                        rows={2}
                    />
                    <QuillFormGroup eRef={descriptionRef} label="Descripción" />
                    <ImageFormGroup
                        eRef={imageRef}
                        label="Imagen"
                        col="col-12"
                        rows={3}
                    />
                    
                    {/* Timeline Section */}
                    <div className="col-12">
                        <label className="form-label">Timeline</label>
                        <div className="border rounded p-3 mb-3">
                            {timelineData.length > 0 ? (
                                timelineData.map((item, index) => (
                                    <div key={index} className="timeline-item " style={{marginBottom: '2rem'
                                    }}>
                                        <div className="row mb-4">
                                            <div className="col-md-3">
                                                <label className="form-label">Año</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={item.year}
                                                    onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                                                    placeholder="2024"
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <label className="form-label">Evento</label>
                                              <div className="d-flex gap-2">
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    value={item.name}
                                                    onChange={(e) => updateTimelineItem(index, 'name', e.target.value)}
                                                    placeholder="Nombre del evento"
                                                />
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => removeTimelineItem(index)}
                                                    title="Eliminar"
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                                </div>
                                            </div>
                                           
                                            <div className="col-md-12 mt-2">
                                                <label className="form-label">Descripción</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="4"
                                                    value={item.description}
                                                    onChange={(e) => updateTimelineItem(index, 'description', e.target.value)}
                                                    placeholder="Descripción del evento"
                                                />
                                            </div>
                                            
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center py-3">No hay eventos en el timeline</p>
                            )}
                            
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={addTimelineItem}
                            >
                                <i className="fa fa-plus me-1"></i>
                                Agregar evento al timeline
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Nosotros">
            <About {...properties} />
        </BaseAdminto>
    );
});
