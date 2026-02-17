// Global variable to store all markers so they can be removed later
let markers = [];
let mapInstance;

// Function to initialize and display the map
function initMap() {
    // 1. Get the restaurant data from the hidden HTML element
    const dataElement = document.getElementById('restaurant-data');
    if (!dataElement) return;

    let restaurantData = [];
    try {
        // Parse the JSON data sent from Flask (only the filtered list)
        restaurantData = JSON.parse(dataElement.textContent.trim()); // .trim() added for safety
    } catch (e) {
        console.error("Error parsing restaurant data:", e);
        return;
    }

    // 2. Center the map based on the filtered data, or use Pune's center if empty
    let centerCoords = { lat: 18.5204, lng: 73.8567 }; // Default Pune Center

    if (restaurantData.length > 0) {
        // Center the map on the first restaurant in the list
        centerCoords = { lat: restaurantData[0].lat, lng: restaurantData[0].lng };
    }

    // 3. Initialize Map (only if it hasn't been initialized before)
    if (!mapInstance) {
        mapInstance = new google.maps.Map(document.getElementById("map-container"), {
            zoom: 12, // Initial zoom level
            center: centerCoords,
        });
    } else {
        // If map exists, just re-center it
        mapInstance.setCenter(centerCoords);
    }
    
    // 4. Clear all previous markers from the map (KEY FOR SYNCHRONIZATION)
    markers.forEach(marker => marker.setMap(null));
    markers = []; // Clear the markers array

    // 5. Loop through the *filtered* data and place new markers
    restaurantData.forEach(restaurant => {
        const marker = new google.maps.Marker({
            position: { lat: restaurant.lat, lng: restaurant.lng },
            map: mapInstance, // Use the stored map instance
            title: restaurant.name,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h3>${restaurant.name}</h3>
                    <p>⭐ Rating: ${restaurant.rating}</p>
                    <p>Cuisine: ${restaurant.cuisine}</p>
                    <p>Location: ${restaurant.location}</p>
                </div>
            `,
        });

        marker.addListener("click", () => {
            infoWindow.open(mapInstance, marker);
        });

        // Store the new marker
        markers.push(marker);
    });
    
    // Zoom adjust for better viewing
    if (restaurantData.length === 1) {
        mapInstance.setZoom(14);
    } else if (restaurantData.length === 0) {
        mapInstance.setCenter({ lat: 18.5204, lng: 73.8567 });
        mapInstance.setZoom(12);
    }
}

// Function to ensure map loads when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if Google Maps API is ready
    if (window.google && window.google.maps) {
        initMap();
    } else {
        // If not ready, wait for the window to load (API callback)
        window.initMap = initMap;
    }
});