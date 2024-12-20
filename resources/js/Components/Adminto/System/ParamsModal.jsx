import React, { useEffect, useState } from "react";
import Modal from '../../Adminto/Modal';
import SystemRest from "../../../Actions/Admin/SystemRest";
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
        params.map((param, index) => <ParamFormControl key={index} page={dataLoaded} param={param} models={models} using={using} setUsing={setUsing} setPages={setPages} />)
      }
    </Modal>
  )
}

export default ParamsModal;
