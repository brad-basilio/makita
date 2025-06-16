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
import ServicePointRest from '../Actions/Admin/ServicePointRest';
import { renderToString } from 'react-dom/server';
import TextareaFormGroup from '../Components/Adminto/form/TextareaFormGroup';
import Modal from '../Components/Adminto/Modal';
import SelectFormGroup from '../Components/Adminto/form/SelectFormGroup';

const servicePointRest = new ServicePointRest();

const ServicePoints = ({ }) => {
  const gridRef = useRef()
  const modalRef = useRef()
  // Form elements ref
  const idRef = useRef()
  const typeRef = useRef()
  const nameRef = useRef()
  const businessNameRef = useRef()
  const addressRef = useRef()
  const phonesRef = useRef()
  const emailsRef = useRef()
  const openingHoursRef = useRef()
  const locationRef = useRef()
  const statusRef = useRef()
  const visibleRef = useRef()

  const [isEditing, setIsEditing] = useState(false)
  const [branches, setBranches] = useState([])
  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    typeRef.current.value = data?.type ?? 'distributor'
    nameRef.current.value = data?.name ?? ''
    businessNameRef.current.value = data?.business_name ?? ''
    addressRef.current.value = data?.address ?? ''
    phonesRef.current.value = data?.phones ?? ''
    emailsRef.current.value = data?.emails ?? ''
    openingHoursRef.current.value = data?.opening_hours ?? ''
    locationRef.current.value = data?.location ?? ''
    
    // Set branches state
    setBranches(data?.branches || [])
    
    if (data?.status) {
      $(statusRef.current).prop('checked', true).trigger('change')
    } else {
      $(statusRef.current).prop('checked', false).trigger('change')
    }
    
    if (data?.visible) {
      $(visibleRef.current).prop('checked', true).trigger('change')
    } else {
      $(visibleRef.current).prop('checked', false).trigger('change')
    }
    
    $(modalRef.current).modal('show')
  }
  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      type: typeRef.current.value,
      name: nameRef.current.value,
      business_name: businessNameRef.current.value,
      address: addressRef.current.value,
      phones: phonesRef.current.value,
      emails: emailsRef.current.value,
      opening_hours: openingHoursRef.current.value,
      location: locationRef.current.value,
      branches: branches.length > 0 ? branches : null,
      status: statusRef.current.checked ? 1 : 0,
      visible: visibleRef.current.checked ? 1 : 0
    }

    const result = await servicePointRest.save(request)
    if (!result) return

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await servicePointRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onStatusChange = async ({ id, value }) => {
    const result = await servicePointRest.boolean({ id, field: 'status', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar punto de servicio',
      text: '¿Estás seguro de eliminar este punto de servicio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await servicePointRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const getTypeLabel = (type) => {
    return type === 'distributor' ? 'Distribuidor' : 'Red de Servicio'
  }

  const getTypeBadgeClass = (type) => {
    return type === 'distributor' ? 'badge-soft-primary' : 'badge-soft-success'
  }

  // Functions for dynamic branches management
  const addBranch = () => {
    setBranches([...branches, {
      name: '',
      address: '',
      phones: '',
      emails: '',
      opening_hours: '',
      location: ''
    }])
  }

  const removeBranch = (index) => {
    setBranches(branches.filter((_, i) => i !== index))
  }

  const updateBranch = (index, field, value) => {
    const updatedBranches = branches.map((branch, i) => 
      i === index ? { ...branch, [field]: value } : branch
    )
    setBranches(updatedBranches)
  }

  return (<>
    <Table gridRef={gridRef} title='Puntos de Servicio' rest={servicePointRest}
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
            text: 'Nuevo punto de servicio',
            hint: 'Nuevo punto de servicio',
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
          dataField: 'type',
          caption: 'Tipo',
          width: '120px',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, 
              <span className={`badge ${getTypeBadgeClass(data.type)}`}>
                {getTypeLabel(data.type)}
              </span>
            )
          }
        },
        {
          dataField: 'name',
          caption: 'Información',
          width: '40%',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, 
              <div>
                <p className='mb-1'><strong>{data.name}</strong></p>
                {data.business_name && <p className='mb-1 text-muted small'>{data.business_name}</p>}
                {data.address && <p className='mb-0 text-muted small'><i className='fa fa-map-marker-alt me-1'></i>{data.address}</p>}
              </div>
            )
          }
        },
        {
          dataField: 'phones',
          caption: 'Contacto',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, 
              <div>
                {data.phones && <p className='mb-1 small'><i className='fa fa-phone me-1'></i>{data.phones}</p>}
                {data.emails && <p className='mb-0 small'><i className='fa fa-envelope me-1'></i>{data.emails}</p>}
              </div>
            )
          }
        },
        {
          dataField: 'opening_hours',
          caption: 'Horarios',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, 
              data.opening_hours 
                ? <small>{data.opening_hours}</small>
                : <i className='text-muted'>No especificado</i>
            )
          }
        },
        {
          dataField: 'branches',
          caption: 'Sucursales',
          width: '100px',
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            const branchCount = data.branches ? data.branches.length : 0;
            ReactAppend(container, 
              <span className={`badge ${branchCount > 0 ? 'badge-soft-info' : 'badge-soft-secondary'}`}>
                {branchCount} sucursal{branchCount !== 1 ? 'es' : ''}
              </span>
            )
          }
        },
        {
          dataField: 'status',
          caption: 'Activo',
          dataType: 'boolean',
          width: '80px',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <SwitchFormGroup checked={data.status} onChange={(e) => onStatusChange({ id: data.id, value: e.target.checked })} />)
          }
        },
        {
          dataField: 'visible',
          caption: 'Visible',
          dataType: 'boolean',
          width: '80px',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <SwitchFormGroup checked={data.visible} onChange={(e) => onVisibleChange({ id: data.id, value: e.target.checked })} />)
          }
        },
        {
          caption: 'Acciones',
          width: '120px',
          cellTemplate: (container, { data }) => {
            container.css('text-overflow', 'unset')
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-primary me-1',
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
      <Modal modalRef={modalRef} title={isEditing ? 'Editar punto de servicio' : 'Agregar punto de servicio'} onSubmit={onModalSubmit} size='lg'>
      <div className='row' id='principal-container'>
        <input ref={idRef} type='hidden' />
        
        <SelectFormGroup 
          eRef={typeRef} 
          label='Tipo' 
          col='col-md-6'
          dropdownParent={"#principal-container"}
          
          required 
        >
            <option value='distributor'>Distribuidor</option>
            <option value='service_network'>Red de Servicio</option>
        </SelectFormGroup>S
        
  
        
        <InputFormGroup eRef={nameRef} label='Nombre' col='col-md-8' required />
        <InputFormGroup eRef={businessNameRef} label='Razón Social' col='col-md-4' />
        
        <TextareaFormGroup eRef={addressRef} label='Dirección' rows={2} />
        
        <TextareaFormGroup 
          eRef={phonesRef} 
          label='Teléfonos' 
          col='col-md-4'
          rows={2}
          specification='Separar múltiples teléfonos con comas'
        />
        
        <TextareaFormGroup 
          eRef={emailsRef} 
          label='Correos Electrónicos' 
          col='col-md-4'
          rows={2}
          specification='Separar múltiples emails con comas'
        />
        
        <TextareaFormGroup 
          eRef={openingHoursRef} 
          label='Horarios de Atención' 
          col='col-md-4'
          rows={2}
          specification='Ej: L-V: 8:00-18:00, S: 9:00-15:00'
        />
        
        <TextareaFormGroup 
          eRef={locationRef} 
          label='Ubicación (Latitud, Longitud)' 
          rows={1}
          specification='Ej: -12.0464, -77.0428'
        />
        
        {/* Dynamic Branches Section */}
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <label className="form-label mb-0">Sucursales</label>
            <button 
              type="button" 
              className="btn btn-sm btn-soft-primary"
              onClick={addBranch}
            >
              <i className="fa fa-plus me-1"></i>Agregar Sucursal
            </button>
          </div>
          
          {branches.length === 0 && (
            <div className="alert alert-info">
              <i className="fa fa-info-circle me-2"></i>
              No hay sucursales agregadas. Haz clic en "Agregar Sucursal" para crear una.
            </div>
          )}
          
          {branches.map((branch, index) => (
            <div key={index} className="card mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Sucursal #{index + 1}</h6>
                <button 
                  type="button" 
                  className="btn btn-sm btn-soft-danger"
                  onClick={() => removeBranch(index)}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={branch.name}
                      onChange={(e) => updateBranch(index, 'name', e.target.value)}
                      placeholder="Nombre de la sucursal"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Dirección</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={branch.address}
                      onChange={(e) => updateBranch(index, 'address', e.target.value)}
                      placeholder="Dirección completa"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Teléfonos</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={branch.phones}
                      onChange={(e) => updateBranch(index, 'phones', e.target.value)}
                      placeholder="Separar con comas"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Correos</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={branch.emails}
                      onChange={(e) => updateBranch(index, 'emails', e.target.value)}
                      placeholder="Separar con comas"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Horarios</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={branch.opening_hours}
                      onChange={(e) => updateBranch(index, 'opening_hours', e.target.value)}
                      placeholder="L-V: 8:00-18:00"
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Ubicación (Lat, Lng)</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={branch.location}
                      onChange={(e) => updateBranch(index, 'location', e.target.value)}
                      placeholder="-12.0464, -77.0428"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  </>)
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Puntos de Servicio'>
    <ServicePoints {...properties} />
  </BaseAdminto>);
})
