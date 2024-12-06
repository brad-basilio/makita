import React, { useEffect, useRef, useState } from "react"
import SelectFormGroup from "../../form/SelectFormGroup"

const ParamFormControl = ({ param, models }) => {

  const modelRef = useRef()
  const fieldRef = useRef()
  const withRef = useRef()

  const [selected, setSelected] = useState(null);

  const onModelChange = (e) => {
    const value = e.target.value
    const model = models.find(x => x.name == value) ?? null
    setSelected(model)
  }

  useEffect(() => {
    $(modelRef.current).val(null).trigger('change');
  }, [param])

  useEffect(() => {
    $(withRef.current).trigger('change');
  }, [selected])

  const container = `${param}-container`
  return <div id={container} className="row">
    <label className="form-label">Parámetro <code>{param}</code></label>
    <SelectFormGroup eRef={modelRef} label='Modelo' col='col-md-6' dropdownParent={`#${container}`} onChange={onModelChange}>
      {models.map((model, index) => {
        return <option key={index}>{model.name}</option>
      })}
    </SelectFormGroup>
    <SelectFormGroup eRef={fieldRef} label='Campo' col='col-md-6' dropdownParent={`#${container}`}>
      {selected?.fields?.map((field, index) => {
        return <option key={index}>{field}</option>
      })}
    </SelectFormGroup>
    <div hidden={(selected?.relations?.length ?? 0) == 0}>
      <SelectFormGroup eRef={withRef} label='Relaciones' multiple dropdownParent={`#${container}`} >
        {
          selected?.relations?.map((rel, index) => {
            return <option key={index}>{rel}</option>
          })
        }
      </SelectFormGroup>
    </div>
  </div>
}

export default ParamFormControl