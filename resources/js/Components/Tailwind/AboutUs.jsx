import React from "react"


const AboutSimple = React.lazy(() => import('./AboutUs/AboutSimple'))

const AboutUs = ({ data, which }) => {
    const getAboutUs = () => {
        switch (which) {

            case 'AboutSimple':
                return <AboutSimple data={data} />

            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getAboutUs()
}

export default AboutUs;