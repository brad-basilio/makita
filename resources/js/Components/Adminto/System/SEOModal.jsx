import React, { useEffect, useRef } from "react";
import InputFormGroup from '../../Adminto/form/InputFormGroup';
import TextareaFormGroup from '../../Adminto/form/TextareaFormGroup';
import Modal from '../../Adminto/Modal';
import SelectFormGroup from "../../Adminto/form/SelectFormGroup";
import Global from "../../../Utils/Global";
import SystemRest from "../../../Actions/Admin/SystemRest";
import SetSelectValue from "../../../Utils/SetSelectValue";

const systemRest = new SystemRest()

const SEOModal = ({ dataLoaded, setDataLoaded, modalRef }) => {
  const nameRef = useRef(null)
  const descriptionRef = useRef(null)
  const keywordsRef = useRef(null)

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

  useEffect(() => {
    nameRef.current.value = `${dataLoaded?.name} | ${Global.APP_NAME}`
    descriptionRef.current.value = dataLoaded?.description ?? ''
    SetSelectValue(keywordsRef.current, dataLoaded?.keywords ?? []);
  }, [dataLoaded])

  return (
    <Modal modalRef={modalRef} title={`Editar SEO - ${dataLoaded?.name}`} size='sm' onSubmit={onSeoChange}>
      <div id='seo-container'>
        <InputFormGroup eRef={nameRef} label='Título' disabled />
        <TextareaFormGroup eRef={descriptionRef} label='Descripción' rows={2} />
        <SelectFormGroup eRef={keywordsRef} label='Palabras clave' tags multiple dropdownParent='#seo-container' />
      </div>
    </Modal>
  )
}

export default SEOModal;
