import React, { useEffect, useRef } from "react";
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
  // const nameRef = useRef(null)
  // const descriptionRef = useRef(null)
  // const keywordsRef = useRef(null)

  const onSeoChange = async (e) => {
    e.preventDefault()
    const result = await systemRest.savePage({
      id: dataLoaded.id,
      description: descriptionRef.current.value,
      keywords: $(keywordsRef.current).val()
    })
    if (!result) return
    setDataLoaded(null)
    $(modalRef.current).modal('hide')
  }

  // useEffect(() => {
  //   nameRef.current.value = `${dataLoaded?.name} | ${Global.APP_NAME}`
  //   descriptionRef.current.value = dataLoaded?.description ?? ''
  //   SetSelectValue(keywordsRef.current, dataLoaded?.keywords ?? []);
  // }, [dataLoaded])

  const params = RouteParams(dataLoaded?.path ?? '');

  return (
    <Modal modalRef={modalRef} title={`Editar parámetros de URL - ${dataLoaded?.name}`} onSubmit={onSeoChange}>
      {
        params.map((param, index) => <ParamFormControl key={index} param={param} models={models}/>)
      }
    </Modal>
  )
}

export default ParamsModal;
