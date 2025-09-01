import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, ChevronDown, ChevronUp, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Global from '../../../Utils/Global';

const ZonesMakita = ({ items = [] }) => {


  const [distribuidoresExpanded, setDistribuidoresExpanded] = useState(true);
  const [serviciosExpanded, setServiciosExpanded] = useState(true);
  const [selectedDistributors, setSelectedDistributors] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchDistributor, setSearchDistributor] = useState('');
  const [searchService, setSearchService] = useState(''); const [selectedDetail, setSelectedDetail] = useState(null);
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
    setSelectedServices(services.map(s => s.id)); if (distributors.length > 0) {
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
  }; const addMarkersToMap = useCallback((mapInstance) => {
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
            console.log(`Adding marker for ${item.name} at ${lat}, ${lng}`); const marker = new google.maps.Marker({
              position: { lat, lng },
              map: mapInstance,
              title: item.name,
              icon: createMarkerIcon(item.type, true) // Main markers with specific icons
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
                console.log(`Adding branch marker for ${branch.name} at ${lat}, ${lng}`); const branchMarker = new google.maps.Marker({
                  position: { lat, lng },
                  map: mapInstance,
                  title: `${item.name} - ${branch.name}`,
                  icon: createMarkerIcon(item.type, false) // Keep circles for branches (smaller)
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
        setSelectedDistributors(prev => [...prev, item.id]);
      }
    } else if (item.type === 'service_network') {
      if (!selectedServices.includes(item.id)) {
        console.log('Adding service to selection for map visibility');
        setSelectedServices(prev => [...prev, item.id]);
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

  const parseOpenHours = useCallback((openHoursString) => {
    if (!openHoursString) return [];
    // Handle both old format (comma-separated) and new format (newline-separated)
    const separator = openHoursString.includes('\n') ? '\n' : ',';
    return openHoursString.split(separator).map(hour => hour.trim()).filter(hour => hour);
  }, []);
  // Get all selected items to display in details section
  const selectedItems = useMemo(() => {
    const selectedDistributorItems = distributors.filter(d => selectedDistributors.includes(d.id));
    const selectedServiceItems = services.filter(s => selectedServices.includes(s.id));
    return [...selectedDistributorItems, ...selectedServiceItems];
  }, [distributors, services, selectedDistributors, selectedServices]);  // Create custom marker icons - Using provided SVG design
  const createMarkerIcon = useCallback((type, isMain = true) => {
    const size = isMain ? 40 : 32;
    const scale = isMain ? 1 : 0.8;

    const svgIcon = `
      <svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" transform="scale(${scale})">
        <circle opacity="0.92" cx="20" cy="20" r="20" fill="#EC1B24"/>
        <path d="M20.0007 26.6663C19.8451 26.6663 19.7118 26.6219 19.6007 26.533C19.4895 26.4441 19.4062 26.3275 19.3507 26.183C19.1395 25.5608 18.8729 24.9775 18.5507 24.433C18.2395 23.8886 17.8007 23.2497 17.234 22.5163C16.6673 21.783 16.2062 21.083 15.8507 20.4163C15.5062 19.7497 15.334 18.9441 15.334 17.9997C15.334 16.6997 15.784 15.5997 16.684 14.6997C17.5951 13.7886 18.7007 13.333 20.0007 13.333C21.3007 13.333 22.4007 13.7886 23.3007 14.6997C24.2118 15.5997 24.6673 16.6997 24.6673 17.9997C24.6673 19.0108 24.4729 19.8552 24.084 20.533C23.7062 21.1997 23.2673 21.8608 22.7673 22.5163C22.1673 23.3163 21.7118 23.983 21.4007 24.5163C21.1007 25.0386 20.8507 25.5941 20.6507 26.183C20.5951 26.3386 20.5062 26.4608 20.384 26.5497C20.2729 26.6275 20.1451 26.6663 20.0007 26.6663ZM20.0007 19.6663C20.4673 19.6663 20.8618 19.5052 21.184 19.183C21.5062 18.8608 21.6673 18.4663 21.6673 17.9997C21.6673 17.533 21.5062 17.1386 21.184 16.8163C20.8618 16.4941 20.4673 16.333 20.0007 16.333C19.534 16.333 19.1395 16.4941 18.8173 16.8163C18.4951 17.1386 18.334 17.533 18.334 17.9997C18.334 18.4663 18.4951 18.8608 18.8173 19.183C19.1395 19.5052 19.534 19.6663 20.0007 19.6663Z" fill="#F6F6F6"/>
      </svg>
    `;

    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgIcon),
      size: new google.maps.Size(size, size),
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size / 2, size),
      origin: new google.maps.Point(0, 0)
    };
  }, []);

  // Alternative: Create pin-style marker icons (Google Maps style)
  const createPinMarkerIcon = useCallback((type, isMain = true) => {
    const colors = {
      distributor: {
        main: '#ff0d0d',
        stroke: '#1E40AF'
      },
      service_network: {
        main: '#ff0d0d',
        stroke: '#047857'
      }
    };

    const color = colors[type];
    const size = isMain ? 32 : 24;
    const iconScale = isMain ? 0.8 : 0.6;

    // SVG for store/building icon for distributors
    const storeIcon = `
      <g transform="scale(${iconScale}) translate(${16 - (16 * iconScale)}, ${10 - (10 * iconScale)})">
        <path fill="white" stroke="none" d="M19 7V4C19 3.45 18.55 3 18 3H6C5.45 3 5 3.45 5 4V7H3V20H21V7H19ZM17 5V7H7V5H17ZM19 18H5V9H19V18ZM7 11H9V16H7V11ZM11 11H13V16H11V11ZM15 11H17V16H15V11Z"/>
      </g>
    `;

    // SVG for wrench/tool icon for service networks  
    const toolIcon = `
      <g transform="scale(${iconScale}) translate(${16 - (16 * iconScale)}, ${10 - (10 * iconScale)})">
        <path fill="white" stroke="none" d="M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.7,20.3C23.1,19.9 23.1,19.3 22.7,19Z"/>
      </g>
    `;

    const svgIcon = `
      <svg width="${size}" height="${size}" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="pin-shadow-${type}-${isMain}" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.4)"/>
          </filter>
        </defs>
        <!-- Pin shape -->
        <path d="M16 1C9.373 1 4 6.373 4 13c0 8.5 12 25 12 25s12-16.5 12-25c0-6.627-5.373-12-12-12z" 
              fill="${color.main}" 
              stroke="white" 
              stroke-width="2" 
              filter="url(#pin-shadow-${type}-${isMain})"/>
        
        <!-- Icon container circle -->
        <circle cx="16" cy="13" r="8" fill="white" fill-opacity="0.2"/>
        
        <!-- Icon -->
        ${type === 'distributor' ? storeIcon : toolIcon}
      </svg>
    `;

    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgIcon),
      size: new google.maps.Size(size, size * 1.25),
      scaledSize: new google.maps.Size(size, size * 1.25),
      anchor: new google.maps.Point(size / 2, size * 1.25),
      origin: new google.maps.Point(0, 0)
    };
  }, []);

  return (
    <div className="font-paragraph py-16 customtext-neutral-dark">
      <div className="px-primary mx-auto 2xl:px-0 2xl:max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-[58px] font-bold mb-4 max-w-5xl tracking-wide lg:leading-[60px]" >
            Encuentra tu Distribuidor y Red de Servicios Makita en Perú
          </h1>
          <p className="text-[#262626] text-xl font-normal">
            Conoce los principales distribuidores y centros de servicio autorizados de Makita en Perú. Aquí encontrarás direcciones, teléfonos y contactos para adquirir
            herramientas originales, repuestos y acceder a mantenimiento especializado. ¡Ubica el más cercano y recibe la mejor atención!
          </p>
        </div>

        <div className="grid md:grid-cols-6 gap-12 mt-16">
          {/* Left Sidebar */}
          <div className="col-span-6 lg:col-span-2">
            {/* Distribuidores Section */}
            <div className="mb-6  bg-white">
              <div
                className=" cursor-pointer mb-4"

              >
                <h2 className="font-bold text-2xl tracking-wide">Lista de Distribuidores y Red de Servicios</h2>

              </div>

              <div className="">
                <h3 className="font-normal mb-0 bg-gray-100 text-lg flex items-center justify-between px-4 py-3" onClick={() => setDistribuidoresExpanded(!distribuidoresExpanded)}>Distribuidores  {distribuidoresExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</h3>
                {distribuidoresExpanded && (
                  <div className='px-4 py-2'>
                    <div className="relative mb-4">
                      <input
                        type="text"
                        placeholder="Buscar nombre"
                        className="w-full border border-gray-200 outline-none rounded-lg pr-10 pl-4 py-3 text-base"
                        value={searchDistributor}
                        onChange={(e) => setSearchDistributor(e.target.value)}
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 customtext-neutral-light" size={22} />
                    </div>

                    {/* Distributor Checkboxes */}
                    <div className="flex flex-col gap-4">
                      <label
                        className="flex items-center gap-3 py-1.5 px-2 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleSelectAllDistributors(selectedDistributors.length !== distributors.length)}
                      >
                        <div className="relative h-4 w-4">
                          {selectedDistributors.length === distributors.length ? (
                            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6.83333 11L12.7083 5.125L11.5417 3.95833L6.83333 8.66667L4.45833 6.29167L3.29167 7.45833L6.83333 11ZM2.16667 15C1.70833 15 1.31597 14.8368 0.989583 14.5104C0.663194 14.184 0.5 13.7917 0.5 13.3333V1.66667C0.5 1.20833 0.663194 0.815972 0.989583 0.489583C1.31597 0.163194 1.70833 0 2.16667 0H13.8333C14.2917 0 14.684 0.163194 15.0104 0.489583C15.3368 0.815972 15.5 1.20833 15.5 1.66667V13.3333C15.5 13.7917 15.3368 14.184 15.0104 14.5104C14.684 14.8368 14.2917 15 13.8333 15H2.16667ZM2.16667 13.3333H13.8333V1.66667H2.16667V13.3333Z" fill="#219FB9" />
                            </svg>
                          ) : (
                            <div className="h-4 w-4 border-2 border-neutral-dark bg-white rounded"></div>
                          )}
                        </div>
                        <span className={`text-md font-medium ${selectedDistributors.length === distributors.length ? 'text-[#262626] font-bold' : 'text-[#262626]'}`}>
                          Todos
                        </span>
                      </label>
                      {filteredDistributors.map(distributor => (
                        <div key={distributor.id} className="">
                          <div className="flex items-start gap-2 rounded">
                            <label
                              className="flex items-center gap-3 py-1.5 px-2 hover:bg-gray-50 cursor-pointer transition-colors flex-shrink-0 mt-1"
                              onClick={() => handleDistributorChange(distributor.id, !selectedDistributors.includes(distributor.id))}
                            >
                              <div className="relative h-4 w-4">
                                {selectedDistributors.includes(distributor.id) ? (
                                  <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.83333 11L12.7083 5.125L11.5417 3.95833L6.83333 8.66667L4.45833 6.29167L3.29167 7.45833L6.83333 11ZM2.16667 15C1.70833 15 1.31597 14.8368 0.989583 14.5104C0.663194 14.184 0.5 13.7917 0.5 13.3333V1.66667C0.5 1.20833 0.663194 0.815972 0.989583 0.489583C1.31597 0.163194 1.70833 0 2.16667 0H13.8333C14.2917 0 14.684 0.163194 15.0104 0.489583C15.3368 0.815972 15.5 1.20833 15.5 1.66667V13.3333C15.5 13.7917 15.3368 14.184 15.0104 14.5104C14.684 14.8368 14.2917 15 13.8333 15H2.16667ZM2.16667 13.3333H13.8333V1.66667H2.16667V13.3333Z" fill="#219FB9" />
                                  </svg>
                                ) : (
                                  <div className="h-4 w-4 border-2 border-neutral-dark bg-white rounded"></div>
                                )}
                              </div>
                            </label>
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleItemSelection(distributor)}
                            >
                              <div className="font-medium  text-md">
                                {distributor.name}
                              </div>
                              <div className="text-sm font-normal tracking-wide customtext-neutral-light mt-1">
                                {distributor.address}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div></div>
                )}
              </div>

            </div>

            {/* Red de Servicios Section */}
            <div className="mb-6  bg-white">
              <div
                className="flex items-center justify-between px-4 py-3 bg-gray-100 cursor-pointer"
                onClick={() => setServiciosExpanded(!serviciosExpanded)}
              >
                <h2 className="font-normal text-lg tracking-wide">Red de Servicios</h2>
                {serviciosExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {serviciosExpanded && (
                <div className="p-4">
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Buscar nombre"
                      className="w-full border border-gray-200 outline-none rounded-lg pr-10 pl-4 py-3 text-base"
                      value={searchService}
                      onChange={(e) => setSearchService(e.target.value)}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 customtext-neutral-light" size={22} />
                  </div>

                  {/* Service Centers Checkboxes */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 py-1.5 px-2 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleSelectAllServices(!(selectedServices.length === services.length))}>
                      <div className="relative h-4 w-4">
                        {selectedServices.length === services.length ? (
                          <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.83333 11L12.7083 5.125L11.5417 3.95833L6.83333 8.66667L4.45833 6.29167L3.29167 7.45833L6.83333 11ZM2.16667 15C1.70833 15 1.31597 14.8368 0.989583 14.5104C0.663194 14.184 0.5 13.7917 0.5 13.3333V1.66667C0.5 1.20833 0.663194 0.815972 0.989583 0.489583C1.31597 0.163194 1.70833 0 2.16667 0H13.8333C14.2917 0 14.684 0.163194 15.0104 0.489583C15.3368 0.815972 15.5 1.20833 15.5 1.66667V13.3333C15.5 13.7917 15.3368 14.184 15.0104 14.5104C14.684 14.8368 14.2917 15 13.8333 15H2.16667ZM2.16667 13.3333H13.8333V1.66667H2.16667V13.3333Z" fill="#219FB9" />
                          </svg>
                        ) : (
                          <div className="h-4 w-4 border-2 border-neutral-dark bg-white rounded"></div>
                        )}
                      </div>
                      <span className={selectedServices.length === services.length ? 'font-normal' : ''}>Todos</span>
                    </label>
                    {filteredServices.map(service => (
                      <div key={service.id} className="">
                        <div className="flex items-start gap-2 rounded">
                          <label
                            className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 cursor-pointer transition-colors flex-shrink-0 mt-1"
                            onClick={() => handleServiceChange(service.id, !selectedServices.includes(service.id))}
                          >
                            <div className="relative h-4 w-4">
                              {selectedServices.includes(service.id) ? (
                                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6.83333 11L12.7083 5.125L11.5417 3.95833L6.83333 8.66667L4.45833 6.29167L3.29167 7.45833L6.83333 11ZM2.16667 15C1.70833 15 1.31597 14.8368 0.989583 14.5104C0.663194 14.184 0.5 13.7917 0.5 13.3333V1.66667C0.5 1.20833 0.663194 0.815972 0.989583 0.489583C1.31597 0.163194 1.70833 0 2.16667 0H13.8333C14.2917 0 14.684 0.163194 15.0104 0.489583C15.3368 0.815972 15.5 1.20833 15.5 1.66667V13.3333C15.5 13.7917 15.3368 14.184 15.0104 14.5104C14.684 14.8368 14.2917 15 13.8333 15H2.16667ZM2.16667 13.3333H13.8333V1.66667H2.16667V13.3333Z" fill="#219FB9" />
                                </svg>
                              ) : (
                                <div className="h-4 w-4 border-2 border-neutral-dark bg-white rounded"></div>
                              )}
                            </div>
                          </label>
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => handleItemSelection(service)}
                          >
                            <div className="font-medium  text-md">
                              {service.name}
                            </div>
                            <div className="text-xs customtext-neutral-light mt-1">
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
          <div className="col-span-6 lg:col-span-4 lg:pl-10">            {/* Google Map */}
            <div className="w-full aspect-square  lg:aspect-video bg-gray-200 rounded-lg mb-8 relative overflow-hidden">
              <div id="map" className="w-full h-full"></div>
              {(!map && typeof google === 'undefined') && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2  mx-auto mb-2"></div>
                    <p className="customtext-neutral-light">Cargando Google Maps...</p>
                    <p className="text-xs customtext-neutral-light mt-1">
                      API Key: {Global.get('GMAPS_API_KEY') ? '✓ Configurada' : '✗ No encontrada'}
                    </p>
                  </div>
                </div>
              )}
              {(typeof google !== 'undefined' && !map) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2  mx-auto mb-2"></div>
                    <p className="customtext-neutral-light">Inicializando mapa...</p>
                  </div>
                </div>
              )}
            </div>            
            
            {/* Details Section - Show all selected items */}
            {selectedItems.length > 0 ? (
              <div className="space-y-6">
                {/* Header with count */}
               
                {selectedItems.map((item, itemIndex) => (
                  <div
                    key={item.id}
                    id={`detail-${item.id}`}
                    className="bg-white rounded-lg shadow-sm  py-0 transition-all duration-300"
                  >
                   

                    <h2 className=" tracking-wide customtext-neutral-dark text-base mb-2">Razón social</h2>
                    {item.business_name && (
                      <h3 className="text-2xl font-bold customtext-neutral-dark mb-4">{item.business_name}</h3>
                    )}

                    <div className="flex flex-col mt-6">
                      <div>
                        <div className="flex items-start gap-2 mb-4">
                          <div>
                            <h4 className="font-semibold mb-1">Dirección</h4>
                            <p className="customtext-neutral-light text-lg">{item.address}</p>
                          </div>
                        </div>

                        {parsePhones(item.phones).length > 0 && (
                          <div className="flex items-start gap-2 mb-4">
                            <div>
                              <h4 className="font-semibold mb-1">Teléfono</h4>
                              {parsePhones(item.phones).map((phone, index) => (
                                <p key={index} className="customtext-neutral-light text-lg">{phone}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        {parseEmails(item.emails).length > 0 && (
                          <div className="flex items-start gap-2 mb-4">
                            <div>
                              <h4 className="font-semibold mb-1">Correo Electrónico</h4>
                              {parseEmails(item.emails).map((email, index) => (
                                <p key={index} className="customtext-neutral-light text-lg">{email}</p>
                              ))}
                            </div>
                          </div>
                        )}

                        {item.opening_hours && (
                          <div className="flex items-start gap-2">
                            <div>
                              <h4 className="font-semibold mb-1">Horario de atención</h4>
                              {parseOpenHours(item.opening_hours).map((hour, index) => (
                                <p key={index} className="customtext-neutral-light text-lg">{hour}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sucursales */}
                    {item.branches && item.branches.length > 0 && (
                      <div className="mt-8 p-6 bg-gray-100 rounded-lg">
                        <h3 className="text-2xl font-bold tracking-wide mb-4 flex items-center gap-2">
                          Sucursales
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {item.branches.map((branch, index) => (
                            <div key={index} className="rounded-lg">
                              <h4 className=" text-xl mb-0 customtext-neutral-dark">{branch.name}</h4>

                              <div className="space-y-3">
                                <div className="flex items-start gap-2 mb-3">
                                  <div>
                               
                                    <p className="customtext-neutral-light text-base">{branch.address}</p>
                                  </div>
                                </div>

                                {parsePhones(branch.phones).length > 0 && (
                                  <div className="flex items-start gap-2 mb-3">
                                    <div>
                                      <h4 className="font-bold tracking-wide text-base mb-1">Teléfonos</h4>
                                      {parsePhones(branch.phones).map((phone, phoneIndex) => (
                                        <p key={phoneIndex} className="customtext-neutral-light text-base">{phone}</p>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {parseEmails(branch.emails).length > 0 && (
                                  <div className="flex items-start gap-2 mb-3">
                                    <div>
                                       <h4 className="font-bold tracking-wide text-base mb-1">Correo Electrónico</h4>
                                      {parseEmails(branch.emails).map((email, emailIndex) => (
                                        <p key={emailIndex} className="customtext-neutral-light text-base">{email}</p>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {branch.opening_hours && parseOpenHours(branch.opening_hours).length > 0 && (
                                  <div className="flex items-start gap-2">
                                 
                                    <div>
                                      <h4 className="font-bold tracking-wide text-base mb-1">Horario de atención</h4>
                                      {parseOpenHours(branch.opening_hours).map((hour, hourIndex) => (
                                        <p key={hourIndex} className="customtext-neutral-light text-base">{hour}</p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>)}
                  </div>
                ))}
              </div>) : (
              <div className="bg-white rounded-lg shadow-sm p-6 border text-center">
                <MapPin className="mx-auto mb-4 customtext-neutral-light" size={48} />
                <h3 className="text-lg font-semibold mb-2">¡Descubre nuestros puntos de atención!</h3>
                <p className="customtext-neutral-light mb-4">
                  Selecciona los distribuidores o centros de servicio que te interesen en el panel izquierdo para conocer todos sus detalles.
                </p>
               
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZonesMakita;
