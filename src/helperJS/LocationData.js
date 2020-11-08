

class LocationData {
    constructor() {
        this.reviewId = 0;
        this.locations = [];
    }

    addLocation(name, venueType, lat, lng, tags) {
        this.locations.push({
            id: this.locations.length,
            name: name,
            venueType: venueType,
            lat: lat,
            lng: lng,
            avgRating: 2.5,
            numRatings: 0,
            tags: tags.map((tagName) => {return {name: tagName, val: 0}}),
            imagePath:`${process.env.PUBLIC_URL}/assets/images/venue_${this.locations.length}.jpg`,
            reviews: []
        });
    };

    addReview(id, username, rating, review){
        this.locations[id].reviews.push({
            username: username,
            rating: rating,
            imagePath: `${process.env.PUBLIC_URL}/assets/images/profile.png`,
            reviewId: this.reviewId,
            review: review
        })
        this.reviewId++;
        this.locations[id].avgRating = ((this.locations[id].numRatings == 0) ? rating :
            (this.locations[id].avgRating * this.locations[id].numRatings + rating ) / (this.locations[id].numRatings + 1));
        this.locations[id].numRatings = this.locations[id].numRatings + 1
    }

    removeReview(locationId, reviewId) {
        this.locations[locationId].reviews = this.locations[locationId].reviews.filter((review) => {return review.reviewId !== reviewId});
        return this;
    }

    updateTagVal(id, tagName, newVal) {
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

    getGeoLoc(id) {
        const target = this.locations[id];
        return {
            name: target.name,
            id: id,
            rating: target.avgRating,
            lat: target.lat,
            lng: target.lng,
            tags: target.tags
        };
    }

    getGeoLocData() {
        return this.locations.map((loc) => {return this.getGeoLoc(loc.id)});
    }

    getLocationsWithQuery(query) {
        const targets = [];
        for (const loc of this.locations) {
            const locationNameLowercase = loc.name.toLowerCase();
            console.log(locationNameLowercase);
            if (locationNameLowercase.includes(query.toLowerCase())) {
                targets.push(loc);
            }
        }
        console.log(targets);
        return targets;
    }
}

export default LocationData;
