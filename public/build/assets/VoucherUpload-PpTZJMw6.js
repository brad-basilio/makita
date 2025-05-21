import{j as n}from"./AboutSimple-Cf8x2fCZ.js";import{r as f}from"./index-BH53Isel.js";import{F as b,r as g,p as y}from"./filepond-plugin-image-preview-iK-nC-YG.js";import{a as c}from"./index-t--hEgTQ.js";import{S as p}from"./ProductCard-C2H10lUi.js";g(y);const S=({csrfToken:r,saleCode:m,voucher:h,setVoucher:o})=>{const l=f.useRef(null),d={process:{url:"/api/vouchers/temp",method:"POST",headers:{"X-CSRF-TOKEN":r},onload:(e,...t)=>JSON.parse(e).id,ondata:e=>(o(e.getAll("voucher")[1]),e)},revert:(e,t)=>{c.delete(`/api/vouchers/temp/${e}`,{headers:{"X-CSRF-TOKEN":r}}).then(()=>{t(),o()}).catch(()=>{t(),o()})}},u=async e=>{var t,a;e.preventDefault();try{const s=l.current.getFiles().map(x=>x.serverId),i=await c.post(route("guardarvoucher"),{files:s},{headers:{"X-CSRF-TOKEN":r}});i.data.success&&p.fire({icon:"success",title:"¡Éxito!",text:i.data.message||"Voucher subido correctamente.",confirmButtonText:"Aceptar",confirmButtonColor:"#052F4E"}).then(()=>{window.location.href=route("agradecimiento",{codigoCompra:m})})}catch(s){p.fire({icon:"warning",title:"¡Error!",text:((a=(t=s.response)==null?void 0:t.data)==null?void 0:a.message)||"No se cargó el Voucher.",confirmButtonText:"Aceptar",confirmButtonColor:"#052F4E"})}};return n.jsx("div",{className:"relative px-4 pt-8 pb-4 my-3 rounded-2xl border border-dashed bg-[#f1f1f1]",children:n.jsx("form",{id:"formVoucher",onSubmit:u,children:n.jsx(b,{ref:l,name:"voucher",allowMultiple:!0,maxFiles:2,maxFileSize:"5MB",acceptedFileTypes:["image/png","image/jpeg","application/pdf"],allowImagePreview:!0,labelIdle:`\r
            <div class="filepond--label-container" style="cursor:pointer">\r
              <h3 class="text-base 2xl:text-lg font-normal pb-1 customtext-primary text-center" style="font-size:16px">\r
                Sube tu comprobante de pago <span class="text-[#91502D]">aquí</span>\r
              </h3>\r
              <p class="customtext-primary text-sm 2xl:text-base text-center" style="font-size:14px">\r
                Ayúdanos a verificar tu pago más rápido. Selecciona el archivo.\r
              </p>\r
              <div class="flex flex-row items-center justify-center mt-1 mb-6" style="font-size:12px;">\r
                <p class="customtext-primary text-xs 2xl:text-sm text-center">\r
                  Formato aceptado: JPG, PNG o PDF\r
                </p>\r
                <span class="px-1">|</span>\r
                <p class="customtext-primary text-xs 2xl:text-sm text-center" >\r
                  Tamaño máximo: 5 MB\r
                </p>\r
              </div>\r
            </div>\r
          `,stylePanelAspectRatio:"0",stylePanelLayout:"compact",labelFileProcessingComplete:"",labelFileProcessing:"",labelFileLoading:"",labelFileLoadError:"",labelTapToCancel:"",labelTapToRetry:"",labelTapToUndo:"",labelButtonRemoveItem:"",labelButtonAbortItemLoad:"",labelButtonAbortItemProcessing:"",labelButtonProcessItem:"",styleLoadIndicatorDisplay:"none",styleProgressIndicatorDisplay:"none",styleButtonRemoveItemDisplay:"none",styleButtonProcessItemDisplay:"none",credits:!1,style:{display:"contents",marginTop:"1rem"},server:d,onupdatefiles:e=>{}})})})};export{S as V};
