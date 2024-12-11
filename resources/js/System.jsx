import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import CreateReactScript from './Utils/CreateReactScript';

import TopBar from './Components/Tailwind/TopBar';
import Header from './Components/Tailwind/Header';
import Footer from './Components/Tailwind/Footer';
import SortByAfterField from './Utils/SortByAfterField';
import Slider from './Components/Tailwind/Slider';
import Product from './Components/Tailwind/Product';
import Banner from './Components/Tailwind/Banner';
import Category from './Components/Tailwind/Category';

const System = ({ page, pages, systems, socials = [], sliders = [], categories = [], systemItems = {} }) => {

  const getItems = (itemsId) => {
    return systemItems[itemsId] ?? {}
  }

  const getSystem = ({ component, value, data, itemsId }) => {
    switch (component) {
      case 'top_bar':
        return <TopBar which={value} socials={socials} data={data} />
      case 'header':
        return <Header which={value} socials={socials} />
      case 'content':
        if (!page.id) {
          return <div className='h-80 w-full bg-gray-300 flex items-center justify-center'>
            <div>- Tu contenido aquí -</div>
          </div>
        } else if (page.extends_base) {
          const contentSystems = SortByAfterField(systems).filter(x => Boolean(x.page_id))
          return contentSystems.map(getSystem)
        }
        break
      case 'product':
        return <Product which={value} data={data} items={getItems(itemsId)} />
      case 'category':
        return <Category which={value} data={data} items={getItems(itemsId)} />
      case 'slider':
        return <Slider which={value} sliders={getItems(itemsId)} />
      case 'banner':
        return <Banner which={value} data={data} />
      case 'footer':
        return <Footer which={value} socials={socials} />
    }
  }

  const systemsSorted = SortByAfterField(systems).filter(x => page.extends_base ? !x.page_id : true)

  return (
    <main className='text-[#10235b]'>
      {systemsSorted.map(getSystem)}
    </main>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<System {...properties} />);
})