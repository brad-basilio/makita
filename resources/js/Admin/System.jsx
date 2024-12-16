import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CreateReactScript from '../Utils/CreateReactScript';
import Tippy from '@tippyjs/react';
import SystemRest from '../Actions/Admin/SystemRest';
import BasicEditing4System from '../Components/Adminto/Basic/BasicEditing4System';
import Global from '../Utils/Global';
import SortByAfterField from '../Utils/SortByAfterField';
import SEOModal from '../Components/Adminto/System/SEOModal';
import Component from '../Components/Adminto/System/Component';
import DataModal from '../Components/Adminto/System/DataModal';
import Menu from '../Components/Adminto/System/Menu';
import ParamsModal from '../Components/Adminto/System/ParamsModal';

const systemRest = new SystemRest()

const System = ({ systems: systemsDB, pages: pagesDB, components, models }) => {

  const modalSEORef = useRef(null);
  const modalParamsRef = useRef(null);
  const dataModalRef = useRef(null);

  const [systems, setSystems] = useState(systemsDB);
  const [pages, setPages] = useState(pagesDB);
  const [addingPage, setAddingPage] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(null);
  const [systemLoaded, setSystemLoaded] = useState(null);

  const onAddPageClicked = async () => {
    setAddingPage(true);
    const newPages = await systemRest.savePage();
    if (!newPages) return;
    setAddingPage(false);
    setPages(newPages);
  }

  const onComponentClicked = async (system) => {

    const tabPane = $('.tab-pane:visible');
    const tabPaneId = tabPane.data('id') ?? null;

    system.page_id = tabPaneId;

    const result = await systemRest.save(system);
    if (!result) return;
    const newSystem = result.data;
    setSystems(old => {
      const exists = old.some(x => x.id === newSystem.id);
      if (exists) {
        return old.map(x => x.id === newSystem.id ? newSystem : x);
      } else {
        return [...old, newSystem];
      }
    });
  }

  const onDeleteClicked = async (system) => {
    const result = await systemRest.delete(system.id);
    if (!result) return;
    setSystems(old => old.filter(x => x.id != system.id));
  }

  useEffect(() => {
    document.title = `Sistema | ${Global.APP_NAME}`
  }, [null])

  useEffect(() => {
    const iframe = $('iframe:visible');
    if (iframe){
      $(iframe).removeAttr('src');
      $(iframe).attr('src', iframe.data('path'));
    } 
  }, [systems, pages])

  const onEditSEOClicked = async (page) => {
    setPageLoaded(page);
    $(modalSEORef.current).modal('show');
  }

  const onManageParamsClicked = async (page) => {
    setPageLoaded(page);
    $(modalParamsRef.current).modal('show');
  }

  const onEditDataClicked = async (system, component) => {
    setSystemLoaded({ ...system, component });
    $(dataModalRef.current).modal('show');
  }

  useEffect(() => {
    const containers = [...$('.components-container')];
    containers.forEach(container => {
      $(container).sortable({
        connectWith: '.components-container',
        handle: '.handle-sortable',
        forcePlaceholderSize: true,
        update: async function (event, ui) {

          const systemsSorted = [...$(container).children()];
          const updates = {};

          systemsSorted.forEach(system => {
            const id = $(system).data('id');
            const after_component = $(system).prev().data('id') ?? null;

            const currentSystem = systems.find(x => x.id == id);
            if (currentSystem?.after_component !== after_component) {
              updates[id] = after_component;
            }
          });

          if (Object.keys(updates).length > 0) {
            const result = await systemRest.updateOrder(updates);
            if (!result) return;

            setSystems(old => {
              // Crear una copia del array actual
              const newSystems = [...old];

              // Actualizar todos los sistemas afectados de una vez
              Object.entries(updates).forEach(([id, after_component]) => {
                const index = newSystems.findIndex(s => s.id == id);
                if (index !== -1) {
                  newSystems[index] = {
                    ...newSystems[index],
                    after_component
                  };
                }
              });

              return newSystems;
            });
          }
        }
      }).disableSelection();
    });
  }, [pages, systems]);

  return (
    <>
      <div id="wrapper">
        <Menu components={components} onClick={onComponentClicked} />
        <div className="content-page mt-2 pb-3" style={{ height: 'max-content' }}>
          <div className="content mt-2">
            <div className="container-fluid">
              <button className='button-menu-mobile d-lg-none d-md-block position-absolute ' style={{
                zIndex: 1,
                border: 'none',
                borderRadius: '0 50% 50% 0',
                backgroundColor: '#fff',
                color: '#343a40',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%)',
                padding: '24px 0px 20px 6px ',
                fontWeight: 'bold'
              }}>
                〉
              </button>
              <div className='row'>
                <div className="col-12">
                  <div className="card mb-0">
                    <div className="card-body" style={{ height: 'calc(100vh - 48px)' }}>
                      <ul className="nav nav-tabs nav-bordered flex-nowrap" style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                        <li className="nav-item">
                          <a id='base-template-link' href="#base-template" data-bs-toggle="tab" aria-expanded="false" className="nav-link active h-100">
                            Base
                          </a>
                        </li>
                        {
                          pages.map((page, index) => (
                            <li className="nav-item" key={index}>
                              <a href={`#page-${page.id}`} data-bs-toggle="tab" aria-expanded="false" className="nav-link h-100" style={{ whiteSpace: 'nowrap' }}>
                                {page.name}
                                <small className='d-block text-muted' style={{ fontWeight: 'normal' }}>{page.path}</small>
                              </a>
                            </li>
                          ))
                        }
                        <li className="nav-item d-flex justify-content-center align-items-center px-2">
                          <Tippy content="Agregar página">
                            <button className="nav-link btn btn-xs btn-white rounded-pill" onClick={onAddPageClicked} disabled={addingPage}>
                              {
                                addingPage ? <i className="mdi mdi-loading mdi-spin"></i> : <i className="mdi mdi-plus"></i>
                              }
                            </button>
                          </Tippy>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div className="tab-pane active" id="base-template">
                          <div className="row">
                            <div className="col-md-4">
                              <div className='d-flex flex-column gap-2'>
                                {
                                  SortByAfterField(systems).filter(x => x.page_id == null).map(system => {
                                    const component = components.find(x => x.id == system.component);
                                    const options = component?.options ?? [];
                                    if (system.component == 'content') {
                                      return <button data-id={system.id} className="btn btn-light text-truncate w-100 text-start" type="button">
                                        <i className="fa fa-ellipsis-v"></i>
                                        <i className="fa fa-ellipsis-v"></i>
                                        <span className='ms-1'>{system.name}</span>
                                      </button>
                                    } else {
                                      const component = components.find(x => x.id == system.component);
                                      return <Component
                                        key={system.id}
                                        className=''
                                        system={system}
                                        component={component}
                                        onComponentClicked={onComponentClicked}
                                        onDeleteClicked={onDeleteClicked}
                                        onEditDataClicked={onEditDataClicked}
                                      />
                                      // return <div className="dropdown">
                                      //   <button data-id={system.id} className="btn btn-light dropdown-toggle text-truncate w-100 text-start" type="button" id={`dd-${system.id}`} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                      //     <i className="mdi mdi-chevron-down ms-1 float-end"></i>
                                      //     <i className="fa fa-ellipsis-v"></i>
                                      //     <i className="fa fa-ellipsis-v"></i>
                                      //     <span className='ms-1'>{system.name}</span>
                                      //   </button>
                                      //   <div className="dropdown-menu" aria-labelledby={`dd-${system.id}`} data-popper-placement="bottom-start">
                                      //     {
                                      //       options.length > 1 &&
                                      //       <>
                                      //         {
                                      //           options.filter(x => x.id != system.value).map(option => (
                                      //             <button className='dropdown-item' onClick={() => onComponentClicked({
                                      //               ...system,
                                      //               name: `${component.name} - ${option.name}`,
                                      //               value: option.id
                                      //             })}>
                                      //               {component.name} - {option.name}
                                      //             </button>
                                      //           ))
                                      //         }
                                      //         <div className="dropdown-divider"></div>
                                      //       </>
                                      //     }
                                      //     <button className="dropdown-item" onClick={() => onDeleteClicked(system)}>
                                      //       <i className="mdi mdi-trash-can-outline me-1"></i>
                                      //       Eliminar
                                      //     </button>
                                      //   </div>
                                      // </div>
                                    }
                                  })
                                }
                              </div>
                            </div>
                            <div className="col-md-8">
                              <iframe src='/base-template' data-path='/base-template' className='w-100 h-100 border' style={{
                                minHeight: 'calc(100vh - 185px)',
                                borderRadius: '4px'
                              }}></iframe>
                            </div>
                          </div>
                        </div>

                        {
                          pages.map((page, index) => (
                            <div className="tab-pane" id={`page-${page.id}`} data-id={page.id} key={index}>
                              <div className="row">
                                <div className="col-md-4">
                                  <BasicEditing4System {...page} models={models} setPages={setPages} onSEOClicked={onEditSEOClicked} onParamsClicked={onManageParamsClicked} />
                                  <hr className='my-2' />
                                  <div className='d-flex flex-column gap-2 components-container' data-page-id={page.id}>
                                    {
                                      SortByAfterField(systems).filter(x => x.page_id == page.id).map(system => {
                                        const component = components.find(x => x.id == system.component);
                                        return <Component
                                          key={system.id}
                                          className=''
                                          system={system}
                                          component={component}
                                          onComponentClicked={onComponentClicked}
                                          onDeleteClicked={onDeleteClicked}
                                          onEditDataClicked={onEditDataClicked}
                                        />
                                      })
                                    }
                                  </div>
                                </div>
                                <div className="col-md-8">
                                  <iframe src={page?.pseudo_path || page.path} data-path={page?.pseudo_path || page.path} className='w-100 h-100 border' style={{
                                    minHeight: 'calc(100vh - 185px)',
                                    borderRadius: '4px'
                                  }}></iframe>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SEOModal dataLoaded={pageLoaded} setDataLoaded={setPageLoaded} modalRef={modalSEORef} />
      <ParamsModal dataLoaded={pageLoaded} setDataLoaded={setPageLoaded} setPages={setPages} modalRef={modalParamsRef} models={models}/>
      <DataModal dataLoaded={systemLoaded} setDataLoaded={setSystemLoaded} setSystems={setSystems} modalRef={dataModalRef} />
    </>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<System {...properties} />);
})