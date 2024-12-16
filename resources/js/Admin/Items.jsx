import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import Table from '../Components/Adminto/Table';
import Modal from '../Components/Modal';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import ReactAppend from '../Utils/ReactAppend';
import DxButton from '../Components/dx/DxButton';
import TextareaFormGroup from '@Adminto/form/TextareaFormGroup';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import SelectFormGroup from '../Components/Adminto/form/SelectFormGroup';
import Swal from 'sweetalert2';
import ItemsRest from '../Actions/Admin/ItemsRest';
import QuillFormGroup from '../Components/Adminto/form/QuillFormGroup';
import { renderToString } from 'react-dom/server';
import SelectAPIFormGroup from '../Components/Adminto/form/SelectAPIFormGroup';
import Number2Currency from '../Utils/Number2Currency';
import SetSelectValue from '../Utils/SetSelectValue';

const itemsRest = new ItemsRest()

const Items = ({ categories, brands }) => {
  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref

  const idRef = useRef()
  const categoryRef = useRef()
  const subcategoryRef = useRef()
  const brandRef = useRef()
  const nameRef = useRef()
  const summaryRef = useRef()
  const priceRef = useRef()
  const discountRef = useRef()
  const tagsRef = useRef()
  const bannerRef = useRef()
  const imageRef = useRef()
  const descriptionRef = useRef()

  const [isEditing, setIsEditing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null);

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id || ''
    $(categoryRef.current).val(data?.category_id || null).trigger('change')
    SetSelectValue(subcategoryRef.current, data?.subcategory?.id, data?.subcategory?.name)
    $(brandRef.current).val(data?.brand_id || null).trigger('change')
    nameRef.current.value = data?.name || ''
    summaryRef.current.value = data?.summary || ''
    priceRef.current.value = data?.price || 0
    discountRef.current.value = data?.discount || 0

    SetSelectValue(tagsRef.current, data?.tags ?? [], 'id', 'name')

    bannerRef.current.value = null
    imageRef.current.value = null
    bannerRef.image.src = `/api/items/media/${data?.banner ?? 'undefined'}`
    imageRef.image.src = `/api/items/media/${data?.image ?? 'undefined'}`

    descriptionRef.editor.root.innerHTML = data?.description ?? ''

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      category_id: categoryRef.current.value,
      subcategory_id: subcategoryRef.current.value,
      brand_id: brandRef.current.value,
      name: nameRef.current.value,
      summary: summaryRef.current.value,
      price: priceRef.current.value,
      discount: discountRef.current.value,
      tags: $(tagsRef.current).val(),
      description: descriptionRef.current.value,
    }

    const formData = new FormData()
    for (const key in request) {
      formData.append(key, request[key])
    }

    const image = imageRef.current.files[0]
    if (image) {
      formData.append('image', image)
    }
    const banner = bannerRef.current.files[0]
    if (banner) {
      formData.append('banner', banner)
    }

    const result = await itemsRest.save(formData)
    if (!result) return

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await itemsRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onBooleanChange = async ({ id, field, value }) => {
    const result = await itemsRest.boolean({ id, field, value })
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
    const result = await itemsRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  return (<>
    <Table gridRef={gridRef} title='Items' rest={itemsRest}
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
      exportable={true}
      exportableName='Items'
      columns={[
        {
          dataField: 'id',
          caption: 'ID',
          visible: false
        },
        {
          dataField: 'category.name',
          caption: 'Categoría',
          width: '120px',
          cellTemplate: (container, { data }) => {
            container.html(renderToString(<>
              <b className='d-block'>{data.category?.name}</b>
              <small className='text-muted'>{data.subcategory?.name}</small>
            </>))
          }
        },
        {
          dataField: 'subcategory.name',
          caption: 'Subcategoría',
          visible: false
        },
        {
          dataField: 'brand.name',
          caption: 'Marca',
          width: '120px'
        },
        {
          dataField: 'name',
          caption: 'Nombre',
          width: '300px',
          cellTemplate: (container, { data }) => {
            container.html(renderToString(<>
              <b>{data.name}</b><br />
              <span className='truncate'>{data.summary}</span>
            </>))
          }
        },
        {
          dataField: 'final_price',
          caption: 'Precio',
          dataType: 'number',
          width: '75px',
          cellTemplate: (container, { data }) => {

            container.html(renderToString(<>
              {data.discount > 0 && <small className='d-block text-muted' style={{ textDecoration: 'line-through' }}>S/.{Number2Currency(data.price)}</small>}
              <span>S/.{Number2Currency(data.discount > 0 ? data.discount : data.price)}</span>
            </>))
          }
        },
        {
          dataField: 'image',
          caption: 'Imagen',
          width: '90px',
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <img src={`/api/items/media/${data.image}`} style={{ width: '80px', height: '48px', objectFit: 'cover', objectPosition: 'center', borderRadius: '4px' }} onError={e => e.target.src = '/api/cover/thumbnail/null'} />)
          }
        },
        {
          dataField: 'is_new',
          caption: 'Nuevo',
          dataType: 'boolean',
          width: '80px',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <SwitchFormGroup checked={data.is_new} onChange={(e) => onBooleanChange({
              id: data.id,
              field: 'is_new',
              value: e.target.checked
            })} />)
          }
        },
        {
          dataField: 'offering',
          caption: 'En oferta',
          dataType: 'boolean',
          width: '80px',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <SwitchFormGroup checked={data.offering} onChange={(e) => onBooleanChange({
              id: data.id,
              field: 'offering',
              value: e.target.checked
            })} />)
          }
        },
        {
          dataField: 'recommended',
          caption: 'Recomendado',
          dataType: 'boolean',
          width: '80px',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <SwitchFormGroup checked={data.recommended} onChange={(e) => onBooleanChange({
              id: data.id,
              field: 'recommended',
              value: e.target.checked
            })} />)
          }
        },
        {
          dataField: 'featured',
          caption: 'Destacado',
          dataType: 'boolean',
          width: '80px',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <SwitchFormGroup checked={data.featured} onChange={(e) => onBooleanChange({
              id: data.id,
              field: 'featured',
              value: e.target.checked
            })} />)
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
          width: '100px',
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
        <div className="col-md-6">
          <SelectFormGroup eRef={categoryRef} label='Categoría' required dropdownParent='#principal-container' onChange={(e) => setSelectedCategory(e.target.value)}>
            {
              categories.map((item, index) => (<option key={index} value={item.id}>{item.name}</option>))
            }
          </SelectFormGroup>
          <SelectAPIFormGroup eRef={subcategoryRef} label='Subcategoría' searchAPI='/api/admin/subcategories/paginate' searchBy='name' filter={['category_id', '=', selectedCategory]} dropdownParent='#principal-container' />

          <SelectFormGroup eRef={brandRef} label='Marca' required dropdownParent='#principal-container'>
            {
              brands.map((item, index) => (<option key={index} value={item.id}>{item.name}</option>))
            }
          </SelectFormGroup>

          <InputFormGroup eRef={nameRef} label='Nombre' required />
          <TextareaFormGroup eRef={summaryRef} label='Resumen' rows={3} required />
          <div className="row">
            <InputFormGroup eRef={priceRef} label='Precio' type='number' col='col-sm-6' step='0.01' required />
            <InputFormGroup eRef={discountRef} label='Descuento' type='number' col='col-sm-6' step='0.01' />
          </div>
          <SelectAPIFormGroup id='tags' eRef={tagsRef} searchAPI={'/api/admin/tags/paginate'} searchBy='name' label='Tags' dropdownParent='#principal-container' tags multiple />
        </div>
        <div className='col-md-6'>
          <div className='row'>
            <ImageFormGroup eRef={bannerRef} label='Banner' aspect={2 / 1} col='col-12' />
            <ImageFormGroup eRef={imageRef} label='Imagen' aspect={1} col='col-lg-6 col-md-12 col-sm-6' />
            <div className='col-lg-6 col-md-12 col-sm-6'>
              <input id='input-item-gallery' type="file" multiple accept='image/' hidden />
              <div style={{ position: 'relative' }}>
                <span className='form-label d-block mb-1' htmlFor="input-item-gallery">Galería</span>
                <button className='btn btn-white rounded-pill btn-xs' style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: 0
                }}>
                  <i className='mdi mdi-plus'></i>
                  Agregar
                </button>
              </div>
              <div className='w-100 bg-primary' style={{ aspectRatio: 1 }}>

              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className='my-1' />
      <QuillFormGroup eRef={descriptionRef} label='Descripcion' />
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Items'>
    <Items {...properties} />
  </BaseAdminto>);
})