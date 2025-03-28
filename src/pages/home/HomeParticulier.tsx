import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import useAuth from '../../contexts/auth';

// Correction des icônes Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Types de dépannage disponibles
const serviceTypes = [
  { id: 'plomberie', name: 'Plomberie' },
  { id: 'electricite', name: 'Électricité' },
  { id: 'serrurerie', name: 'Serrurerie' },
  { id: 'chauffage', name: 'Chauffage' },
  { id: 'menuiserie', name: 'Menuiserie' },
  { id: 'peinture', name: 'Peinture' },
  { id: 'jardinage', name: 'Jardinage' },
  { id: 'autre', name: 'Autre' }
];

// Correction des icônes par défaut de Leaflet
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Composant de localisation de l'utilisateur
const LocationMarker = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Vous êtes ici</Popup>
    </Marker>
  );
};

const HomeParticulier: React.FC = () => {
  const { auth } = useAuth();
  const [selectedService, setSelectedService] = useState<string>('');
  interface Artisan {
    id: number;
    name: string;
    specialite: string;
    lat: number;
    lng: number;
    rating: number;
  }

  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Position initiale de la carte (France)
  const defaultPosition: [number, number] = [46.603354, 1.888334]; 
  
  // Récupérer les artisans disponibles pour le service sélectionné
  useEffect(() => {
    if (!selectedService) return;
    
    setLoading(true);
    
    // Simuler une requête API pour obtenir des artisans
    setTimeout(() => {
      // Ici vous feriez normalement un appel à votre API/Firebase
      // Par exemple: const result = await getDocs(query(collection(db, "users"), where("role", "==", "artisan"), where("specialite", "==", selectedService)));
      
      // Données simulées
      const mockArtisans = [
        { id: 1, name: 'Jean Dupont', specialite: selectedService, lat: 48.8566, lng: 2.3522, rating: 4.8 },
        { id: 2, name: 'Marie Martin', specialite: selectedService, lat: 48.85, lng: 2.34, rating: 4.5 },
        { id: 3, name: 'Pierre Durand', specialite: selectedService, lat: 48.86, lng: 2.36, rating: 4.2 }
      ];
      
      setArtisans(mockArtisans);
      setLoading(false);
    }, 1000);
  }, [selectedService]);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
  };

  const requestService = (artisanId: number) => {
    console.log(`Service requested from artisan ${artisanId} for ${selectedService}`);
    // Ici, vous implémenteriez la logique pour enregistrer une demande de service
  };

  return (
    <div className="home-particulier-container">
      <header className="header">
        <div className="logo">
          <h1>QuickFix</h1>
        </div>
        <div className="user-info">
          <span>Bonjour, {auth.user?.displayName || 'Utilisateur'}</span>
          <button className="profile-button">Mon profil</button>
        </div>
      </header>

      <main className="main-content">
        <div className="service-selection">
          <h2>Quel type de dépannage avez-vous besoin?</h2>
          <select 
            value={selectedService}
            onChange={handleServiceChange}
            className="service-dropdown"
          >
            <option value="">Sélectionnez un service...</option>
            {serviceTypes.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
        </div>

        <div className="map-container">
          <MapContainer 
            center={defaultPosition}
            zoom={5}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            
            {artisans.map(artisan => (
              <Marker 
                key={artisan.id} 
                position={[artisan.lat, artisan.lng]}
              >
                <Popup>
                  <div>
                    <h3>{artisan.name}</h3>
                    <p>Spécialité: {artisan.specialite}</p>
                    <p>Note: {artisan.rating}/5</p>
                    <button 
                      onClick={() => requestService(artisan.id)}
                      className="request-button"
                    >
                      Demander un dépannage
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {loading ? (
          <div className="loading">Recherche des artisans disponibles...</div>
        ) : selectedService && artisans.length > 0 ? (
          <div className="artisans-list">
            <h2>Artisans disponibles pour {selectedService}</h2>
            <div className="artisans-grid">
              {artisans.map(artisan => (
                <div key={artisan.id} className="artisan-card">
                  <h3>{artisan.name}</h3>
                  <div className="rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < Math.floor(artisan.rating) ? "star filled" : "star"}>
                        ★
                      </span>
                    ))}
                    <span className="rating-value">{artisan.rating}</span>
                  </div>
                  <button 
                    onClick={() => requestService(artisan.id)}
                    className="request-button"
                  >
                    Demander un dépannage
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : selectedService ? (
          <div className="no-results">
            Aucun artisan disponible pour ce service dans votre région.
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default HomeParticulier;