let map;
let directionsService;
let directionsRenderer;

// Array of parking lots with capacity and location details
const parkingLots = [
    { id: 1, name: "Garage 1", capacity: 100, available: 50, location: { lat: 25.756, lng: -80.374 } },
    { id: 2, name: "Garage 2", capacity: 120, available: 10, location: { lat: 25.758, lng: -80.376 } },
    { id: 3, name: "Garage 3", capacity: 80, available: 30, location: { lat: 25.760, lng: -80.377 } }
];

function initMap() {
    // Create a map centered at FIU
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 25.756, lng: -80.374 },
        zoom: 15
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

function findParking() {
    const destination = document.getElementById("destination-input").value;
    if (!destination) {
        alert("Please enter your building destination.");
        return;
    }

    // Assume all building locations are hardcoded; you may want to replace this with a dynamic API call
    const buildingLocations = {
        "library": { lat: 25.759, lng: -80.374 },
        "engineering": { lat: 25.757, lng: -80.372 },
        "science": { lat: 25.760, lng: -80.375 }
    };

    if (!(destination.toLowerCase() in buildingLocations)) {
        alert("Building not found. Try 'library', 'engineering', or 'science'.");
        return;
    }

    const buildingLocation = buildingLocations[destination.toLowerCase()];
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ''; // Clear previous results

    // Calculate distance to each parking lot and recommend the best options
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: parkingLots.map(lot => lot.location),
            destinations: [buildingLocation],
            travelMode: google.maps.TravelMode.DRIVING
        },
        (response, status) => {
            if (status === "OK") {
                const distances = response.rows;
                const sortedLots = distances.map((row, index) => {
                    return {
                        lot: parkingLots[index],
                        distance: row.elements[0].distance.value // Get distance in meters
                    };
                }).sort((a, b) => a.distance - b.distance); // Sort by distance

                // Display the top 3 closest parking garages with available spots
                sortedLots.forEach(({ lot, distance }) => {
                    if (lot.available > 0) {
                        const distanceInKm = (distance / 1000).toFixed(2);
                        const resultItem = document.createElement('div');
                        resultItem.innerHTML = `
                            <h3>${lot.name}</h3>
                            <p>Available Spots: ${lot.available}</p>
                            <p>Distance to destination: ${distanceInKm} km</p>
                            <button onclick="showDirections(${lot.location.lat}, ${lot.location.lng}, ${buildingLocation.lat}, ${buildingLocation.lng})">Get Directions</button>
                        `;
                        resultsContainer.appendChild(resultItem);
                    }
                });
            }
        }
    );
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
