import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import Table from '../Components/Table';
import Modal from '../Components/Modal';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import ReactAppend from '../Utils/ReactAppend';
import DxButton from '../Components/dx/DxButton';
import TextareaFormGroup from '@Adminto/form/TextareaFormGroup';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import SelectFormGroup from '../Components/Adminto/form/SelectFormGroup';
import Swal from 'sweetalert2';
import CoursesRest from '../Actions/Admin/CoursesRest';
import QuillFormGroup from '../Components/Adminto/form/QuillFormGroup';
import { renderToString } from 'react-dom/server';
import BasicEditing from '../Components/Adminto/Basic/BasicEditing';

const coursesRest = new CoursesRest()

const Courses = ({ icons, categories, details }) => {
  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const categoryRef = useRef()
  const nameRef = useRef()
  const summaryRef = useRef()
  const descriptionRef = useRef()
  const sessionsRef = useRef()
  const typeRef = useRef()
  const certificateRef = useRef()
  const sessionDurationRef = useRef()
  const longDurationRef = useRef()
  const priceRef = useRef()
  const discountRef = useRef()
  const studentsRef = useRef()
  const imageRef = useRef()

  const [isEditing, setIsEditing] = useState(false)
  const [audience, setAudience] = useState([''])
  const [requirements, setRequirements] = useState([''])
  const [objectives, setObjectives] = useState([''])
  const [content, setContent] = useState([{ icon: '', text: '' }])

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    $(categoryRef.current).val(data?.category_id ?? null).trigger('change')
    nameRef.current.value = data?.name ?? ''
    summaryRef.current.value = data?.summary ?? ''
    descriptionRef.editor.root.innerHTML = data?.description ?? ''
    sessionsRef.current.value = data?.sessions ?? 0
    typeRef.current.value = data?.type ?? 'Presencial'
    certificateRef.current.value = data?.certificate ?? ''
    sessionDurationRef.current.value = data?.session_duration ?? ''
    longDurationRef.current.value = data?.long_duration ?? ''
    priceRef.current.value = data?.price ?? ''
    discountRef.current.value = data?.discount ?? ''
    studentsRef.current.value = data?.students ?? ''
    imageRef.image.src = `/api/courses/media/${data?.image}`
    imageRef.current.value = null
    setAudience(data?.audience ? JSON.parse(data.audience) : [''])
    setRequirements(data?.requirements ? JSON.parse(data.requirements) : [''])
    setObjectives(data?.objectives ? JSON.parse(data.objectives) : [''])
    setContent(data?.content ? JSON.parse(data.content) : [{ icon: '', text: '' }])

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      category_id: categoryRef.current.value,
      name: nameRef.current.value,
      summary: summaryRef.current.value,
      description: descriptionRef.current.value,
      sessions: sessionsRef.current.value,
      type: typeRef.current.value,
      certificate: certificateRef.current.value,
      session_duration: sessionDurationRef.current.value,
      long_duration: longDurationRef.current.value,
      price: priceRef.current.value,
      discount: discountRef.current.value,
      students: studentsRef.current.value,
      audience: JSON.stringify(audience.filter(Boolean)),
      requirements: JSON.stringify(requirements.filter(Boolean)),
      objectives: JSON.stringify(objectives.filter(Boolean)),
      content: JSON.stringify(content.filter(item => item.icon || item.text)),
    }

    const formData = new FormData()
    for (const key in request) {
      formData.append(key, request[key])
    }
    const file = imageRef.current.files[0]
    if (file) {
      formData.append('image', file)
    }

    const result = await coursesRest.save(formData)
    if (!result) return

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await coursesRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onFeaturedChange = async ({ id, value }) => {
    const result = await coursesRest.boolean({ id, field: 'featured', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar curso',
      text: '¿Estás seguro de eliminar este curso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await coursesRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const handleArrayChange = (index, value, setter) => {
    setter(prev => prev.map((item, i) => i === index ? value : item))
  }

  const handleArrayAdd = (setter) => {
    setter(prev => [...prev, ''])
  }

  const handleArrayRemove = (index, setter) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const handleContentChange = (index, key, value) => {
    setContent(prev => prev.map((item, i) => i === index ? { ...item, [key]: value } : item))
  }

  const handleContentAdd = () => {
    setContent(prev => [...prev, { icon: '', text: '' }])
  }

  const handleContentRemove = (index) => {
    setContent(prev => prev.filter((_, i) => i !== index))
  }

  const iconTemplate = (e) => {
    return $(renderToString(<span>
      <i className={`${e.id} me-1`}></i>
      {/* {e.text} */}
    </span>))
  }

  return (<>
    <Table gridRef={gridRef} title={<BasicEditing correlative='courses' details={details}/>} rest={coursesRest}
      toolBar={(container) => {
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'refresh',
            hint: 'Refrescar tabla',
            onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
          }
        });
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'plus',
            text: 'Nuevo curso',
            hint: 'Nuevo curso',
            onClick: () => onModalOpen()
          }
        });
      }}
      columns={[
        {
          dataField: 'id',
          caption: 'ID',
          visible: false
        },
        {
          dataField: 'category.name',
          caption: 'Categoría',
        },
        {
          dataField: 'name',
          caption: 'Nombre',
          // width: '50%',
          cellTemplate: (container, { data }) => {
            container.html(renderToString(<>
              {data.name}
              {/* <b>{data.name}</b><br /> */}
              {/* <span className='truncate'>{data.summary}</span> */}
            </>))
          }
        },
        {
          dataField: 'price',
          caption: 'Precio',
          dataType: 'number',
          width: '100px',
          cellTemplate: (container, { data }) => {
            container.text(`S/.${Number(data.price).toFixed(2)}`)
          }
        },
        {
          dataField: 'image',
          caption: 'Imagen',
          width: '90px',
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <img src={`/api/courses/media/${data.image}`} style={{ width: '80px', height: '48px', objectFit: 'cover', objectPosition: 'center', borderRadius: '4px' }} onError={e => e.target.src = '/api/cover/thumbnail/null'} />)
          }
        },
        {
          dataField: 'featured',
          caption: 'Destacado',
          dataType: 'boolean',
          width: '120px',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <SwitchFormGroup checked={data.featured} onChange={(e) => onFeaturedChange({ id: data.id, value: e.target.checked })} />)
          }
        },
        {
          dataField: 'visible',
          caption: 'Visible',
          dataType: 'boolean',
          width: '120px',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <SwitchFormGroup checked={data.visible} onChange={(e) => onVisibleChange({ id: data.id, value: e.target.checked })} />)
          }
        },
        {
          caption: 'Acciones',
          cellTemplate: (container, { data }) => {
            container.css('text-overflow', 'unset')
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-primary',
              title: 'Editar',
              icon: 'fa fa-pen',
              onClick: () => onModalOpen(data)
            }))
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-danger',
              title: 'Eliminar',
              icon: 'fa fa-trash',
              onClick: () => onDeleteClicked(data.id)
            }))
          },
          allowFiltering: false,
          allowExporting: false
        }
      ]} />
    <Modal modalRef={modalRef} title={isEditing ? 'Editar curso' : 'Agregar curso'} onSubmit={onModalSubmit} size='lg'>
      <div className='row' id='principal-container'>
        <input ref={idRef} type='hidden' />
        <ImageFormGroup eRef={imageRef} label='Imagen' col='col-md-6' aspect={1} />
        <div className="col-md-6">
          <SelectFormGroup eRef={categoryRef} label='Categoría' required dropdownParent='#principal-container'>
            {
              categories.map((item, index) => (<option key={index} value={item.id}>{item.name}</option>))
            }
          </SelectFormGroup>
          <InputFormGroup eRef={nameRef} label='Nombre del curso' required />
          <TextareaFormGroup eRef={summaryRef} label='Resumen' rows={3} required />
          <div className="row">
            <InputFormGroup eRef={priceRef} label='Precio' type='number' col='col-sm-6' step='0.01' required />
            <InputFormGroup eRef={discountRef} label='Descuento' type='number' col='col-sm-6' step='0.01' />
            <InputFormGroup eRef={sessionsRef} label='Sesiones' type='number' placeholder='12' col='col-md-3' required />
            <SelectFormGroup eRef={typeRef} label='Tipo' col='col-md-5' dropdownParent='#principal-container'>
              <option>Presencial</option>
              <option>Semipresencial</option>
              <option>Virtual</option>
            </SelectFormGroup>
            <InputFormGroup eRef={sessionDurationRef} label='Duración (horas)' type='number' placeholder='2' col='col-md-4' required />
          </div>
        </div>
      </div>
      <div className="row" id='courses-container'>
        <InputFormGroup eRef={certificateRef} label='Tipo certificado' col='col-md-6' placeholder='Físico y Virtual PDF' required />
        <InputFormGroup eRef={studentsRef} label='Estudiantes' type='number' col='col-md-2' required />
        <InputFormGroup eRef={longDurationRef} label='Duración total (días)' placeholder='30' col='col-md-4' />
        <QuillFormGroup eRef={descriptionRef} label='Descripción' />



        <div className="col-md-6 mb-3">
          <label className="form-label">¿A quién va dirigido?</label>
          {audience.map((item, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                value={item}
                onChange={(e) => handleArrayChange(index, e.target.value, setAudience)}
              />
              <button type="button" className="btn btn-outline-danger" onClick={() => handleArrayRemove(index, setAudience)}>
                <i className='fa fa-trash'></i>
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={() => handleArrayAdd(setAudience)}>Agregar Audiencia</button>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">¿Cuáles son los requisitos?</label>
          {requirements.map((item, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                value={item}
                onChange={(e) => handleArrayChange(index, e.target.value, setRequirements)}
              />
              <button type="button" className="btn btn-outline-danger" onClick={() => handleArrayRemove(index, setRequirements)}>
                <i className='fa fa-trash'></i>
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={() => handleArrayAdd(setRequirements)}>Agregar Requisito</button>
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label">¿Qué aprenderas?</label>
          {objectives.map((item, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                value={item}
                onChange={(e) => handleArrayChange(index, e.target.value, setObjectives)}
              />
              <button type="button" className="btn btn-outline-danger" onClick={() => handleArrayRemove(index, setObjectives)}>
                <i className='fa fa-trash'></i>
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={() => handleArrayAdd(setObjectives)}>Agregar Objetivo</button>
        </div>

        <div className="col-12 mb-3">
          <label className="form-label">Contenido</label>
          {content.map((item, index) => (
            <div key={index} className="input-group mb-2" style={{ width: '100%' }}>
              <SelectFormGroup className='input-group-text' dropdownParent='#courses-container' onChange={(e) => handleContentChange(index, 'icon', e.target.value)} templateResult={iconTemplate} templateSelection={iconTemplate} noMargin>
                {icons.map((icon, index) => {
                  return <option key={index} value={icon.id}>{icon.value}</option>
                })}
              </SelectFormGroup>
              <input
                type="text"
                className="form-control"
                placeholder="Texto"
                value={item.text}
                onChange={(e) => handleContentChange(index, 'text', e.target.value)}
              />
              <button type="button" className="btn btn-outline-danger input-group-text" onClick={() => handleContentRemove(index)}>
                <i className='fa fa-trash'></i>
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={handleContentAdd}>Agregar Contenido</button>
        </div>
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Cursos'>
    <Courses {...properties} />
  </BaseAdminto>);
})