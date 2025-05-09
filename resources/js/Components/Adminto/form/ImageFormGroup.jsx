import React, { useEffect, useRef } from "react"

const ImageFormGroup = ({ id, col, label, eRef, required = false, onChange = () => { }, aspect = '21/9'}) => {

  if (!id) id = `ck-${crypto.randomUUID()}`
  if (!eRef) eRef = useRef()

  const imageRef = useRef()

  const onImageChange = async (e) => {
    const file = e.target.files[0]
    const url = await File.toURL(file)
    imageRef.current.src = url
    onChange(e)
  }

  useEffect(() => {
    eRef.image = imageRef.current
  }, [null])

  return <div className={`form-group ${col} mb-2`}>
    <label htmlFor={id} className="form-label">
      {label} {required && <b className="text-danger">*</b>}
    </label>
    <label htmlFor={id} style={{width: '100%'}}>
      <img ref={imageRef} className="d-block border" src="" onError={e => e.target.src = '/api/cover/thumbnail/null'} style={{
        width: '100%',
        borderRadius: '4px',
        cursor: 'pointer',
        aspectRatio: aspect,
        objectFit: 'cover',
        objectPosition: 'center',
        boxShadow: '2.5px 2.5px 5px rgba(0,0,0,.125)'
      }} />
    </label>
    <input ref={eRef} id={id} type="file" src="" alt="" hidden accept="image/*" onChange={onImageChange} />
  </div>
}

export default ImageFormGroup