let map;
let directionsService;
let directionsRenderer;

// Array of FIU parking garages with capacity and location details
const parkingLots = [
    { id: 1, name: "PG1 (Gold Garage)", capacity: 500, available: 200, location: { lat: 25.754854, lng: -80.372082 } },
    { id: 2, name: "PG2 (Blue Garage)", capacity: 600, available: 100, location: { lat: 25.753883, lng: -80.372066 } },
    { id: 3, name: "PG3 (Panther Parking)", capacity: 700, available: 300, location: { lat: 25.758448, lng: -80.379823 } },
    { id: 4, name: "PG4 (Red Garage)", capacity: 400, available: 50, location: { lat: 25.760168, lng: -80.373150 } },
    { id: 5, name: "PG5 (Market Station)", capacity: 350, available: 150, location: { lat: 25.760125, lng: -80.371642 } },
    { id: 6, name: "PG6 (Tech Station)", capacity: 800, available: 400, location: { lat: 25.760144, lng: -80.374555 } }
];

// List of FIU building destinations and their coordinates
const buildingLocations = {
    "Ryder Business Building": { lat: 25.758064, lng: -80.374771 },
    "Green Library": { lat: 25.756906, lng: -80.373895 },
    "Science Complex": { lat: 25.756682, lng: -80.372915 },
    "Engineering Center": { lat: 25.768388, lng: -80.366553 },
    "Graham Center": { lat: 25.757067, lng: -80.373644 },
    "Health and Life Sciences Building": { lat: 25.756507, lng: -80.372119 },
    "Academic Health Center": { lat: 25.757547, lng: -80.371284 },
    "MANGO Building": { lat: 25.7574, lng: -80.3770 }
};

function initMap() {
    // Create a map centered at FIU
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 25.756, lng: -80.373 },
        zoom: 15
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Populate the building dropdown menu
    const buildingDropdown = document.getElementById("building-dropdown");
    for (const building in buildingLocations) {
        const option = document.createElement("option");
        option.value = building;
        option.textContent = building;
        buildingDropdown.appendChild(option);
    }
}

function findParking() {
    const buildingDropdown = document.getElementById("building-dropdown");
    const selectedBuilding = buildingDropdown.value;
    if (!selectedBuilding) {
        alert("Please select your building destination.");
        return;
    }

    const buildingLocation = buildingLocations[selectedBuilding];
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ''; // Clear previous results

    // Calculate distances manually between each parking lot and the destination
    const sortedLots = parkingLots.map(lot => {
        const distance = calculateDistance(lot.location, buildingLocation);
        return {
            lot: lot,
            distance: distance // Get distance in meters
        };
    }).sort((a, b) => a.distance - b.distance); // Sort by distance

    // Display the parking garages with available spots
    sortedLots.forEach(({ lot, distance }) => {
        if (lot.available > 0) {
            const distanceInKm = (distance / 1000).toFixed(2);
            const resultItem = document.createElement('div');
            resultItem.innerHTML = `
                <h3>${lot.name}</h3>
                <p>Available Spots: ${lot.available}</p>
                <p>Distance to Destination: ${distanceInKm} km</p>
                <button class="get-directions-btn" onclick="showDirections(${lot.location.lat}, ${lot.location.lng}, ${buildingLocation.lat}, ${buildingLocation.lng})">Get Directions</button>
            `;
            resultsContainer.appendChild(resultItem);
        }
    });
}

// Function to calculate distance between two coordinates using the Haversine formula
function calculateDistance(coord1, coord2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = coord1.lat * Math.PI/180; // φ, λ in radians
    const φ2 = coord2.lat * Math.PI/180;
    const Δφ = (coord2.lat - coord1.lat) * Math.PI/180;
    const Δλ = (coord2.lng - coord1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const distance = R * c; // in meters
    return distance;
}

function showDirections(parkingLat, parkingLng, destLat, destLng) {
    const start = new google.maps.LatLng(parkingLat, parkingLng);
    const end = new google.maps.LatLng(destLat, destLng);

    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.WALKING
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
            } else {
                alert("Could not display directions due to: " + status);
            }
        }
    );
}

// Ensure initMap is called when the page loads
window.onload = initMap;
