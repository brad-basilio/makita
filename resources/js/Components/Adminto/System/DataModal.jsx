import React, { useEffect, useRef, useState } from "react";
import InputFormGroup from '../../form/InputFormGroup';
import TextareaFormGroup from '../../form/TextareaFormGroup';
import Modal from '../../Modal';
import SelectFormGroup from "../../form/SelectFormGroup";
import SystemRest from "../../../Actions/Admin/SystemRest";

const systemRest = new SystemRest()

const DataModal = ({ dataLoaded, setDataLoaded, setSystems, modalRef }) => {
  const [data, setData] = useState(dataLoaded?.data || {})

  const usingRef = {}
  usingRef.model = useRef(null)
  usingRef.filters = useRef(null)

  const onDataSubmit = async (e) => {
    e.preventDefault()
    const result = await systemRest.save({
      id: dataLoaded.id,
      data,
      filters: $(usingRef.filters.current).val()
    })
    if (!result) return
    setDataLoaded(null)
    $(modalRef.current).modal('hide')
    setSystems(old => old.map(system => system.id == dataLoaded.id ? result.data : system))
  }

  useEffect(() => {
    const newData = {}
    dataLoaded?.component?.data.forEach(key => {
      newData[key] = dataLoaded?.data?.[key] ?? ''
    })
    setData(newData)
    usingRef.model.current.value = dataLoaded?.component?.using?.model ?? ''
    $(usingRef.filters.current).val(dataLoaded?.filters ?? []).trigger('change')
  }, [dataLoaded])

  return (
    <Modal modalRef={modalRef} title={dataLoaded?.name} onSubmit={onDataSubmit}>
      <ul className="nav nav-tabs nav-bordered">
        <li className="nav-item" hidden={!dataLoaded?.component?.data?.length}>
          <a href="#tab-info" data-bs-toggle="tab" aria-expanded="true" className="nav-link active">
            Información
          </a>
        </li>
        <li className="nav-item" hidden={!dataLoaded?.component?.using?.filters}>
          <a href="#tab-db" data-bs-toggle="tab" aria-expanded="true" className="nav-link">
            Base de datos
          </a>
        </li>
      </ul>
      <div className="tab-content">
        <div className="tab-pane active" id="tab-info" hidden={!dataLoaded?.component?.data?.length}>
          {
            dataLoaded?.component?.data?.map((element, index) => (
              <TextareaFormGroup key={index} label={element} value={data[element] ?? ''} rows={1} onChange={e => setData({ ...data, [element]: e.target.value })} />
            ))
          }
        </div>
        <div className="tab-pane show" id="tab-db">
          <InputFormGroup eRef={usingRef.model} label='Modelo' disabled />
          <SelectFormGroup eRef={usingRef.filters} label='Filtros' multiple dropdownParent='#tab-db' hidden={!dataLoaded?.component?.using?.filters}>
            {
              dataLoaded?.component?.using?.filters?.map((filter, index) => (
                <option key={index} value={filter}>{filter}</option>
              ))
            }
          </SelectFormGroup>
        </div>
      </div>
    </Modal>
  )
}

export default DataModal;
