import React, { useEffect, useRef } from "react"

const QuillFormGroup = ({ col, label, eRef, value, required = false, rows = 3, theme = 'snow', height = '100px' }) => {
  const quillRef = useRef()

  useEffect(() => {
    const quill = new Quill(quillRef.current, { theme, modules: { toolbar: [[{ font: [] }, { size: [] }], ["bold", "italic", "underline", "strike"], [{ color: [] }, { background: [] }], [{ script: "super" }, { script: "sub" }], [{ header: [!1, 1, 2, 3, 4, 5, 6] }, "blockquote", "code-block"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["direction", { align: [] }], ["link", "image", "video"], ["clean"]] } })

    quill.on('text-change', () => {
      eRef.current.value = quill.root.innerHTML
    });

    eRef.editor = quill
    quill.root.innerHTML = value ?? ''
  }, [null])

  return <div className={`form-group ${col} mb-2`} style={{ height: 'max-content' }}>
    <label htmlFor=''>
      {label} {required && <b className="text-danger">*</b>}
    </label>
    <div ref={quillRef} style={{height}}></div>
    <input ref={eRef} type="hidden" required={required} rows={rows} />
  </div>
}

export default QuillFormGroup