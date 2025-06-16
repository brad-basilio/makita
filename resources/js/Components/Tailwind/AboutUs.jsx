import React from "react"

const AboutSimple = React.lazy(() => import('./AboutUs/AboutSimple'))
const AboutImage = React.lazy(() => import('./AboutUs/AboutImage'))
const AboutMakita = React.lazy(() => import('./AboutUs/AboutMakita'))
const AboutUs = ({ data, which, filteredData }) => {
    const getAboutUs = () => {
        switch (which) {

            case 'AboutSimple':
                return <AboutSimple data={data} filteredData={filteredData} />

            case 'AboutImage':
                return <AboutImage data={data} filteredData={filteredData} />

            case "AboutMakita":
                return <AboutMakita data={data} filteredData={filteredData} />

            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getAboutUs()
}

export default AboutUs;