import React from 'react';
import { createRoot } from 'react-dom/client';
import CreateReactScript from '../Utils/CreateReactScript';
import BaseAdminto from '../Components/Adminto/Base';

const Home = ({ session }) => {
  return (
    <>
      <main className='d-flex align-items-center justify-content-center' style={{ height: 'calc(100vh - 160px)' }}>
        <div className='text-center'>
          <h1>Hola {session.name} {session.lastname}</h1>
          <div className='d-flex justify-content-center gap-2'>
          <a href='/admin/items' className='btn btn-primary'>Ver items</a>
          <a href='/admin/posts' className='btn btn-primary'>Ver posts</a>
          </div>
        </div>
      </main>
    </>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title="Dashboard">
    <Home {...properties} />
  </BaseAdminto>);
})