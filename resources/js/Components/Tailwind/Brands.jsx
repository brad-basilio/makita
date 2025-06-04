import React from "react";

const BrandMakita = React.lazy(() => import("./Brands/BrandMakita"));

const Brands = ({
    data,
    items,
    which,
  
}) => {
    const getBrand = () => {
        switch (which) {
            case "BrandMakita":
                return <BrandMakita data={data} items={items} />
           
            default:
                return <div>No hay componente {which}</div>;
        }
    };

    return getBrand();
};

export default Brands;
