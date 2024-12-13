import React, { useEffect, useRef, useState } from "react";
import InputFormGroup from '../../form/InputFormGroup';
import TextareaFormGroup from '../../form/TextareaFormGroup';
import Modal from '../../Modal';
import SelectFormGroup from "../../form/SelectFormGroup";
import Global from "../../../Utils/Global";
import SystemRest from "../../../Actions/Admin/SystemRest";
import SetSelectValue from "../../../Utils/SetSelectValue";
import RouteParams from "../../../Utils/RouteParams";
import ParamFormControl from "./ParamFormControl";

const systemRest = new SystemRest()

const ParamsModal = ({ dataLoaded, setDataLoaded, modalRef, models }) => {

  const params = RouteParams(dataLoaded?.path ?? '');
  const [using, setUsing] = useState({});

  const onParamsSubmit = async (e) => {
    e.preventDefault()
    console.log(using)
    // const result = await systemRest.savePage({
    //   id: dataLoaded.id,
    //   description: descriptionRef.current.value,
    //   keywords: $(keywordsRef.current).val()
    // })
    // if (!result) return
    // setDataLoaded(null)
    // $(modalRef.current).modal('hide')
  }

  useEffect(() => {
    console.log(using)
  }, [using])

  useEffect(() => {
    setUsing(dataLoaded?.using ?? {})
  }, [dataLoaded])

  return (
    <Modal modalRef={modalRef} title={`Editar parámetros de URL - ${dataLoaded?.name}`} onSubmit={onParamsSubmit}>
      {
        params.map((param, index) => <ParamFormControl key={index} page={dataLoaded} param={param} models={models} setUsing={setUsing} />)
      }
    </Modal>
  )
}

export default ParamsModal;
