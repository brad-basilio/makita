import React from 'react';
import DeliveryPricesRest from '@Rest/Admin/DeliveryPricesRest';
import CreateReactScript from '@Utils/CreateReactScript';
import { createRoot } from 'react-dom/client';

const deliverypricesRest = new DeliveryPricesRest();

const DeliveryPrices = () => {
    return (
        <div>
            <h1>DeliveryPrices Component</h1>
        </div>
    );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<DeliveryPrices {...properties} />);
})