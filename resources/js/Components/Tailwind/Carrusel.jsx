import React from "react"



const CarruselBenefitsInifinite = React.lazy(() => import('./Carrusel/CarruselBenefitsInifinite'))

const Carrusel = ({ which, data, items }) => {
    const getCarrusel = () => {
        switch (which) {
            case 'CarruselBenefitsInifinite':
                return <CarruselBenefitsInifinite data={data} items={items} />

            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getCarrusel()
}

export default Carrusel