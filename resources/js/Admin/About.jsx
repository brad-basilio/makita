import BaseAdminto from '@Adminto/Base';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import TextareaFormGroup from '@Adminto/form/TextareaFormGroup';
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import AboutusRest from '../Actions/Admin/AboutusRest';
import Modal from '../Components/Modal';
import Table from '../Components/Table';
import DxButton from '../Components/dx/DxButton';
import InputFormGroup from '../Components/form/InputFormGroup';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';
import Swal from 'sweetalert2';
import BasicEditing from '../Components/Adminto/Basic/BasicEditing';
import ArrayDetails2Object from '../Utils/ArrayDetails2Object';
import WebDetailsRest from '../Actions/Admin/WebDetailsRest';

const aboutusRest = new AboutusRest()
const webDetailsRest = new WebDetailsRest()

const About = ({details: detailsDB}) => {

  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const nameRef = useRef()
  const descriptionRef = useRef()

  const [isEditing, setIsEditing] = useState(false)

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    nameRef.current.value = data?.name ?? ''
    descriptionRef.current.value = data?.description ?? ''

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      name: nameRef.current.value,
      description: descriptionRef.current.value,
    }

    const result = await aboutusRest.save(request)
    if (!result) return

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onStatusChange = async ({ id, status }) => {
    const result = await aboutusRest.status({ id, status })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await aboutusRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar recurso',
      text: '¿Estas seguro de eliminar este about?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await aboutusRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const [details, setDetails] = useState(ArrayDetails2Object(detailsDB))
  const [videoEditing, setVideoEditing] = useState(false)

  const onVideoChange = async (e) => {
    const result = webDetailsRest.save({
      page: 'about',
      name: 'video',
      description: e.target.value
    })
    if (!result) return
    setDetails(old => ({ ...old, [`about.video`]: e.target.value }))
    setVideoEditing(false)
  }

  return (<>
    <Table gridRef={gridRef} title={<>
      <BasicEditing correlative='about' details={detailsDB}/>
      {
        videoEditing
          ? <input className='form-control form-control-sm mb-1' defaultValue={details?.[`about.video`]} onBlur={onVideoChange} autoFocus />
          : <smal className='header-title mt-1' onClick={() => setVideoEditing(true)}>{details?.[`about.video`] || 'Sin video'}</smal>
      }
      </>
    } rest={aboutusRest}
      toolBar={(container) => {
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'refresh',
            hint: 'Refrescar tabla',
            onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
          }
        });
        // container.unshift({
        //   widget: 'dxButton', location: 'after',
        //   options: {
        //     icon: 'plus',
        //     text: 'Nuevo about',
        //     hint: 'Nuevo about',
        //     onClick: () => onModalOpen()
        //   }
        // });
      }}
      columns={[
        {
          dataField: 'id',
          caption: 'ID',
          visible: false
        },
        {
          dataField: 'name',
          caption: 'Titulo',
        },
        {
          dataField: 'visible',
          caption: 'Visible',
          dataType: 'boolean',
          cellTemplate: (container, { data }) => {
            $(container).empty()
            ReactAppend(container, <SwitchFormGroup checked={data.visible == 1} onChange={() => onVisibleChange({
              id: data.id,
              value: !data.visible
            })} />)
          }
        },
        // {
        //   dataField: 'status',
        //   caption: 'Estado',
        //   dataType: 'boolean',
        //   cellTemplate: (container, { data }) => {
        //     switch (data.status) {
        //       case 1:
        //         ReactAppend(container, <span className='badge bg-success rounded-pill'>Activo</span>)
        //         break
        //       case 0:
        //         ReactAppend(container, <span className='badge bg-danger rounded-pill'>Inactivo</span>)
        //         break
        //       default:
        //         ReactAppend(container, <span className='badge bg-dark rounded-pill'>Eliminado</span>)
        //         break
        //     }
        //   }
        // },
        {
          caption: 'Acciones',
          cellTemplate: (container, { data }) => {
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-primary',
              title: 'Editar',
              icon: 'fa fa-pen',
              onClick: () => onModalOpen(data)
            }))
            // container.append(DxButton({
            //   className: 'btn btn-xs btn-soft-danger',
            //   title: 'Eliminar',
            //   icon: 'fa fa-trash',
            //   onClick: () => onDeleteClicked(data.id)
            // }))
          },
          allowFiltering: false,
          allowExporting: false
        }
      ]} />
    <Modal modalRef={modalRef} title={isEditing ? 'Editar about' : 'Agregar about'} onSubmit={onModalSubmit} size='md'>
      <div className='row' id='benefits-container'>
        <input ref={idRef} type='hidden' />
        <InputFormGroup eRef={nameRef} label='Titulo' col='col-12' rows={2} required disabled />
        <TextareaFormGroup eRef={descriptionRef} label='Descripción' rows={3} />
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {

  createRoot(el).render(<BaseAdminto {...properties} title='Nosotros'>
    <About {...properties} />
  </BaseAdminto>);
})