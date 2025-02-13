import React from "react"


const FaqSimple = React.lazy(() => import('./Faqs/FaqSimple'))

const Faq = ({ which, data, Contact, setContact }) => {
  const getFaq = () => {
    switch (which) {
      case 'FaqSimple':
        return <FaqSimple data={data} Contact={Contact} setContact={setContact} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getFaq()
}

export default Faq;