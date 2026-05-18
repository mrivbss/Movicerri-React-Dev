import { useEffect, useRef } from 'react';

function MapContainer() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Esto se ejecuta cuando el componente se monta en la pantalla
    if (window.google && mapRef.current) {
      // Aquí es donde calzamos tu configuración antigua del mapa
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -33.4975, lng: -70.7042 }, // Coordenadas aproximadas de Cerrillos
        zoom: 14,
        disableDefaultUI: false,
      });

      // TODO: Aquí vamos a meter los marcadores o funciones de tu script.js viejo
    }
  }, []);

  return (
    <div className="map-wrapper">
      {/* Este div reemplaza al viejo <div id="map"></div> */}
      <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '500px' }} />
    </div>
  );
}

export default MapContainer;