import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import Table from '../Components/Adminto/Table';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import ReactAppend from '../Utils/ReactAppend';
import DxButton from '../Components/dx/DxButton';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import Swal from 'sweetalert2';
import JobApplicationsRest from '../Actions/Admin/JobApplicationsRest';
import { renderToString } from 'react-dom/server';
import TextareaFormGroup from '../Components/Adminto/form/TextareaFormGroup';
import Modal from '../Components/Adminto/Modal';

const jobApplicationsRest = new JobApplicationsRest();

const JobApplications = ({ }) => {
  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const nameRef = useRef()
  const phoneRef = useRef()
  const emailRef = useRef()
  const statusRef = useRef()
  const visibleRef = useRef()
  const seenRef = useRef()
  const notesRef = useRef()

  const [isEditing, setIsEditing] = useState(false)

  const getStatusBadge = (status) => {
    return status 
      ? '<span class="badge badge-success">Activo</span>'
      : '<span class="badge badge-secondary">Inactivo</span>'
  }

  const getSeenBadge = (seen) => {
    return seen 
      ? '<span class="badge badge-info">Visto</span>'
      : '<span class="badge badge-warning">No visto</span>'
  }

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    nameRef.current.value = data?.name ?? ''
    phoneRef.current.value = data?.phone ?? ''
    emailRef.current.value = data?.email ?? ''
    $(statusRef.current).prop('checked', data?.status ?? true)
    $(visibleRef.current).prop('checked', data?.visible ?? true)
    $(seenRef.current).prop('checked', data?.seen ?? false)
    notesRef.current.value = data?.notes ?? ''
    
    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      name: nameRef.current.value,
      phone: phoneRef.current.value,
      email: emailRef.current.value,
      status: $(statusRef.current).is(':checked'),
      visible: $(visibleRef.current).is(':checked'),
      seen: $(seenRef.current).is(':checked'),
      notes: notesRef.current.value
    }

    const result = await jobApplicationsRest.save(request)
    if (!result) return

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar solicitud',
      text: '¿Estás seguro de eliminar esta solicitud de empleo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await jobApplicationsRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const downloadCV = (filename) => {
    window.open(`/api/admin/job-applications/media/${filename}`, '_blank')
  }

  const toggleStatus = async ({ id, value }) => {
    await jobApplicationsRest.boolean({ id, field: 'status', value })
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const toggleVisible = async ({ id, value }) => {
    await jobApplicationsRest.boolean({ id, field: 'visible', value })
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const toggleSeen = async ({ id, value }) => {
    await jobApplicationsRest.boolean({ id, field: 'seen', value })
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  return (<>
    <Table gridRef={gridRef} title='Solicitudes de Empleo' rest={jobApplicationsRest}
      toolBar={(container) => {
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'refresh',
            hint: 'Refrescar tabla',
            onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
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
          dataField: 'name',
          caption: 'Nombre',
          width: '20%'
        },
        {
          dataField: 'email',
          caption: 'Email',
          width: '20%'
        },
        {
          dataField: 'phone',
          caption: 'Teléfono',
          width: '15%'
        },
        {
          dataField: 'cv_file',
          caption: 'CV',
          width: '10%',
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            if (data.cv_file) {
              ReactAppend(container, 
                <button 
                  className="btn btn-xs btn-soft-primary"
                  onClick={() => downloadCV(data.cv_file)}
                  title="Descargar CV"
                >
                  <i className="fa fa-download"></i> CV
                </button>
              )
            } else {
              container.html('<i class="text-muted">Sin CV</i>')
            }
          }
        },
        {
          dataField: 'status',
          caption: 'Estado',
          width: '10%',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, 
              <SwitchFormGroup 
                checked={data.status} 
                onChange={(value) => toggleStatus({ id: data.id, value })} 
              />
            )
          }
        },
        {
          dataField: 'visible',
          caption: 'Visible',
          width: '10%',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, 
              <SwitchFormGroup 
                checked={data.visible} 
                onChange={(value) => toggleVisible({ id: data.id, value })} 
              />
            )
          }
        },
        {
          dataField: 'seen',
          caption: 'Visto',
          width: '10%',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, 
              <SwitchFormGroup 
                checked={data.seen} 
                onChange={(value) => toggleSeen({ id: data.id, value })} 
              />
            )
          }
        },
        {
          dataField: 'created_at',
          caption: 'Fecha',
          width: '15%',
          cellTemplate: (container, { data }) => {
            container.html(moment(data.created_at).format('DD/MM/YYYY HH:mm'))
          }
        },
        {
          caption: 'Acciones',
          width: '8%',
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
    <Modal modalRef={modalRef} title={isEditing ? 'Editar solicitud' : 'Ver solicitud'} onSubmit={onModalSubmit} size='md'>
      <div className='row' id='principal-container'>
        <input ref={idRef} type='hidden' />
        <InputFormGroup eRef={nameRef} label='Nombre completo' col='col-md-6' readOnly={true} />
        <InputFormGroup eRef={emailRef} label='Email' col='col-md-6' readOnly={true} />
        <InputFormGroup eRef={phoneRef} label='Teléfono' col='col-md-6' readOnly={true} />
        <div className='col-md-6'>
          <SwitchFormGroup eRef={statusRef} label='Estado activo' />
        </div>
        <div className='col-md-6'>
          <SwitchFormGroup eRef={visibleRef} label='Visible' />
        </div>
        <div className='col-md-6'>
          <SwitchFormGroup eRef={seenRef} label='Marcado como visto' />
        </div>
        <TextareaFormGroup eRef={notesRef} label='Notas internas' rows={3} />
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Solicitudes de Empleo'>
    <JobApplications {...properties} />
  </BaseAdminto>);
})
