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
      notes: notesRef.current.value
    }

    // If the rest client expects files (hasFiles=true) we must send a FormData
    // so PHP/Laravel will correctly parse multipart/form-data and receive fields.
    let payload = request
    if (jobApplicationsRest.hasFiles) {
      const form = new FormData()
      if (request.id) form.append('id', request.id)
      form.append('name', request.name || '')
      form.append('phone', request.phone || '')
      form.append('email', request.email || '')
      form.append('notes', request.notes || '')
      payload = form
    }

    const result = await jobApplicationsRest.save(payload)
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

  const onBooleanChange = async ({ id, field, value }) => {
    console.log('onBooleanChange called with:', { id, field, value });
    const result = await jobApplicationsRest.boolean({ id, field, value });
    console.log('boolean result:', result);
    if (!result) return;

    // Force a complete refresh of the grid data
    const gridInstance = $(gridRef.current).dxDataGrid("instance");
    gridInstance.refresh();

    // Also force a reload of the data source
    setTimeout(() => {
      gridInstance.refresh();
    }, 100);
  };
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
          dataField: 'seen',
          caption: 'Visto',
          width: '10%',
          cellTemplate: (container, { data }) => {
            console.log('Rendering seen cell for ID:', data.id, 'seen value:', data.seen, 'type:', typeof data.seen);
            const is_seenValue = data.seen === 1 || data.seen === '1' || data.seen === true;
            console.log('is_seenValue calculated as:', is_seenValue);
            ReactAppend(container,
              <SwitchFormGroup
                checked={is_seenValue}
                onChange={(e) => {
                  console.log('Switch clicked, checked:', e.target.checked);
                  onBooleanChange({
                    id: data.id,
                    field: "seen",
                    value: e.target.checked ? 1 : 0,
                  })
                }}
              />
            )
          }
        },
        {
          dataField: 'visible',
          caption: 'Visible',
          width: '10%',
          cellTemplate: (container, { data }) => {
            console.log('Rendering visible cell for ID:', data.id, 'visible value:', data.visible, 'type:', typeof data.visible);
            const is_visibleValue = data.visible === 1 || data.visible === '1' || data.visible === true;
            console.log('is_visibleValue calculated as:', is_visibleValue);
            ReactAppend(container,
              <SwitchFormGroup
                checked={is_visibleValue}
                onChange={(e) => {
                  console.log('Visible switch clicked, checked:', e.target.checked);
                  onBooleanChange({
                    id: data.id,
                    field: "visible",
                    value: e.target.checked ? 1 : 0,
                  })
                }}
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
        <InputFormGroup eRef={nameRef} label='Nombre completo' col='col-md-12' readOnly={true} />
        <InputFormGroup eRef={emailRef} label='Email' col='col-md-12' readOnly={true} />
        <InputFormGroup eRef={phoneRef} label='Teléfono' col='col-md-12' readOnly={true} />

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
