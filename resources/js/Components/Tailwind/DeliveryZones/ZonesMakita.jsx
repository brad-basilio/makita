import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, ChevronDown, ChevronUp, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Global from '../../../Utils/Global';

const ZonesMakita = ({items = []}) => {
  console.log("ZonesMakita items:", items);
  console.log("GMAPS_API_KEY from Global:", Global.get('GMAPS_API_KEY'));
  
  const [distribuidoresExpanded, setDistribuidoresExpanded] = useState(true);
  const [serviciosExpanded, setServiciosExpanded] = useState(true);
  const [selectedDistributors, setSelectedDistributors] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchDistributor, setSearchDistributor] = useState('');
  const [searchService, setSearchService] = useState('');  const [selectedDetail, setSelectedDetail] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Memoize distributors and services to prevent infinite re-renders
  const distributors = useMemo(() => 
    items.filter(item => item.type === 'distributor' && item.visible && item.status),
    [items]
  );
  
  const services = useMemo(() => 
    items.filter(item => item.type === 'service_network' && item.visible && item.status),
    [items]
  );
  // Memoize filtered results to prevent unnecessary re-renders
  const filteredDistributors = useMemo(() => 
    distributors.filter(dist => 
      dist.name.toLowerCase().includes(searchDistributor.toLowerCase())
    ),
    [distributors, searchDistributor]
  );
  
  const filteredServices = useMemo(() => 
    services.filter(service => 
      service.name.toLowerCase().includes(searchService.toLowerCase())
    ),
    [services, searchService]
  );
  // Initialize with all selected
  useEffect(() => {
    console.log('Initializing selections with distributors:', distributors.length, 'services:', services.length);
    setSelectedDistributors(distributors.map(d => d.id));
    setSelectedServices(services.map(s => s.id));    if (distributors.length > 0) {
      console.log('Setting default detail to:', distributors[0].name);
      setSelectedDetail(distributors[0]);
    } else if (services.length > 0) {
      console.log('Setting default detail to service:', services[0].name);
      setSelectedDetail(services[0]);
    }
  }, [items]);
  // Load Google Maps script
  useEffect(() => {
    if (typeof google === 'undefined') {
      const apiKey = Global.get('GMAPS_API_KEY');
      console.log('Loading Google Maps with API key:', apiKey ? 'Key found' : 'No key found');
      
      if (!apiKey) {
        console.error('GMAPS_API_KEY not found in Global configuration');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Maps loaded successfully');
        if (document.getElementById('map')) {
          initializeMap();
        }
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps');
      };
      document.head.appendChild(script);
    } else {
      console.log('Google Maps already loaded');
      if (document.getElementById('map')) {
        initializeMap();
      }
    }
  }, []);  // Google Maps integration - Update when selections change
  useEffect(() => {
    if (typeof google !== 'undefined' && google.maps && document.getElementById('map') && map) {
      console.log('Updating map with selections:', { 
        distributors: selectedDistributors.length, 
        services: selectedServices.length 
      });
      addMarkersToMap(map);
    }
  }, [selectedDistributors, selectedServices, map]); // Removed distributors and services to prevent infinite loop
  const initializeMap = () => {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    console.log('Initializing Google Maps...');

    // Center map on Peru
    const peruCenter = { lat: -12.0464, lng: -77.0428 };
    
    const newMap = new google.maps.Map(mapElement, {
      zoom: 11,
      center: peruCenter,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    console.log('Map created successfully');
    setMap(newMap);
    
    // Add initial markers
    setTimeout(() => {
      addMarkersToMap(newMap);
    }, 100);
  };  const addMarkersToMap = useCallback((mapInstance) => {
    console.log('Adding markers to map...');
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers = [];

    const selectedItems = [
      ...distributors.filter(d => selectedDistributors.includes(d.id)),
      ...services.filter(s => selectedServices.includes(s.id))
    ];

    console.log('Selected items for map:', selectedItems.length);

    selectedItems.forEach((item, index) => {
      // Add main location marker
      if (item.location) {
        const locationParts = item.location.split(',');
        if (locationParts.length >= 2) {
          const lat = parseFloat(locationParts[0].trim());
          const lng = parseFloat(locationParts[1].trim());
          
          if (!isNaN(lat) && !isNaN(lng)) {
            console.log(`Adding marker for ${item.name} at ${lat}, ${lng}`);
            
            const marker = new google.maps.Marker({
              position: { lat, lng },
              map: mapInstance,
              title: item.name,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: item.type === 'distributor' ? '#3B82F6' : '#10B981',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
              }
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; max-width: 250px;">
                  <h3 style="margin: 0 0 8px 0; font-weight: bold;">${item.name}</h3>
                  <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${item.address}</p>
                  <p style="margin: 0; color: #3B82F6; font-size: 12px;">${item.type === 'distributor' ? 'Distribuidor' : 'Red de Servicio'}</p>
                </div>
              `
            });

            marker.addListener('click', () => {
              // Close all other info windows
              newMarkers.forEach(m => {
                if (m.infoWindow) m.infoWindow.close();
              });
              infoWindow.open(mapInstance, marker);
              setSelectedDetail(item);
            });

            marker.infoWindow = infoWindow;
            newMarkers.push(marker);
          }
        }
      }

      // Add branch markers
      if (item.branches && Array.isArray(item.branches)) {
        item.branches.forEach((branch, branchIndex) => {
          if (branch.location) {
            const locationParts = branch.location.split(',');
            if (locationParts.length >= 2) {
              const lat = parseFloat(locationParts[0].trim());
              const lng = parseFloat(locationParts[1].trim());
              
              if (!isNaN(lat) && !isNaN(lng)) {
                console.log(`Adding branch marker for ${branch.name} at ${lat}, ${lng}`);
                
                const branchMarker = new google.maps.Marker({
                  position: { lat, lng },
                  map: mapInstance,
                  title: `${item.name} - ${branch.name}`,
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: item.type === 'distributor' ? '#93C5FD' : '#86EFAC',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 1
                  }
                });

                const branchInfoWindow = new google.maps.InfoWindow({
                  content: `
                    <div style="padding: 8px; max-width: 250px;">
                      <h3 style="margin: 0 0 4px 0; font-weight: bold;">${branch.name}</h3>
                      <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">${item.name}</p>
                      <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${branch.address}</p>
                      <p style="margin: 0; color: #10B981; font-size: 12px;">Sucursal</p>
                    </div>
                  `
                });

                branchMarker.addListener('click', () => {
                  // Close all other info windows
                  newMarkers.forEach(m => {
                    if (m.infoWindow) m.infoWindow.close();
                  });
                  branchInfoWindow.open(mapInstance, branchMarker);
                  setSelectedDetail(item);
                });

                branchMarker.infoWindow = branchInfoWindow;
                newMarkers.push(branchMarker);
              }
            }
          }
        });
      }
    });

    setMarkers(newMarkers);

    // Adjust map bounds to fit all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
      mapInstance.fitBounds(bounds);
      
      // Don't zoom too much for single marker
      if (newMarkers.length === 1) {
        setTimeout(() => mapInstance.setZoom(15), 100);
      }
    } else {
      // No markers, center on Peru      mapInstance.setCenter({ lat: -12.0464, lng: -77.0428 });
      mapInstance.setZoom(6);
    }
  }, [markers, distributors, services, selectedDistributors, selectedServices, setMarkers]);
  const handleItemSelection = useCallback((item) => {
    console.log('Item selected:', item.name, item.type);
    setSelectedDetail(item);
    
    // Make sure the item is selected in the checkboxes
    if (item.type === 'distributor') {
      if (!selectedDistributors.includes(item.id)) {
        console.log('Adding distributor to selection for map visibility');
        setSelectedDistributors([...selectedDistributors, item.id]);
      }
    } else if (item.type === 'service_network') {
      if (!selectedServices.includes(item.id)) {
        console.log('Adding service to selection for map visibility');
        setSelectedServices([...selectedServices, item.id]);
      }
    }
    
    // Center map on the selected item
    if (map && item.location) {
      const locationParts = item.location.split(',');
      if (locationParts.length >= 2) {
        const lat = parseFloat(locationParts[0].trim());
        const lng = parseFloat(locationParts[1].trim());
        
        if (!isNaN(lat) && !isNaN(lng)) {
          map.setCenter({ lat, lng });
          map.setZoom(15);
          console.log(`Map centered on ${item.name} at ${lat}, ${lng}`);
        }
      }
    }
  }, [selectedDistributors, selectedServices, map]);
  const handleDistributorChange = useCallback((distributorId, checked) => {
    console.log('Distributor change:', distributorId, checked);
    if (checked) {
      setSelectedDistributors(prev => [...prev, distributorId]);
    } else {
      setSelectedDistributors(prev => prev.filter(id => id !== distributorId));
    }
  }, []);

  const handleServiceChange = useCallback((serviceId, checked) => {
    console.log('Service change:', serviceId, checked);
    if (checked) {
      setSelectedServices(prev => [...prev, serviceId]);
    } else {
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    }
  }, []);

  const handleSelectAllDistributors = useCallback((checked) => {
    console.log('Select all distributors:', checked);
    if (checked) {
      setSelectedDistributors(distributors.map(d => d.id));
    } else {
      setSelectedDistributors([]);
    }
  }, [distributors]);

  const handleSelectAllServices = useCallback((checked) => {
    console.log('Select all services:', checked);
    if (checked) {
      setSelectedServices(services.map(s => s.id));
    } else {
      setSelectedServices([]);
    }
  }, [services]);
  const parsePhones = useCallback((phoneString) => {
    if (!phoneString) return [];
    return phoneString.split(',').map(phone => phone.trim()).filter(phone => phone);
  }, []);

  const parseEmails = useCallback((emailString) => {
    if (!emailString) return [];
    return emailString.split(',').map(email => email.trim()).filter(email => email);
  }, []);

  return (
    <div className="font-paragraph py-12">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Encuentra tu Distribuidor y Red de Servicios Makita en Perú
          </h1>          <p className="text-gray-700">
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
                      value={searchDistributor}
                      onChange={(e) => setSearchDistributor(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  
                  {/* Distributor Checkboxes */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={selectedDistributors.length === distributors.length}
                        onChange={(e) => handleSelectAllDistributors(e.target.checked)}
                      />
                      <span>Todos</span>
                    </label>                    {filteredDistributors.map(distributor => (
                      <div key={distributor.id} className="border-b border-gray-100 last:border-b-0">
                        <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                          <input 
                            type="checkbox" 
                            className="rounded mt-1 flex-shrink-0" 
                            checked={selectedDistributors.includes(distributor.id)}
                            onChange={(e) => handleDistributorChange(distributor.id, e.target.checked)}
                          />
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => handleItemSelection(distributor)}
                          >
                            <div className="font-medium text-blue-600 hover:text-blue-800 text-sm">
                              {distributor.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {distributor.address}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                      value={searchService}
                      onChange={(e) => setSearchService(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  
                  {/* Service Centers Checkboxes */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={selectedServices.length === services.length}
                        onChange={(e) => handleSelectAllServices(e.target.checked)}
                      />
                      <span>Todos</span>
                    </label>                    {filteredServices.map(service => (
                      <div key={service.id} className="border-b border-gray-100 last:border-b-0">
                        <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                          <input 
                            type="checkbox" 
                            className="rounded mt-1 flex-shrink-0" 
                            checked={selectedServices.includes(service.id)}
                            onChange={(e) => handleServiceChange(service.id, e.target.checked)}
                          />
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => handleItemSelection(service)}
                          >
                            <div className="font-medium text-green-600 hover:text-green-800 text-sm">
                              {service.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {service.address}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
            {/* Right Content - Map and Details */}
          <div className="md:col-span-8 lg:col-span-9">            {/* Google Map */}
            <div className="w-full h-80 bg-gray-200 rounded-lg mb-8 relative overflow-hidden">
              <div id="map" className="w-full h-full"></div>
              {(!map && typeof google === 'undefined') && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Cargando Google Maps...</p>
                    <p className="text-xs text-gray-500 mt-1">
                      API Key: {Global.get('GMAPS_API_KEY') ? '✓ Configurada' : '✗ No encontrada'}
                    </p>
                  </div>
                </div>
              )}
              {(typeof google !== 'undefined' && !map) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Inicializando mapa...</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Details Section */}
            {selectedDetail && (
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedDetail.type === 'distributor' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedDetail.type === 'distributor' ? 'Distribuidor' : 'Red de Servicio'}
                  </div>
                </div>
                
                <h2 className="font-bold text-xl mb-2">{selectedDetail.name}</h2>
                {selectedDetail.business_name && (
                  <h3 className="text-lg text-gray-600 mb-4">{selectedDetail.business_name}</h3>
                )}
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <div className="flex items-start gap-2 mb-4">
                      <MapPin className="text-gray-500 mt-1" size={18} />
                      <div>
                        <h4 className="font-semibold mb-1">Dirección</h4>
                        <p className="text-gray-700">{selectedDetail.address}</p>
                      </div>
                    </div>
                    
                    {parsePhones(selectedDetail.phones).length > 0 && (
                      <div className="flex items-start gap-2 mb-4">
                        <Phone className="text-gray-500 mt-1" size={18} />
                        <div>
                          <h4 className="font-semibold mb-1">Teléfono</h4>
                          {parsePhones(selectedDetail.phones).map((phone, index) => (
                            <p key={index} className="text-gray-700">{phone}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {parseEmails(selectedDetail.emails).length > 0 && (
                      <div className="flex items-start gap-2 mb-4">
                        <Mail className="text-gray-500 mt-1" size={18} />
                        <div>
                          <h4 className="font-semibold mb-1">Correo Electrónico</h4>
                          {parseEmails(selectedDetail.emails).map((email, index) => (
                            <p key={index} className="text-gray-700">{email}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedDetail.opening_hours && (
                      <div className="flex items-start gap-2">
                        <Clock className="text-gray-500 mt-1" size={18} />
                        <div>
                          <h4 className="font-semibold mb-1">Horario de atención</h4>
                          <p className="text-gray-700">{selectedDetail.opening_hours}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Sucursales */}
                {selectedDetail.branches && selectedDetail.branches.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <MapPin size={20} />
                      Sucursales ({selectedDetail.branches.length})
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {selectedDetail.branches.map((branch, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-semibold mb-3 text-blue-600">{branch.name}</h4>
                          
                          <div className="space-y-3">
                            <div className="flex items-start gap-2">
                              <MapPin className="text-gray-500 mt-1" size={16} />
                              <p className="text-gray-700 text-sm">{branch.address}</p>
                            </div>
                            
                            {branch.phones && (
                              <div className="flex items-start gap-2">
                                <Phone className="text-gray-500 mt-1" size={16} />
                                <div>
                                  {parsePhones(branch.phones).map((phone, phoneIndex) => (
                                    <p key={phoneIndex} className="text-gray-700 text-sm">{phone}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {branch.emails && (
                              <div className="flex items-start gap-2">
                                <Mail className="text-gray-500 mt-1" size={16} />
                                <div>
                                  {parseEmails(branch.emails).map((email, emailIndex) => (
                                    <p key={emailIndex} className="text-gray-700 text-sm">{email}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {branch.opening_hours && (
                              <div className="flex items-start gap-2">
                                <Clock className="text-gray-500 mt-1" size={16} />
                                <p className="text-gray-700 text-sm">{branch.opening_hours}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!selectedDetail && (
              <div className="bg-white rounded-lg shadow-sm p-6 border text-center">
                <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-lg font-semibold mb-2">Selecciona un punto en el mapa</h3>
                <p className="text-gray-600">Haz clic en cualquier marcador del mapa para ver los detalles del distribuidor o servicio técnico.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZonesMakita;
