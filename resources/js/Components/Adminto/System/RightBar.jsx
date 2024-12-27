import React, { useState } from 'react'
import ColorsRest from '../../../Actions/Admin/ColorsRest'
import GalleryRest from '../../../Actions/Admin/GalleryRest'

const galleryRest = new GalleryRest()
const colorsRest = new ColorsRest()

const RigthBar = ({ colors, setColors }) => {

  const [images, setImages] = useState([
    { uuid: crypto.randomUUID(), col: 'col-4', name: "Icon (1:1)", src: "icon.png", width: '40px' },
    { uuid: crypto.randomUUID(), col: 'col-8', name: "Logo (13:4)", src: "logo.png", width: '130px' }
  ])

  const onImageChange = async (e) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    e.target.value = null
    const name = e.target.name

    const formData = new FormData();
    formData.append('image', file)
    formData.append('name', name)

    const result = await galleryRest.save(formData)
    if (!result) return
    setImages(old => {
      return old.map(x => {
        if (x.src == name) x.uuid = crypto.randomUUID()
        return x
      })
    })
  }

  const onColorChange = async (e) => {
    const id = e.target.getAttribute('data-color-id')
    const field = e.target.name
    const value = e.target.value

    const currentColor = colors.find(color => color.id == id)[field];
    if (currentColor === value) return;

    const result = await colorsRest.save({
      id,
      [field]: value
    })
    if (!result) return
    setColors(old => {
      return old.map(x => x.id == id ? result.data : x);
    })
  }

  return (<div className="right-bar">

    <div data-simplebar className="h-100">

      <div className="rightbar-title">
        <a href="#" className="right-bar-toggle float-end">
          <i className="mdi mdi-close"></i>
        </a>
        <h4 className="font-16 m-0 text-white">Configuraciones</h4>
      </div>

      <div className='p-2'>
        <h5>Imágenes principales</h5>
        <div className='row'>
          {
            images.map((image, index) => {
              const uuid = 'file-' + image.uuid
              return <div className={image.col} key={index}>
                <input id={uuid} name={image.src} type="file" accept='image/png' hidden onChange={onImageChange} />
                <label htmlFor={uuid} className='form-label d-block mb-1' style={{ cursor: 'pointer' }}>{image.name}</label>
                <label htmlFor={uuid} style={{ cursor: 'pointer' }}>
                  <img className='border' src={`/assets/resources/${image.src}?v=${image.uuid}`} alt="" style={{
                    height: '40px',
                    width: image.width,
                    objectFit: 'contain',
                    objectPosition: 'center'
                  }} />
                </label>
              </div>
            })
          }
        </div>
        <hr className='my-2' />
        <h5>Colores del sistema</h5>
        <div className='d-flex flex-column gap-1'>
          {
            colors.map((color, index) => {
              return <div className="input-group input-group-sm" key={index}>
                <span className="input-group-text px-1" >
                  <input type="color" name='description' data-color-id={color.id} className='p-0' style={{
                    width: '20px',
                    height: '20px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }} defaultValue={color.description} onBlur={onColorChange} />
                </span>
                <input type="text" name='name' data-color-id={color.id} className={`form-control form-control-sm`} placeholder="Color" defaultValue={color.name} onBlur={onColorChange} disabled={color.name == 'primary'} style={{
                  cursor: color.name == 'primary' ? 'not-allowed': 'text'
                }} />
              </div>
            })
          }
        </div>
      </div>

    </div>
  </div>)
}

export default RigthBar