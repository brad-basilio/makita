import{j as e}from"./AboutSimple-Cf8x2fCZ.js";import{r as d,R as N}from"./index-BH53Isel.js";import"./index-yBjzXJbu.js";function z({data:y,filteredData:f}){const{aboutuses:i,webdetail:w,strengths:k}=f,[m,u]=d.useState(0),[h,g]=d.useState(!1),[S,E]=d.useState(0),p=N.useRef(null),s=i==null?void 0:i.find(l=>l.correlative==="section-1-about"),r=i==null?void 0:i.find(l=>l.correlative==="section-2-about"),t=i==null?void 0:i.find(l=>l.correlative==="section-3-about"),o=i==null?void 0:i.find(l=>l.correlative==="section-4-about");return d.useEffect(()=>{if(!h){const l=setInterval(()=>{u(a=>{try{const n=t!=null&&t.timeline?JSON.parse(t.timeline):[];return(a+1)%n.length}catch{return 0}})},5e3);return()=>clearInterval(l)}},[h,t==null?void 0:t.timeline]),d.useEffect(()=>{if(p.current)try{if((t!=null&&t.timeline?JSON.parse(t.timeline):[]).length>0){const a=p.current,n=a.querySelector(".timeline-scroll"),c=a.querySelectorAll(".timeline-point");if(c[m]){const x=c[m],v=x.offsetLeft,b=n.clientWidth,j=v-b/2+x.clientWidth/2;n.scrollTo({left:j,behavior:"smooth"})}}}catch(l){console.error("Error scrolling timeline:",l)}},[m,t==null?void 0:t.timeline]),console.log("Section Tree Timeline",t),e.jsxs("div",{className:"font-paragraph",children:[e.jsx("style",{jsx:!0,children:`
               
                .timeline-scroll::-webkit-scrollbar {
                    height: 8px;
                }
                .timeline-scroll::-webkit-scrollbar-track {
                   background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
                }
                .timeline-scroll::-webkit-scrollbar-thumb {
                   background: rgba(255, 255, 255, 0.8);
      border-radius: 20px;
      border: 2px solid transparent;
      background-clip: padding-box;
                }
               
                
               
                
                /* Smooth scroll behavior */
                .timeline-scroll {
                    scroll-behavior: smooth;
                }
                
                /* Removed scroll indicators gradients */
                
                /* Timeline specific styles */
                .timeline-scroll .flex-col {
                    position: relative;
                    transition: transform 0.3s ease;
                }
                
                /* Removed content connector lines */
                
                /* Hover effects for timeline points */
                .timeline-scroll .flex-col:hover .timeline-point {
                   
                    box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
                }
                
                /* Active timeline point with pulsing effect */
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                    }
                }
                
                .timeline-point.scale-100 {
                    animation: pulse 2s infinite;
                }
                
                /* Content transition effects */
                .timeline-scroll h3, 
                .timeline-scroll p,
                .timeline-scroll .text-primary {
                    transition: all 0.3s ease;
                }
                
                /* Timeline responsive adjustments */
                @media (max-width: 768px) {
                    .timeline-scroll .flex-col {
                        min-width: 180px;
                    }
                    
                    .timeline-scroll h3 {
                        font-size: 1rem;
                    }
                    
                    .timeline-scroll p {
                        font-size: 0.875rem;
                    }
                }
            `}),e.jsx("div",{className:"bg-gray-50 py-8 lg:py-16 customtext-neutral-dark",children:e.jsxs("div",{className:"px-[5%] mx-auto 2xl:px-0 2xl:max-w-7xl",children:[e.jsxs("div",{className:"  mb-12",children:[e.jsx("h1",{className:"max-w-6xl text-center  mx-auto text-3xl lg:text-5xl font-bold mb-6",children:s==null?void 0:s.title}),e.jsx("div",{className:"customtext-neutral-dark columns-1 md:columns-2 gap-8 text-justify",dangerouslySetInnerHTML:{__html:s==null?void 0:s.description}}),e.jsx("div",{className:"mt-8 flex justify-center items-center",children:e.jsx("a",{href:"/contacto",className:"bg-[#219FB9] text-center flex items-center justify-center w-full lg:w-max text-lg hover:bg-primary text-white px-6 py-3 rounded-md font-medium  transition-all",children:"Contáctame"})})]}),e.jsx("div",{className:"rounded-xl overflow-hidden shadow-md mt-10",children:e.jsx("img",{src:`/storage/images/aboutus/${s==null?void 0:s.image}`,alt:(s==null?void 0:s.title)||"Makita Cover",className:"w-full aspect-square lg:aspect-[16/6] object-cover",onError:l=>l.target.src="/api/cover/thumbnail/null"})})]})}),e.jsx("div",{className:"pb-8 lg:py-16",children:e.jsx("div",{className:"px-[5%] mx-auto 2xl:px-0 2xl:max-w-7xl",children:e.jsxs("div",{className:"grid md:grid-cols-12 gap-8 items-center",children:[e.jsx("div",{className:"order-1 md:col-span-5",children:e.jsx("img",{src:`/storage/images/aboutus/${r==null?void 0:r.image}`,alt:(r==null?void 0:r.title)||"Trabajador con herramienta Makita",className:"w-full aspect-square lg:aspect-[4/3] rounded-xl shadow-md object-cover",onError:l=>{l.target.src="/api/cover/thumbnail/null"}})}),e.jsxs("div",{className:"md:col-span-7",children:[e.jsx("h2",{className:"text-3xl lg:text-[40px] font-bold max-w-[300px] lg:max-w-md mb-6 customtext-neutral-dark",children:(r==null?void 0:r.title)||"Sobre nosotros"}),e.jsx("div",{className:"customtext-neutral-dark text-lg   gap-8 text-left",dangerouslySetInnerHTML:{__html:r==null?void 0:r.description}})]})]})})}),e.jsx("div",{className:"bg-neutral-dark text-white py-20 relative overflow-hidden",children:e.jsxs("div",{className:"px-[5%] mx-auto 2xl:px-0 2xl:max-w-7xl",children:[(t==null?void 0:t.image)&&e.jsx("img",{src:`/storage/images/aboutus/${t.image}`,alt:(t==null?void 0:t.title)||"Timeline Background",className:"w-full h-full object-cover absolute inset-0 ",onError:l=>l.target.src="/api/cover/thumbnail/null"}),e.jsxs("div",{className:"relative z-10",id:"timeline",ref:p,children:[e.jsx("div",{className:"text-center mb-12",children:(t==null?void 0:t.description)&&e.jsx("div",{className:"text-xl text-gray-300 max-w-3xl mx-auto",dangerouslySetInnerHTML:{__html:t.description}})}),(t==null?void 0:t.timeline)&&(()=>{let l=[];try{l=JSON.parse(t.timeline)}catch(a){return console.error("Error parsing timeline:",a),e.jsx("p",{className:"text-center text-gray-400",children:"Error al cargar el timeline"})}return!l||l.length===0?e.jsx("p",{className:"text-center text-gray-400",children:"No hay eventos en el timeline"}):e.jsx("div",{className:"relative w-full overflow-x-auto timeline-scroll pb-12",onMouseEnter:()=>g(!0),onMouseLeave:()=>g(!1),children:e.jsxs("div",{className:"relative flex flex-col items-center min-w-max ",children:[e.jsx("div",{className:"absolute left-0 right-0 top-1/2 h-[3px] bg-gray-600 z-0",style:{transform:"translateY(-50%)"}}),e.jsx("div",{className:"absolute left-0 top-1/2 h-[3px] bg-white z-1 transition-all duration-500",style:{width:`${m/(l.length-1)*100}%`,transform:"translateY(-50%)"}}),e.jsx("div",{className:"flex w-full justify-between relative z-10",style:{alignItems:"center"},children:l.map((a,n)=>{const c=n<=m,x=n%2===0;return e.jsxs("div",{className:"flex flex-col  relative",style:{minWidth:"220px",width:`${100/l.length}%`},onClick:()=>u(n),children:[x?e.jsxs("div",{className:` pb-24 w-full mb-16 max-w-[600px] text-left transition-opacity duration-300 ${c?"opacity-100":"opacity-50"}`,children:[e.jsxs("h3",{className:"text-xl  mb-2 text-white",children:[a.year," - ",a.name]}),e.jsx("p",{className:"text-gray-300 text-base leading-relaxed line-clamp-6",children:a.description})]}):e.jsx("div",{className:"mb-12 h-[110px]"}),e.jsx("div",{className:` flex items-center justify-center top-1/2 -translate-y-1/2 w-6 h-6 p-2 rounded-full border-2 transition-all duration-300 z-20 absolute 
                                                                ${c?" border-white scale-100":" border-transparent scale-75"} `,style:{position:"absolute",zIndex:30},children:e.jsx("div",{className:`min-w-3 min-h-3 max-w-3 max-h-3 rounded-full  
                                                             bg-white `})}),x?e.jsx("div",{className:"mt-8 h-[80px]"}):e.jsxs("div",{className:`mt-24 w-full max-w-[600px] text-left transition-opacity duration-300 ${c?"opacity-100":"opacity-50"}`,children:[e.jsxs("h3",{className:"text-xl  mb-2 text-white",children:[" ",a.year," -",a.name]}),e.jsx("p",{className:"text-gray-300 text-lg leading-relaxed line-clamp-6",children:a.description})]})]},n)})})]})})})()]})]})}),e.jsx("div",{className:"py-16",children:e.jsx("div",{className:" mx-auto px-primary 2xl:px-0 2xl:max-w-7xl",children:e.jsxs("div",{className:"grid md:grid-cols-2 gap-10 items-center",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-4xl font-bold mb-6 customtext-neutral-dark",children:o==null?void 0:o.title}),e.jsx("div",{className:"customtext-neutral-dark text-lg mb-6",dangerouslySetInnerHTML:{__html:o==null?void 0:o.description}})]}),e.jsx("div",{children:e.jsx("img",{src:`/storage/images/aboutus/${o==null?void 0:o.image}`,alt:"Control de calidad Makita",className:"w-full h-auto aspect-square rounded-xl shadow-md object-cover",onError:l=>l.target.src="/api/cover/thumbnail/null"})})]})})})]})}export{z as default};
