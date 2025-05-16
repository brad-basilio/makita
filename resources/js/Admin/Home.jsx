import React from 'react';
import { createRoot } from 'react-dom/client';
import CreateReactScript from '../Utils/CreateReactScript';
import BaseAdminto from '../Components/Adminto/Base';
import Chart from 'react-apexcharts';

const Home = ({ session, totalProducts, totalStock, salesToday, salesMonth, salesYear, incomeToday, incomeMonth, incomeYear, topProducts, newFeatured, ordersByStatus, salesByLocation }) => {
  const formatIncome = (value) => {
    const numValue = Number(value) || 0;
    return numValue.toFixed(2);
  };

  return (
    <>
      {/* Tarjetas de Resumen */}
      <div className="row">
        <div className="col-xl-3 col-md-6">
          <div className="card">
            <div className="card-body widget-user">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 avatar-lg me-3">
                  <span className="avatar-title rounded-circle bg-soft-primary">
                    <i className="fas fa-shopping-cart font-22 text-primary"></i>
                  </span>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <h5 className="mb-1">{salesToday}</h5>
                  <p className="text-muted mb-0 text-truncate">Ventas Hoy</p>
                  <div className="text-muted font-13">
                    <i className="fas fa-arrow-up text-success me-1"></i>
                    <span>{salesMonth} este mes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card">
            <div className="card-body widget-user">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 avatar-lg me-3">
                  <span className="avatar-title rounded-circle bg-soft-success">
                    <i className="fas fa-dollar-sign font-22 text-success"></i>
                  </span>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <h5 className="mb-1">S/ {formatIncome(incomeToday)}</h5>
                  <p className="text-muted mb-0 text-truncate">Ingresos Hoy</p>
                  <div className="text-muted font-13">
                    <i className="fas fa-arrow-up text-success me-1"></i>
                    <span>S/ {formatIncome(incomeMonth)} este mes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card">
            <div className="card-body widget-user">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 avatar-lg me-3">
                  <span className="avatar-title rounded-circle bg-soft-info">
                    <i className="fas fa-box font-22 text-info"></i>
                  </span>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <h5 className="mb-1">{totalProducts}</h5>
                  <p className="text-muted mb-0 text-truncate">Productos Activos</p>
                  <div className="text-muted font-13">
                    <i className="fas fa-boxes me-1"></i>
                    <span>{totalStock} unidades en stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card">
            <div className="card-body widget-user">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 avatar-lg me-3">
                  <span className="avatar-title rounded-circle bg-soft-warning">
                    <i className="fas fa-warehouse font-22 text-warning"></i>
                  </span>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <h5 className="mb-1">{totalStock}</h5>
                  <p className="text-muted mb-0 text-truncate">Stock Total</p>
                  <div className="text-muted font-13">
                    <i className="fas fa-box-open me-1"></i>
                    <span>{totalProducts} productos diferentes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Estado de Pedidos</h5>
            </div>
            <div className="card-body">
              <Chart 
                options={{
                  labels: ordersByStatus.map(s => s.name),
                  colors: ordersByStatus.map(s => s.color),
                  legend: {
                    position: 'bottom'
                  }
                }}
                series={ordersByStatus.map(s => s.count)}
                type="donut"
                height={300}
              />
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Ventas por Ubicación</h5>
            </div>
            <div className="card-body">
              <Chart 
                options={{
                  xaxis: {
                    categories: salesByLocation.map(l => `${l.department}/${l.province}`)
                  },
                  plotOptions: {
                    bar: {
                      horizontal: true
                    }
                  }
                }}
                series={[{
                  name: 'Ventas',
                  data: salesByLocation.map(l => l.count)
                }]}
                type="bar"
                height={300}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Productos Top y Nuevos */}
      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Productos Más Vendidos</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-centered table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Tendencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product) => (
                      <tr key={product.name}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                              <img    src={`/storage/images/item/${product.image}`} 
                                   alt={product.name} 
                                   className="rounded-circle"
                                   style={{width: '40px', height: '40px', objectFit: 'cover'}}
                                   onError={e => e.target.src = '/api/cover/thumbnail/null'} />
                            </div>
                            <div className="flex-grow-1 ms-2">
                              <h5 className="font-14 my-1">{product.name}</h5>
                              <span className="text-muted">{product.category?.name}</span>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge bg-soft-success text-success">{product.quantity}</span></td>
                        <td>
                          <i className="fas fa-arrow-up text-success me-1"></i>
                          <span className="text-success">+{Math.round(Math.random() * 20)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Nuevos Productos Destacados</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newFeatured.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                            
                            src={`/storage/images/item/${product.image}`} 
                                 alt={product.name} 
                                 className="me-3"
                                 style={{width: '40px', height: '40px', objectFit: 'cover'}} />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>S/{Number(product.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <BaseAdminto {...properties} title="Dashboard">
      <Home {...properties} />
    </BaseAdminto>
  );
});