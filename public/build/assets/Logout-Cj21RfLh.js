import{c as e}from"./createLucideIcon-oahCLV50.js";import{m as a}from"./System-Bybt2Brn.js";
/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=e("CircleUser",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662",key:"154egf"}]]),r=e("DoorClosed",[["path",{d:"M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14",key:"36qu9e"}],["path",{d:"M2 20h20",key:"owomy5"}],["path",{d:"M14 12v.01",key:"xfcn54"}]]),t=async()=>{try{const{status:e,result:o}=await a.Fetch("/api/logout",{method:"DELETE"});if(!e)throw new Error((null==o?void 0:o.message)||"Ocurrio un error al cerrar sesion");a.Notify.add({icon:"/assets/img/icon.svg",title:"Cierre de sesion exitoso",body:"Sera enviado a la pantalla de autenticacion"}),location.href="/"}catch(e){a.Notify.add({icon:"/assets/img/icon.svg",title:"Error",body:e.message,type:"danger"})}};
/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */export{o as C,r as D,t as L};
