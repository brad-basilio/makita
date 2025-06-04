import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const Zonas = () => {
  const [distribuidoresExpanded, setDistribuidoresExpanded] = useState(true);
  const [serviciosExpanded, setServiciosExpanded] = useState(true);
  const [selectedDistributor, setSelectedDistributor] = useState('dismac');
  
  // Distributor data
  const distributors = {
    dismac: {
      name: "Dismac Perú Sociedad Anónima Cerrada (Dismac Perú S.A.C.)",
      address: "Av. Tomás Valle Mza. D Lote 4, Callao, Perú",
      phone: ["(01) 574 9156", "(01) 574 8083"],
      email: "No disponible publicamente",
      hours: {
        weekdays: "08:00 - 20:00",
        saturday: "08:00 - 16:00"
      },
      branches: [
        {
          name: "Gamarra",
          address: "Av. Agustina Gamarra 1345, Los Olivos, Lima, Perú",
          phone: "(01) 533-0518",
          email: "No disponible publicamente",
          hours: {
            weekdays: "08:00 - 20:00",
            saturday: "08:00 - 16:00"
          }
        },
        {
          name: "Tomás Valle",
          address: "Av. Tomás Valle KM1, Urb. El Olivar, Callao, Perú",
          phone: "No disponible publicamente",
          email: "No disponible publicamente",
          hours: {
            weekdays: "08:00 - 20:00",
            saturday: "08:00 - 16:00"
          }
        }
      ]
    }
  };
  
  return (
    <div className="font-paragraph py-12">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Encuentra tu Distribuidor y Red de Servicios Makita en Perú
          </h1>
          <p className="text-gray-700">
            Conoce los principales distribuidores y centros de servicio autorizados de Makita en Perú. Aquí encontrarás direcciones, teléfonos y contactos para adquirir 
            herramientas originales, repuestos y acceder a mantenimiento especializado. ¡Ubica el más cercano y recibe la mejor atención!
          </p>
        </div>
        
        <div className="grid md:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            {/* Distribuidores Section */}
            <div className="mb-6 border rounded-lg shadow-sm bg-white">
              <div 
                className="flex items-center justify-between p-4 border-b cursor-pointer"
                onClick={() => setDistribuidoresExpanded(!distribuidoresExpanded)}
              >
                <h2 className="font-bold">Lista de Distribuidores y Red de Servicios</h2>
                {distribuidoresExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {distribuidoresExpanded && (
                <div className="p-4">
                  <h3 className="font-bold mb-3">Distribuidores</h3>
                  <div className="relative mb-4">
                    <input 
                      type="text" 
                      placeholder="Buscar nombre" 
                      className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  
                  {/* Distributor Checkboxes */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" checked={true} />
                      <span>Todos</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Sodimac Perú</span>
                    </label>
                    <div className="text-xs text-gray-500 ml-6">Av. Tomás Valle N°130 Urb. Callao, Perú</div>
                    
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Promart</span>
                    </label>
                    <div className="text-xs text-gray-500 ml-6">Av. Tomás Valle N°190 Urb. Callao, Perú</div>
                    
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Maestro Perú</span>
                    </label>
                    <div className="text-xs text-gray-500 ml-6">Av. Tomás Valle N°635 Urb. Callao, Perú</div>
                    
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" checked={true} />
                      <span>Dismac Perú</span>
                    </label>
                    <div className="text-xs text-gray-500 ml-6">Av. Tomás Valle N°1044 Urb. Callao, Perú</div>
                    
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Vulcano del Perú</span>
                    </label>
                    <div className="text-xs text-gray-500 ml-6">Av. Tomás Valle N°1045 Urb. Callao, Perú</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Red de Servicios Section */}
            <div className="mb-6 border rounded-lg shadow-sm bg-white">
              <div 
                className="flex items-center justify-between p-4 border-b cursor-pointer"
                onClick={() => setServiciosExpanded(!serviciosExpanded)}
              >
                <h2 className="font-bold">Red de Servicios</h2>
                {serviciosExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {serviciosExpanded && (
                <div className="p-4">
                  <div className="relative mb-4">
                    <input 
                      type="text" 
                      placeholder="Buscar nombre" 
                      className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  
                  {/* Service Centers Checkboxes */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" checked={true} />
                      <span>Todos</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" checked={true} />
                      <span>Makita Perú (Sede Central, Lima)</span>
                    </label>
                    <div className="text-xs text-gray-500 ml-6">Av. Angélica Gamarra 1345, Los Olivos, Lima, Perú</div>
                    
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Servicio Técnico Power Tools (Lima)</span>
                    </label>
                    <div className="text-xs text-gray-500 ml-6">Av. Angélica Gamarra 1345, Los Olivos, Lima, Perú</div>
                    
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Taller de Servicio Rocco Makita (Trujillo)</span>
                    </label>
                    <div className="text-xs text-gray-500 ml-6">Av. Angélica Gamarra 1345, Los Olivos, Lima, Perú</div>
                    
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Ferretería (Chiclayo)</span>
                    </label>
                    <div className="text-xs text-gray-500 ml-6">Av. Angélica Gamarra 1345, Los Olivos, Lima, Perú</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Content - Map and Details */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* Map Placeholder */}
            <div className="w-full h-80 bg-gray-200 rounded-lg mb-8 relative overflow-hidden">
              <img 
                src="/assets/img/makita-map.png" 
                alt="Mapa de distribuidores Makita" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "";
                }}
              />
              {/* Red Map Pins */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                  <span className="text-xs">1</span>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                  <span className="text-xs">2</span>
                </div>
              </div>
              <div className="absolute top-2/3 left-3/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                  <span className="text-xs">3</span>
                </div>
              </div>
            </div>
            
            {/* Distributor Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="font-bold text-xl mb-4">Razón Social</h2>
              <h3 className="text-lg font-semibold">{distributors[selectedDistributor].name}</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold mb-1">Dirección</h4>
                  <p className="text-gray-700 mb-4">{distributors[selectedDistributor].address}</p>
                  
                  <h4 className="font-semibold mb-1">Teléfono</h4>
                  {distributors[selectedDistributor].phone.map((phone, index) => (
                    <p key={index} className="text-gray-700">{phone}</p>
                  ))}
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1">Correo Electrónico</h4>
                  <p className="text-gray-700 mb-4">{distributors[selectedDistributor].email}</p>
                  
                  <h4 className="font-semibold mb-1">Horario de atención:</h4>
                  <p className="text-gray-700">Lun - Vie: {distributors[selectedDistributor].hours.weekdays}</p>
                  <p className="text-gray-700">Sáb: {distributors[selectedDistributor].hours.saturday}</p>
                </div>
              </div>
              
              {/* Sucursales */}
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Sucursales</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {distributors[selectedDistributor].branches.map((branch, index) => (
                    <div key={index} className="border-t pt-4">
                      <h4 className="font-semibold mb-2">{branch.name}</h4>
                      <p className="text-gray-700 mb-3">{branch.address}</p>
                      
                      <h5 className="font-medium mb-1">Teléfono</h5>
                      <p className="text-gray-700 mb-3">{branch.phone}</p>
                      
                      <h5 className="font-medium mb-1">Correo Electrónico</h5>
                      <p className="text-gray-700 mb-3">{branch.email}</p>
                      
                      <h5 className="font-medium mb-1">Horario de atención:</h5>
                      <p className="text-gray-700">Lun - Vie: {branch.hours.weekdays}</p>
                      <p className="text-gray-700">Sáb: {branch.hours.saturday}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zonas;
