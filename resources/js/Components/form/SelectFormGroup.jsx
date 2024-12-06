import React, { useEffect, useRef } from "react"

const SelectFormGroup = ({ col, label, eRef, required = false, children, dropdownParent, multiple = false, disabled = false, onChange = () => { },
  templateResult,
  templateSelection,
  tags = false,
  hidden = false
}) => {

  if (!eRef) eRef = useRef()

  useEffect(() => {
    $(eRef.current).select2({
      dropdownParent,
      templateResult,
      templateSelection,
      tags
    })
    $(eRef.current).on('change', onChange)
  }, [dropdownParent])

  return <div className={`form-group ${col} mb-2`} hidden={hidden}>
    <label htmlFor=''>
      {label} {(label && required) && <b className="text-danger">*</b>}
    </label>
    <select ref={eRef} required={required} className='form-control' style={{ width: '100%' }} disabled={disabled} multiple={multiple}>
      {children}
    </select>
  </div>
}

export default SelectFormGroup