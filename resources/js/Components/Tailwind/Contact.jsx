import React from "react"

const ContactSimple = React.lazy(() => import('./Contact/ContactSimple'))

const Contact = ({ which, data, Contact, setContact }) => {
  const getContact = () => {
    switch (which) {
      case 'ContactSimple':
        return <ContactSimple data={data} Contact={Contact} setContact={setContact} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getContact()
}

export default Contact