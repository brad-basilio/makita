import React, { useEffect, useRef } from "react"
import { Cookies, JSON } from "sode-extend-react"

const SelectAPIFormGroup = ({ id, col, label, eRef, required = false, dropdownParent, searchAPI, searchBy, multiple = false, filter = null, onChange = () => { },
  templateResult,
  templateSelection,
  tags
}) => {
  if (!eRef) eRef = useRef()
    if (!id) id = `select-${crypto.randomUUID()}`;

  useEffect(() => {
    $(eRef.current).select2({
      dropdownParent,
      minimumInputLength: 0,
      tags,
      ajax: {
        url: searchAPI,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
        },
        type: "POST",
        quietMillis: 50,
        data: function ({ term, page }) {
          // Construir el filtro base de búsqueda
          const baseFilter = [searchBy, "contains", term || ''];
          
          // Solo agregar el filtro adicional si existe Y tiene un valor válido
          let finalFilter = baseFilter;
          
          if (filter && Array.isArray(filter) && filter.length >= 3) {
            const filterValue = filter[2]; // El tercer elemento es el valor del filtro
            
            // Solo aplicar el filtro si el valor no es null, undefined o vacío
            if (filterValue !== null && filterValue !== undefined && filterValue !== '' && filterValue !== 'null') {
              finalFilter = [baseFilter, 'and', filter];
            }
          }
          
          return JSON.stringify({
            sort: [
              {
                selector: searchBy,
                desc: false
              }
            ],
            skip: ((page ?? 1) - 1) * 10,
            take: 10,
            filter: finalFilter
          })
        },
        processResults: function (data, { page }) {
          return {
            results: (data?.data ?? []).map((x) => {
              const flatten = JSON.flatten(x)
              return {
                id: x.id,
                text: flatten[searchBy],
                data: x
              }
            }),
            pagination: {
              more: ((page ?? 1) * 10) < data.totalCount,
            },
          };
        },
      },
      templateResult,
      templateSelection
    })
  }, [dropdownParent, filter])
  
  useEffect(() => {
    $(eRef.current).on('change', onChange)
  }, [filter])

  return <div className={`form-group ${col} mb-2`}>
    <label htmlFor={id} className="mb-1">
      {label} {required && <b className="text-danger">*</b>}
    </label>
    <select ref={eRef} id={id} required={required} className='form-control' style={{ width: '100%' }} multiple={multiple}></select>
  </div>
}

export default SelectAPIFormGroup