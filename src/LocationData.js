
class LocationData {
    constructor() {
        this.locations = [];
    }

    addLocation(name, venueType, lat, lng) { 
        this.locations.push({
            id: this.locations.length,
            name: name,
            venueType: venueType,
            geoLoc: {
                id: this.locations.length,
                lat: lat,
                lng: lng
            },
            avgRating: 0,
            numRatings: 0,
            imagePath:`${process.env.PUBLIC_URL}/assets/images/venue_${this.locations.length}.jpg`
        });
    };

    getLoc(id) {
        return this.locations[id];
    }

    getGeoLocData() {
        return this.locations.map((loc) => {return loc.geoLoc});
    }
}

export default LocationData;