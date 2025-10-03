import React from 'react';
import { createRoot } from 'react-dom/client';
import CreateReactScript from '../Utils/CreateReactScript';
import BaseAdminto from '../Components/Adminto/Base';
import Chart from 'react-apexcharts';
import { 
  Eye, 
  Users, 
  Box, 
  TrendingUp, 
  Mail, 
  Briefcase, 
  Layers, 
  FileText,
  Smartphone,
  Monitor,
  Tablet,
  Globe
} from 'lucide-react';

const Home = ({ 
  // Estadísticas generales
  totalProducts,
  totalStock,
  totalCategories,
  totalPosts,
  
  // Vistas de productos
  productViewsToday,
  productViewsWeek,
  productViewsMonth,
  
  // Sesiones únicas
  uniqueSessionsToday,
  uniqueSessionsWeek,
  uniqueSessionsMonth,
  
  // Suscripciones
  subscriptionsToday,
  subscriptionsMonth,
  subscriptionsTotal,
  
  // Postulaciones laborales
  jobApplicationsToday,
  jobApplicationsMonth,
  jobApplicationsTotal,
  
  // Productos más visitados
  mostViewedProducts,
  
  // Analytics
  deviceStats,
  browserStats,
  osStats,
  locationStats,
  
  // Productos
  recentProducts,
  featuredProducts,
  
  // Tendencias
  viewsTrend,
  
  // Posts
  recentPosts
}) => {
  
  const formatNumber = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString('es-PE');
  };

  const getDeviceIcon = (device) => {
    switch(device?.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  // Configuración para gráfico de tendencias de visualizaciones
  const viewsTrendOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#00C5C5'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      }
    },
    xaxis: {
      categories: viewsTrend?.map(v => v.date) || [],
    },
    yaxis: {
      title: { text: 'Visualizaciones' }
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} vistas`
      }
    }
  };

  const viewsTrendSeries = [{
    name: 'Vistas',
    data: viewsTrend?.map(v => v.views) || []
  }];

  // Configuración para gráfico de dispositivos
  const deviceStatsOptions = {
    chart: {
      type: 'donut',
    },
    labels: deviceStats?.map(d => d.device) || [],
    colors: ['#00C5C5', '#FF6B6B', '#FFD93D', '#6BCF7F'],
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Sesiones',
              formatter: () => {
                return deviceStats?.reduce((sum, d) => sum + d.sessions, 0) || 0;
              }
            }
          }
        }
      }
    }
  };

  const deviceStatsSeries = deviceStats?.map(d => d.sessions) || [];

  // Configuración para gráfico de navegadores
  const browserStatsOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true
      }
    },
    colors: ['#00C5C5', '#FF6B6B', '#FFD93D', '#6BCF7F', '#9B59B6'],
    xaxis: {
      categories: browserStats?.map(b => b.browser) || [],
    },
    yaxis: {
      title: { text: 'Sesiones' }
    },
    legend: { show: false }
  };

  const browserStatsSeries = [{
    name: 'Sesiones',
    data: browserStats?.map(b => b.sessions) || []
  }];

  return (
    <>
      {/* ESTADÍSTICAS PRINCIPALES */}
      <div className="row">
        {/* Visualizaciones de Productos */}
        <div className="col-xl-3 col-md-6">
          <div className="card">
            <div className="card-body widget-user">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 avatar-lg me-3">
                  <span className="avatar-title rounded-circle bg-soft-primary">
                    <Eye className="text-primary" size={28} />
                  </span>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <h5 className="mb-1">{formatNumber(productViewsToday)}</h5>
                  <p className="text-muted mb-0 text-truncate">Vistas Hoy</p>
                  <div className="text-muted font-13">
                    <i className="fas fa-arrow-up text-success me-1"></i>
                    <span>{formatNumber(productViewsMonth)} este mes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sesiones Únicas */}
        <div className="col-xl-3 col-md-6">
          <div className="card">
            <div className="card-body widget-user">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 avatar-lg me-3">
                  <span className="avatar-title rounded-circle bg-soft-success">
                    <Users className="text-success" size={28} />
                  </span>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <h5 className="mb-1">{formatNumber(uniqueSessionsToday)}</h5>
                  <p className="text-muted mb-0 text-truncate">Visitantes Hoy</p>
                  <div className="text-muted font-13">
                    <i className="fas fa-arrow-up text-success me-1"></i>
                    <span>{formatNumber(uniqueSessionsMonth)} este mes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Productos */}
        <div className="col-xl-3 col-md-6">
          <div className="card">
            <div className="card-body widget-user">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 avatar-lg me-3">
                  <span className="avatar-title rounded-circle bg-soft-info">
                    <Box className="text-info" size={28} />
                  </span>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <h5 className="mb-1">{formatNumber(totalProducts)}</h5>
                  <p className="text-muted mb-0 text-truncate">Productos Activos</p>
                  <div className="text-muted font-13">
                    <Layers className="me-1" size={14} />
                    <span>{formatNumber(totalCategories)} categorías</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suscripciones */}
        <div className="col-xl-3 col-md-6">
          <div className="card">
            <div className="card-body widget-user">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 avatar-lg me-3">
                  <span className="avatar-title rounded-circle bg-soft-warning">
                    <Mail className="text-warning" size={28} />
                  </span>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <h5 className="mb-1">{formatNumber(subscriptionsToday)}</h5>
                  <p className="text-muted mb-0 text-truncate">Suscripciones Hoy</p>
                  <div className="text-muted font-13">
                    <i className="fas fa-users me-1"></i>
                    <span>{formatNumber(subscriptionsTotal)} total</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRÁFICOS DE TENDENCIAS Y ANALYTICS */}
      <div className="row">
        {/* Tendencia de Visualizaciones (Últimos 7 días) */}
        <div className="col-xl-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <TrendingUp size={20} className="me-2" style={{display: 'inline'}} />
                Tendencia de Visualizaciones (Últimos 7 días)
              </h5>
            </div>
            <div className="card-body">
              <Chart 
                options={viewsTrendOptions}
                series={viewsTrendSeries}
                type="area"
                height={300}
              />
            </div>
          </div>
        </div>

        {/* Distribución por Dispositivo */}
        <div className="col-xl-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <Monitor size={20} className="me-2" style={{display: 'inline'}} />
                Dispositivos (Este Mes)
              </h5>
            </div>
            <div className="card-body">
              <Chart 
                options={deviceStatsOptions}
                series={deviceStatsSeries}
                type="donut"
                height={300}
              />
              <div className="mt-3">
                {deviceStats?.map((device, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      {getDeviceIcon(device.device)}
                      <span className="ms-2 text-capitalize">{device.device || 'Desconocido'}</span>
                    </div>
                    <span className="badge bg-soft-info text-info">
                      {formatNumber(device.sessions)} sesiones
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVEGADORES Y UBICACIONES */}
      <div className="row">
        {/* Navegadores más usados */}
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Top Navegadores (Este Mes)</h5>
            </div>
            <div className="card-body">
              <Chart 
                options={browserStatsOptions}
                series={browserStatsSeries}
                type="bar"
                height={300}
              />
            </div>
          </div>
        </div>

        {/* Top Ubicaciones */}
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <Globe size={20} className="me-2" style={{display: 'inline'}} />
                Top Ubicaciones (Este Mes)
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-centered mb-0">
                  <thead>
                    <tr>
                      <th>País</th>
                      <th className="text-end">Sesiones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationStats?.slice(0, 10).map((location, index) => (
                      <tr key={index}>
                        <td>
                          <span className="text-uppercase fw-bold">{location.country || 'N/A'}</span>
                        </td>
                        <td className="text-end">
                          <span className="badge bg-soft-primary text-primary">
                            {formatNumber(location.sessions)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTOS MÁS VISITADOS Y POSTULACIONES */}
      <div className="row">
        {/* Productos Más Visitados */}
        <div className="col-xl-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                <Eye size={20} className="me-2" style={{display: 'inline'}} />
                Productos Más Visitados (Este Mes)
              </h5>
              <a href="/admin/items" className="btn btn-sm btn-soft-primary">
                Ver todos
              </a>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-centered table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>SKU</th>
                      <th className="text-end">Visualizaciones</th>
                      <th className="text-end">Tendencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mostViewedProducts?.map((product, index) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                              <img 
                                src={product.image ? `/storage/images/item/${product.image}` : '/api/cover/thumbnail/null'} 
                                alt={product.name} 
                                className="rounded"
                                style={{width: '50px', height: '50px', objectFit: 'cover'}}
                                onError={e => e.target.src = '/api/cover/thumbnail/null'} 
                              />
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h5 className="font-14 my-1">{product.name}</h5>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted">{product.sku || 'N/A'}</span>
                        </td>
                        <td className="text-end">
                          <span className="badge bg-soft-success text-success">
                            {formatNumber(product.views)} vistas
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex align-items-center justify-content-end">
                            <span className="badge bg-soft-info text-info me-1">#{index + 1}</span>
                            <i className="fas fa-fire text-danger"></i>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas de Postulaciones y Posts */}
        <div className="col-xl-4">
          {/* Postulaciones Laborales */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <Briefcase size={20} className="me-2" style={{display: 'inline'}} />
                Postulaciones Laborales
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <h2 className="mb-0">{formatNumber(jobApplicationsTotal)}</h2>
                <p className="text-muted mb-0">Total de postulaciones</p>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Hoy:</span>
                <span className="badge bg-soft-primary text-primary">
                  {formatNumber(jobApplicationsToday)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Este mes:</span>
                <span className="badge bg-soft-success text-success">
                  {formatNumber(jobApplicationsMonth)}
                </span>
              </div>
              <a href="/admin/job-applications" className="btn btn-sm btn-soft-info w-100 mt-3">
                Ver postulaciones
              </a>
            </div>
          </div>

          {/* Posts Publicados */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FileText size={20} className="me-2" style={{display: 'inline'}} />
                Contenido Publicado
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center">
                <h2 className="mb-0">{formatNumber(totalPosts)}</h2>
                <p className="text-muted mb-3">Posts activos</p>
                <a href="/admin/posts" className="btn btn-sm btn-soft-info w-100">
                  Gestionar posts
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTOS RECIENTES Y DESTACADOS */}
      <div className="row">
        {/* Productos Recientes */}
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Productos Recientes</h5>
              <a href="/admin/items" className="btn btn-sm btn-soft-primary">
                Ver todos
              </a>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>SKU</th>
                      <th>Agregado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts?.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={product.image ? `/storage/images/item/${product.image}` : '/api/cover/thumbnail/null'}
                              alt={product.name} 
                              className="me-3 rounded"
                              style={{width: '40px', height: '40px', objectFit: 'cover'}}
                              onError={e => e.target.src = '/api/cover/thumbnail/null'}
                            />
                            <span className="text-truncate" style={{maxWidth: '200px'}}>
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted">{product.sku || 'N/A'}</span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(product.created_at).toLocaleDateString('es-PE')}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Productos Destacados */}
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Productos Recomendados</h5>
              <span className="badge bg-soft-warning text-warning">
                {formatNumber(featuredProducts?.length || 0)} productos
              </span>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>SKU</th>
                      <th className="text-end">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featuredProducts?.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={product.image ? `/storage/images/item/${product.image}` : '/api/cover/thumbnail/null'}
                              alt={product.name} 
                              className="me-3 rounded"
                              style={{width: '40px', height: '40px', objectFit: 'cover'}}
                              onError={e => e.target.src = '/api/cover/thumbnail/null'}
                            />
                            <span className="text-truncate" style={{maxWidth: '200px'}}>
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted">{product.sku || 'N/A'}</span>
                        </td>
                        <td className="text-end">
                          <span className="badge bg-soft-warning text-warning">
                            <i className="fas fa-star me-1"></i>
                            Destacado
                          </span>
                        </td>
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
    <BaseAdminto {...properties} title="Dashboard - Analíticas del Catálogo">
      <Home {...properties} />
    </BaseAdminto>
  );
});