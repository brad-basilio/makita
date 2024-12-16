import React, { useEffect, useRef, useState } from "react";
import InputFormGroup from '../../form/InputFormGroup';
import TextareaFormGroup from '../../form/TextareaFormGroup';
import Modal from '../../Adminto/Modal';
import SelectFormGroup from "../../form/SelectFormGroup";
import Global from "../../../Utils/Global";
import SystemRest from "../../../Actions/Admin/SystemRest";
import SetSelectValue from "../../../Utils/SetSelectValue";
import RouteParams from "../../../Utils/RouteParams";
import ParamFormControl from "./ParamFormControl";

const systemRest = new SystemRest()

const ParamsModal = ({ dataLoaded, setDataLoaded, setPages, modalRef, models }) => {

  const params = RouteParams(dataLoaded?.path ?? '');
  const [using, setUsing] = useState({});

  const onParamsSubmit = async (e) => {
    e.preventDefault()
    const result = await systemRest.savePage({
      id: dataLoaded.id,
      using
    })
    if (!result) return
    setDataLoaded(null)
    setPages(result)
    $(modalRef.current).modal('hide')
  }

  useEffect(() => {
    setUsing(dataLoaded?.using ?? {})
  }, [dataLoaded])

  return (
    <Modal modalRef={modalRef} title={`Editar parámetros de URL - ${dataLoaded?.name}`} onSubmit={onParamsSubmit} onClose={() => setDataLoaded(null)}>
      {
        params.map((param, index) => <ParamFormControl key={index} page={dataLoaded} param={param} models={models} setUsing={setUsing} />)
      }
    </Modal>
  )
}

export default ParamsModal;
