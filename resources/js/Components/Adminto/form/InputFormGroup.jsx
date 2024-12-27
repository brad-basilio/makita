import React from "react"

const InputFormGroup = ({ col, label, eRef, type = 'text', placeholder, required = false, disabled = false, readOnly = false, value, min, max, step, onChange = () => { } }) => {
  return <div className={`form-group ${col} mb-2`}>
    <label htmlFor='' className="mb-1 form-label">
      {label} {required && <b className="text-danger">*</b>}
    </label>
    <input ref={eRef} type={type} className='form-control' placeholder={placeholder} required={required} disabled={disabled} readOnly={readOnly} defaultValue={value ?? ''} step={step}  onChange={onChange} min={min} max={max}/>
  </div>
}

export default InputFormGroup