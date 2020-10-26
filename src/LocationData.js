
class LocationData {
    constructor() {
        this.locations = [];
    }

    addLocation(name, venueType, lat, lng, tags) { 
        this.locations.push({
            id: this.locations.length,
            name: name,
            venueType: venueType,
            geoLoc: {
                id: this.locations.length,
                lat: lat,
                lng: lng
            },
            avgRating: 2.5,
            numRatings: 0,
            tags: tags.map((tagName) => {return {name: tagName, val: 0}}),
            imagePath:`${process.env.PUBLIC_URL}/assets/images/venue_${this.locations.length}.jpg`
        });
    };

    updateTagVal(id, tagName ,newVal) {
        const ind = this.locations[id].tags.findIndex((val) => {return val.name === tagName});
        if (ind !== -1) {
            this.locations[id].tags[ind].val = newVal;
        }
    }

    updateTags(id, tagValMaps) {
        for (let map of tagValMaps) {
            this.updateTagVal(id, map.name, map.val);
        }
    }

    getTags(id) {
        this.locations[id].tags.filter((tag) => {return tag.val !== 0});
    }

    getLoc(id) {
        return this.locations[id];
    }

    getGeoLocData() {
        return this.locations.map((loc) => {return loc.geoLoc});
    }
}

export default LocationData;