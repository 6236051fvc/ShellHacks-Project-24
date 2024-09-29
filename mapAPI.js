function initMap() {
    // Create a map object
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 25.7617, lng: -80.1918 }, // Center map at Miami
        zoom: 12, // Set zoom level
    });

    // Optional: Add a marker
    const marker = new google.maps.Marker({
        position: { lat: 25.7617, lng: -80.1918 }, // Position for the marker
        map: map, // Bind the marker to the map
        title: "Hello Miami!", // Title of the marker
    });
}

// Ensure initMap is called when the page loads
window.onload = initMap;
