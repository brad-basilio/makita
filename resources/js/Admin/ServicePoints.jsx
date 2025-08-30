import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
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
import Global from '../Utils/Global';

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
  // Removed unused refs - now using state management
  // statusRef y visibleRef eliminados - valores por defecto en true

  const [isEditing, setIsEditing] = useState(false)
  const [branches, setBranches] = useState([])
  const [phones, setPhones] = useState([''])
  const [emails, setEmails] = useState([''])
  const [openingHours, setOpeningHours] = useState([{ day: 'Lun - Vie', hours: '08:00 - 20:00' }])
  const [location, setLocation] = useState({ lat: -12.0464, lng: -77.0428 })
  const [activeMapTab, setActiveMapTab] = useState('main') // 'main' or branch index
  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    typeRef.current.value = data?.type ?? 'distributor'
    nameRef.current.value = data?.name ?? ''
    businessNameRef.current.value = data?.business_name ?? ''
    addressRef.current.value = data?.address ?? ''
    
    // Parse phones
    const phonesArray = data?.phones ? data.phones.split(',').map(p => p.trim()).filter(p => p) : ['']
    setPhones(phonesArray.length > 0 ? phonesArray : [''])
    
    // Parse emails
    const emailsArray = data?.emails ? data.emails.split(',').map(e => e.trim()).filter(e => e) : ['']
    setEmails(emailsArray.length > 0 ? emailsArray : [''])
    
    // Parse opening hours
    const hoursArray = data?.opening_hours ? 
      data.opening_hours.split('\n').map(line => {
        const parts = line.split(':')
        return parts.length >= 2 ? { day: parts[0].trim(), hours: parts.slice(1).join(':').trim() } : { day: line.trim(), hours: '' }
      }).filter(h => h.day) : 
      [{ day: 'Lun - Vie', hours: '08:00 - 20:00' }]
    setOpeningHours(hoursArray.length > 0 ? hoursArray : [{ day: 'Lun - Vie', hours: '08:00 - 20:00' }])
    
    // Parse location
    if (data?.location) {
      const locationParts = data.location.split(',')
      if (locationParts.length >= 2) {
        const lat = parseFloat(locationParts[0].trim())
        const lng = parseFloat(locationParts[1].trim())
        if (!isNaN(lat) && !isNaN(lng)) {
          setLocation({ lat, lng })
        }
      }
    } else {
      setLocation({ lat: -12.0464, lng: -77.0428 })
    }
    
    // Set branches state with proper structure
    const branchesData = data?.branches || []
    setBranches(branchesData.map(branch => ({
      name: branch.name || '',
      address: branch.address || '',
      phones: branch.phones ? branch.phones.split(',').map(p => p.trim()).filter(p => p) : [''],
      emails: branch.emails ? branch.emails.split(',').map(e => e.trim()).filter(e => e) : [''],
      opening_hours: branch.opening_hours ? 
        branch.opening_hours.split('\n').map(line => {
          const parts = line.split(':')
          return parts.length >= 2 ? { day: parts[0].trim(), hours: parts.slice(1).join(':').trim() } : { day: line.trim(), hours: '' }
        }).filter(h => h.day) : 
        [{ day: 'Lun - Vie', hours: '08:00 - 20:00' }],
      location: branch.location ? (() => {
        const parts = branch.location.split(',')
        if (parts.length >= 2) {
          const lat = parseFloat(parts[0].trim())
          const lng = parseFloat(parts[1].trim())
          if (!isNaN(lat) && !isNaN(lng)) {
            return { lat, lng }
          }
        }
        return { lat: -12.0464, lng: -77.0428 }
      })() : { lat: -12.0464, lng: -77.0428 }
    })))
    
    setActiveMapTab('main')
    
    
    
    
    
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
      phones: phones.filter(p => p.trim()).join(', '),
      emails: emails.filter(e => e.trim()).join(', '),
      opening_hours: openingHours.filter(h => h.day && h.hours).map(h => `${h.day}: ${h.hours}`).join('\n'),
      location: `${location.lat}, ${location.lng}`,
      branches: branches.length > 0 ? branches.map(branch => ({
         name: branch.name,
         address: branch.address,
         phones: branch.phones.filter(p => p.trim()).join(', '),
         emails: branch.emails.filter(e => e.trim()).join(', '),
         opening_hours: branch.opening_hours.filter(h => h.day && h.hours).map(h => `${h.day}: ${h.hours}`).join('\n'),
         location: `${branch.location.lat}, ${branch.location.lng}`
       })) : [],
       status: 1, // Por defecto activo
      visible: 1 // Por defecto visible
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

  // Phone management functions
  const addPhone = () => {
    setPhones([...phones, ''])
  }

  const removePhone = (index) => {
    if (phones.length > 1) {
      setPhones(phones.filter((_, i) => i !== index))
    }
  }

  const updatePhone = (index, value) => {
    const updatedPhones = [...phones]
    updatedPhones[index] = value
    setPhones(updatedPhones)
  }

  // Email management functions
  const addEmail = () => {
    setEmails([...emails, ''])
  }

  const removeEmail = (index) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index))
    }
  }

  const updateEmail = (index, value) => {
    const updatedEmails = [...emails]
    updatedEmails[index] = value
    setEmails(updatedEmails)
  }

  // Opening hours management functions
  const addOpeningHour = () => {
    setOpeningHours([...openingHours, { day: '', hours: '' }])
  }

  const removeOpeningHour = (index) => {
    if (openingHours.length > 1) {
      setOpeningHours(openingHours.filter((_, i) => i !== index))
    }
  }

  const updateOpeningHour = (index, field, value) => {
    const updatedHours = [...openingHours]
    updatedHours[index][field] = value
    setOpeningHours(updatedHours)
  }

  // Map click handler
  const handleMapClick = (event) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()
    
    if (activeMapTab === 'main') {
      setLocation({ lat, lng })
    } else {
      const branchIndex = parseInt(activeMapTab)
      if (!isNaN(branchIndex) && branches[branchIndex]) {
        updateBranch(branchIndex, 'location', { lat, lng })
      }
    }
  }

  // Functions for dynamic branches management
  const addBranch = () => {
    setBranches([...branches, {
      name: '',
      address: '',
      phones: [''],
      emails: [''],
      opening_hours: [{ day: 'Lun - Vie', hours: '08:00 - 20:00' }],
      location: { lat: -12.0464, lng: -77.0428 }
    }])
  }

  const removeBranch = (index) => {
    setBranches(branches.filter((_, i) => i !== index))
    if (activeMapTab === index.toString()) {
      setActiveMapTab('main')
    }
  }

  const updateBranch = (index, field, value) => {
    const updatedBranches = branches.map((branch, i) => 
      i === index ? { ...branch, [field]: value } : branch
    )
    setBranches(updatedBranches)
  }

  // Branch phone management
  const addBranchPhone = (branchIndex) => {
    const updatedBranches = [...branches]
    updatedBranches[branchIndex].phones.push('')
    setBranches(updatedBranches)
  }

  const removeBranchPhone = (branchIndex, phoneIndex) => {
    const updatedBranches = [...branches]
    if (updatedBranches[branchIndex].phones.length > 1) {
      updatedBranches[branchIndex].phones = updatedBranches[branchIndex].phones.filter((_, i) => i !== phoneIndex)
      setBranches(updatedBranches)
    }
  }

  const updateBranchPhone = (branchIndex, phoneIndex, value) => {
    const updatedBranches = [...branches]
    updatedBranches[branchIndex].phones[phoneIndex] = value
    setBranches(updatedBranches)
  }

  // Branch email management
  const addBranchEmail = (branchIndex) => {
    const updatedBranches = [...branches]
    updatedBranches[branchIndex].emails.push('')
    setBranches(updatedBranches)
  }

  const removeBranchEmail = (branchIndex, emailIndex) => {
    const updatedBranches = [...branches]
    if (updatedBranches[branchIndex].emails.length > 1) {
      updatedBranches[branchIndex].emails = updatedBranches[branchIndex].emails.filter((_, i) => i !== emailIndex)
      setBranches(updatedBranches)
    }
  }

  const updateBranchEmail = (branchIndex, emailIndex, value) => {
    const updatedBranches = [...branches]
    updatedBranches[branchIndex].emails[emailIndex] = value
    setBranches(updatedBranches)
  }

  // Branch opening hours management
  const addBranchOpeningHour = (branchIndex) => {
    const updatedBranches = [...branches]
    updatedBranches[branchIndex].opening_hours.push({ day: '', hours: '' })
    setBranches(updatedBranches)
  }

  const removeBranchOpeningHour = (branchIndex, hourIndex) => {
    const updatedBranches = [...branches]
    if (updatedBranches[branchIndex].opening_hours.length > 1) {
      updatedBranches[branchIndex].opening_hours = updatedBranches[branchIndex].opening_hours.filter((_, i) => i !== hourIndex)
      setBranches(updatedBranches)
    }
  }

  const updateBranchOpeningHour = (branchIndex, hourIndex, field, value) => {
    const updatedBranches = [...branches]
    updatedBranches[branchIndex].opening_hours[hourIndex][field] = value
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
      <Modal modalRef={modalRef} title={isEditing ? 'Editar punto de servicio' : 'Agregar punto de servicio'} onSubmit={onModalSubmit} size='xl'>
      <div className='row' id='principal-container'>
        {/* Columna izquierda - Formulario */}
        <div className='col-md-6'>
          <input ref={idRef} type='hidden' />
          
          <SelectFormGroup 
            eRef={typeRef} 
            label='Tipo' 
            col='col-12'
            dropdownParent={"#principal-container"}
            required 
          >
              <option value='distributor'>Distribuidor</option>
              <option value='service_network'>Red de Servicio</option>
          </SelectFormGroup>
          
          <InputFormGroup eRef={nameRef} label='Nombre' col='col-12' required />
          <InputFormGroup eRef={businessNameRef} label='Razón Social' col='col-12' />
        
          <TextareaFormGroup eRef={addressRef} label='Dirección' rows={2} col='col-12' />
        
          {/* Teléfonos dinámicos */}
          <div className='col-12'>
            <div className='form-group'>
              <div className='d-flex justify-content-between align-items-center mb-3 mt-3'>
                <label className='form-label mb-0'>Teléfonos</label>
                <button
                  type='button'
                  className='btn btn-sm btn-outline-primary'
                  onClick={addPhone}
                >
                  <i className='fa fa-plus me-1'></i>Agregar
                </button>
              </div>
              {phones.map((phone, index) => (
                <div key={index} className='input-group mb-2'>
                  <input
                    type='text'
                    className='form-control'
                    value={phone}
                    onChange={(e) => updatePhone(index, e.target.value)}
                    placeholder={`Teléfono ${index + 1}`}
                  />
                  {phones.length > 1 && (
                    <div className='input-group-append'>
                      <button
                        type='button'
                        className='btn btn-outline-danger'
                        onClick={() => removePhone(index)}
                        title='Eliminar teléfono'
                      >
                        <i className='fa fa-trash'></i>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Emails dinámicos */}
          <div className='col-12'>
            <div className='form-group'>
              <div className='d-flex justify-content-between align-items-center mb-2'>
                <label className='form-label mb-0'>Emails</label>
                <button
                  type='button'
                  className='btn btn-sm btn-outline-primary'
                  onClick={addEmail}
                >
                  <i className='fa fa-plus me-1'></i>Agregar
                </button>
              </div>
              {emails.map((email, index) => (
                <div key={index} className='input-group mb-2'>
                  <input
                    type='email'
                    className='form-control'
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder={`Email ${index + 1}`}
                  />
                  {emails.length > 1 && (
                    <div className='input-group-append'>
                      <button
                        type='button'
                        className='btn btn-outline-danger'
                        onClick={() => removeEmail(index)}
                        title='Eliminar email'
                      >
                        <i className='fa fa-trash'></i>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Horarios de atención dinámicos */}
          <div className='col-12'>
            <div className='form-group'>
              <div className='d-flex justify-content-between align-items-center mb-2'>
                <label className='form-label mb-0'>Horarios de Atención</label>
                <button
                  type='button'
                  className='btn btn-sm btn-outline-primary'
                  onClick={addOpeningHour}
                >
                  <i className='fa fa-plus me-1'></i>Agregar
                </button>
              </div>
              {openingHours.map((hour, index) => (
                <div key={index} className='row mb-2'>
                  <div className='col-md-4'>
                    <input
                      type='text'
                      className='form-control'
                      value={hour.day}
                      onChange={(e) => updateOpeningHour(index, 'day', e.target.value)}
                      placeholder='Ej: Lun - Vie'
                    />
                  </div>
                  <div className='col-md-6'>
                    <input
                      type='text'
                      className='form-control'
                      value={hour.hours}
                      onChange={(e) => updateOpeningHour(index, 'hours', e.target.value)}
                      placeholder='Ej: 08:00 - 20:00'
                    />
                  </div>
                  <div className='col-md-2'>
                    {openingHours.length > 1 && (
                      <button
                        type='button'
                        className='btn btn-outline-danger btn-sm'
                        onClick={() => removeOpeningHour(index)}
                        title='Eliminar horario'
                      >
                        <i className='fa fa-trash'></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        
        {/* Dynamic Branches Section */}
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3 mt-4 p-3 bg-light rounded">
            <label className="form-label mb-0 fw-bold">Sucursales</label>
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
          
          {branches.map((branch, branchIndex) => (
            <div key={branchIndex} className="card mb-4 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center bg-light">
                <h6 className="mb-0 fw-bold text-primary">Sucursal #{branchIndex + 1}</h6>
                <button 
                  type="button" 
                  className="btn btn-sm btn-soft-danger"
                  onClick={() => removeBranch(branchIndex)}
                  title="Eliminar sucursal"
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-12">
                    <label className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={branch.name}
                      onChange={(e) => updateBranch(branchIndex, 'name', e.target.value)}
                      placeholder="Nombre de la sucursal"
                    />
                  </div>
                  <div className="col-md-12 mt-2">
                    <label className="form-label">Dirección</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={branch.address}
                      onChange={(e) => updateBranch(branchIndex, 'address', e.target.value)}
                      placeholder="Dirección completa"
                    />
                  </div>
                  
                  {/* Teléfonos dinámicos para sucursal */}
                  <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
                      <label className="form-label mb-0">Teléfonos</label>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => addBranchPhone(branchIndex)}
                      >
                        <i className="fa fa-plus me-1"></i>Agregar
                      </button>
                    </div>
                    {branch.phones.map((phone, phoneIndex) => (
                      <div key={phoneIndex} className="input-group mb-1">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={phone}
                          onChange={(e) => updateBranchPhone(branchIndex, phoneIndex, e.target.value)}
                          placeholder={`Teléfono ${phoneIndex + 1}`}
                        />
                        {branch.phones.length > 1 && (
                          <div className="input-group-append">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeBranchPhone(branchIndex, phoneIndex)}
                              title="Eliminar teléfono"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Emails dinámicos para sucursal */}
                  <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label mb-0">Emails</label>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => addBranchEmail(branchIndex)}
                      >
                        <i className="fa fa-plus me-1"></i>Agregar
                      </button>
                    </div>
                    {branch.emails.map((email, emailIndex) => (
                      <div key={emailIndex} className="input-group mb-1">
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          value={email}
                          onChange={(e) => updateBranchEmail(branchIndex, emailIndex, e.target.value)}
                          placeholder={`Email ${emailIndex + 1}`}
                        />
                        {branch.emails.length > 1 && (
                          <div className="input-group-append">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeBranchEmail(branchIndex, emailIndex)}
                              title="Eliminar email"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Horarios dinámicos para sucursal */}
                  <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label mb-0">Horarios de Atención</label>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => addBranchOpeningHour(branchIndex)}
                      >
                        <i className="fa fa-plus me-1"></i>Agregar
                      </button>
                    </div>
                    {branch.opening_hours.map((hour, hourIndex) => (
                      <div key={hourIndex} className="row mb-1">
                        <div className="col-5">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={hour.day}
                            onChange={(e) => updateBranchOpeningHour(branchIndex, hourIndex, 'day', e.target.value)}
                            placeholder="Días"
                          />
                        </div>
                        <div className="col-5">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={hour.hours}
                            onChange={(e) => updateBranchOpeningHour(branchIndex, hourIndex, 'hours', e.target.value)}
                            placeholder="Horario"
                          />
                        </div>
                        <div className="col-2">
                          {branch.opening_hours.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeBranchOpeningHour(branchIndex, hourIndex)}
                              title="Eliminar horario"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label">Ubicación de la Sucursal</label>
                    <div className="mb-2">
                      <small className="text-muted">
                        Coordenadas: {branch.location.lat.toFixed(6)}, {branch.location.lng.toFixed(6)}
                      </small>
                    </div>
                    <small className="text-muted">
                      Para cambiar la ubicación, selecciona "Sucursal {branchIndex + 1}" en el mapa de la derecha
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        </div>
        
        {/* Columna derecha - Mapa */}
        <div className='col-md-6'>
          <div className='col-12'>
            <div className='form-group'>
              <label>Ubicación en el Mapa</label>
              <div className='mb-2'>
                <small className='text-muted'>Haz clic en el mapa para seleccionar la ubicación</small>
              </div>
              <div className='mb-2'>
                <div className="nav nav-tabs mb-3 p-2 bg-light rounded" role="tablist" style={{gap: '8px'}}>
                  <button
                    type='button'
                    className={`nav-link ${activeMapTab === 'main' ? 'active' : ''} px-3 py-2`}
                    onClick={() => setActiveMapTab('main')}
                    style={{marginRight: '8px', borderRadius: '6px'}}
                  >
                    <i className="fa fa-map-marker-alt me-1"></i>Ubicación Principal
                  </button>
                  {branches.map((_, index) => (
                    <button
                      key={index}
                      type='button'
                      className={`nav-link ${activeMapTab === index.toString() ? 'active' : ''} px-3 py-2`}
                      onClick={() => setActiveMapTab(index.toString())}
                      style={{marginRight: '8px', borderRadius: '6px'}}
                    >
                      <i className="fa fa-building me-1"></i>Sucursal {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              <LoadScript 
                googleMapsApiKey={Global.GMAPS_API_KEY}
                preventGoogleFontsLoading={true}
                loadingElement={<div>Cargando mapa...</div>}
              >
                <div style={{ height: '500px', width: '100%', marginTop: '15px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e3e6f0' }}>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={activeMapTab === 'main' ? location : (branches[parseInt(activeMapTab)]?.location || location)}
                    zoom={15}
                    onClick={handleMapClick}
                  >
                  <Marker
                    position={activeMapTab === 'main' ? location : (branches[parseInt(activeMapTab)]?.location || location)}
                  />
                  </GoogleMap>
                </div>
              </LoadScript>
              <div className='mt-2'>
                <small className='text-muted'>
                  Coordenadas: {activeMapTab === 'main' ? 
                    `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 
                    (branches[parseInt(activeMapTab)]?.location ? 
                      `${branches[parseInt(activeMapTab)].location.lat.toFixed(6)}, ${branches[parseInt(activeMapTab)].location.lng.toFixed(6)}` : 
                      'No seleccionada'
                    )
                  }
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </>)
}

CreateReactScript((el, properties) => {
  let root = el._reactRoot;
  if (!root) {
    root = createRoot(el);
    el._reactRoot = root;
  }
  root.render(<BaseAdminto {...properties} title='Puntos de Servicio'>
    <ServicePoints {...properties} />
  </BaseAdminto>);
})
