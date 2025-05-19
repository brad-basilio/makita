import{r as e,j as s}from"./System-Bybt2Brn.js";import{c as t}from"./createLucideIcon-oahCLV50.js";import"./vendor-BiOv2i5T.js";
/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a=t("SquareMinus",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 12h8",key:"1wcyev"}]]),r=t("SquarePlus",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]),i=({faqs:t})=>{const[i,l]=e.useState(new Set([4]));return s.jsx("section",{className:"bg-[#F7F9FB] pb-12 px-primary",children:s.jsxs("div",{className:"mx-auto    2xl:max-w-7xl gap-12 bg-white rounded-xl p-4 md:p-8",children:[s.jsx("h1",{className:"text-[40px] font-bold text-center mb-4 cusomtext-neutral-dark",children:"Preguntas frecuentes"}),s.jsx("p",{className:"text-center  cusomtext-neutral-light mb-12 max-w-3xl mx-auto",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu fermentum justo, ac fermentum nulla. Sed sed scelerisque urna, vitae ultricies libero. Pellentesque vehicula et urna in venenatis."}),s.jsx("div",{className:"flex flex-wrap justify-between",children:t.map((e=>s.jsx("div",{className:"  p-2 cursor-pointer w-full md:w-1/2",onClick:()=>(e=>{const s=new Set(i);s.has(e)?s.delete(e):s.add(e),l(s)})(e.id),children:s.jsxs("div",{className:"p-4 rounded-lg shadow-sm bg-[#F7F9FB]",children:[s.jsxs("div",{className:"flex justify-between items-start p-4",children:[s.jsx("h3",{className:"text-xl font-semibold pr-8",children:e.question}),s.jsx("button",{className:"customtext-primary flex-shrink-0",children:i.has(e.id)?s.jsx(a,{className:"w-6 h-6"}):s.jsx(r,{className:"w-6 h-6"})})]}),i.has(e.id)&&e.answer&&s.jsx("p",{className:"mt-4 p-4 customtext-neutral-light text-lg",children:e.answer})]})},e.id)))})]})})};
/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */export{i as default};
