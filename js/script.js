document.addEventListener("DOMContentLoaded", function() {
    
    // =========================================================================
    // 1. CARTE 1 : IMPLANTATIONS NATIONALES (Géoterria & APC Ingénierie)
    // =========================================================================
    if (document.getElementById('map')) {
        var coordToulon = [43.125, 6.012]; 
        var coordAix = [43.559, 5.378];    
        var coordToulouse = [43.551, 1.535]; 
        var coordNantes = [47.319, -1.821]; 
        var coordParis = [48.705, 2.332]; 
        
        var map = L.map('map').setView([46.2, 2.2], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        var apcIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        L.marker(coordToulon).addTo(map).bindPopup("<b>GEOTERRIA - Toulon</b><br>Siège social");
        L.marker(coordAix).addTo(map).bindPopup("<b>GEOTERRIA - Aix-en-Provence</b><br>Agence d'Eguilles");
        L.marker(coordToulouse).addTo(map).bindPopup("<b>GEOTERRIA - Toulouse</b><br>Agence Sud-Ouest");

        L.marker(coordNantes, {icon: apcIcon}).addTo(map).bindPopup("<b>APC INGENIERIE - Nantes</b><br>Laboratoire Nord-Ouest");
        L.marker(coordParis, {icon: apcIcon}).addTo(map).bindPopup("<b>APC INGENIERIE - Paris</b><br>Agence Île-de-France");
        
        setTimeout(function() { map.invalidateSize(); }, 200);
    }

    // =========================================================================
    // 2. CARTE 2 : CARTE DES SECTEURS (GRAND SUD) - ZOOM ET CENTRAGE AJUSTÉS
    // =========================================================================
    if (document.getElementById('zone-map')) {
        var zoneMap = L.map('zone-map').setView([43.7, 4.0], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 10,
            attribution: '© OpenStreetMap'
        }).addTo(zoneMap);

        var coordToulon = [43.125, 6.012]; 
        var coordAix = [43.559, 5.378];    
        var coordToulouse = [43.551, 1.535]; 

        var toulouseDepts = ["33", "40", "64", "24", "47", "32", "65", "46", "82", "31", "09", "12", "81", "11", "66"];
        var aixDepts = ["13", "84", "26", "07", "30", "48", "34"];
        var toulonDepts = ["05", "04", "06", "83", "2A", "2B"];

        function styleSecteurs(feature) {
            var codeDept = feature.properties.code;
            
            if (toulouseDepts.includes(codeDept)) {
                return { fillColor: "#ef4444", color: "#ffffff", weight: 1.5, fillOpacity: 0.5 };
            }
            if (aixDepts.includes(codeDept)) {
                return { fillColor: "#3b82f6", color: "#ffffff", weight: 1.5, fillOpacity: 0.5 };
            }
            if (toulonDepts.includes(codeDept)) {
                return { fillColor: "#10b981", color: "#ffffff", weight: 1.5, fillOpacity: 0.5 };
            }
            
            return { fillColor: "#94a3b8", color: "#cbd5e1", weight: 1, fillOpacity: 0.08 };
        }

        fetch('https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements.geojson')
            .then(function(response) {
                if (!response.ok) throw new Error("Erreur réseau");
                return response.json();
            })
            .then(function(data) {
                L.geoJSON(data, {
                    style: styleSecteurs,
                    onEachFeature: function(feature, layer) {
                        var nomDept = feature.properties.nom;
                        var codeDept = feature.properties.code;
                        var rattachement = "Hors zone d'intervention";
                        
                        if (toulouseDepts.includes(codeDept)) rattachement = "Rattaché à l'agence de TOULOUSE";
                        if (aixDepts.includes(codeDept)) rattachement = "Rattaché à l'agence d'AIX-EN-PROVENCE";
                        if (toulonDepts.includes(codeDept)) rattachement = "Rattaché au siège social de TOULON";

                        layer.bindPopup("<b>" + nomDept + " (" + codeDept + ")</b><br>" + rattachement);
                    }
                }).addTo(zoneMap);

                L.circleMarker(coordToulouse, {
                    radius: 8,
                    fillColor: "#b91c1c",
                    color: "#ffffff",
                    weight: 2,
                    fillOpacity: 1
                }).addTo(zoneMap).bindTooltip("<b>Agence Toulouse</b>", {permanent: true, direction: 'top', className: 'map-label'});

                L.circleMarker(coordAix, {
                    radius: 8,
                    fillColor: "#1d4ed8",
                    color: "#ffffff",
                    weight: 2,
                    fillOpacity: 1
                }).addTo(zoneMap).bindTooltip("<b>Agence Aix</b>", {permanent: true, direction: 'top', className: 'map-label'});

                L.circleMarker(coordToulon, {
                    radius: 8,
                    fillColor: "#047857",
                    color: "#ffffff",
                    weight: 2,
                    fillOpacity: 1
                }).addTo(zoneMap).bindTooltip("<b>Siège Toulon</b>", {permanent: true, direction: 'top', className: 'map-label'});

                setTimeout(function() { zoneMap.invalidateSize(); }, 300);
            })
            .catch(function(err) {
                console.error("Erreur GeoJSON : ", err);
            });
            
        setTimeout(function() { zoneMap.invalidateSize(); }, 200);
    }
});