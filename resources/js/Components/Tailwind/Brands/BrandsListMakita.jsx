import React, { useEffect, useState } from "react";
import axios from "axios";
import BrandMakita from "./BrandMakita";

const BrandsListMakita = ({ brands }) => {
  const [brandsWithItems, setBrandsWithItems] = useState([]);

  useEffect(() => {
    async function fetchAll() {
      const results = await Promise.all(
        brands.map(async (brand) => {
          try {
            const res = await axios.get(`/api/brands/${brand.id}/featured-items`);
            return { ...brand, items: res.data.items };
          } catch {
            return { ...brand, items: [] };
          }
        })
      );
      setBrandsWithItems(results);
    }
    if (brands && brands.length > 0) fetchAll();
  }, [brands]);

  return (
    <div>
      {brandsWithItems.map((brand) => (
        <BrandMakita key={brand.id} data={brand} items={brand.items} />
      ))}
    </div>
  );
};

export default BrandsListMakita;
