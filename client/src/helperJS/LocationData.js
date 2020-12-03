const defaultTags = ["Curbside Pickup", "Hand Sanitizer", "Masks", "Gloves", "Checks Temperature", "Patio"];

export const getLocations = (app) => {
    // Since this is a GET request, simply call fetch on the URL
    fetch('/api/locationData')
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get locations");
            }
        })
        .then((json) => {
            // the resolved promise with the JSON body
            const locData = new LocationData();
            locData.locations = json;
            app.setState({ locData: locData });
        })
        .catch(error => {
            console.log(error);
        });
};

export class LocationData {
    constructor() {
        this.locations = [];
    }

    getLoc(id) {
        return this.locations.find((obj) => {return obj._id === id});
    }

    addLocation(name, venueType, lat, lng) {
        // Create our request constructor with all the parameters we need
        const request = new Request('/api/locations', {
        method: "post",
        body: JSON.stringify({
            name: name,
            venueType: venueType,
            lat: lat,
            lng: lng,
            tags: defaultTags.map((tagName) => {return {tag: tagName, val: 0}})
        }),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
            }
        });

        // Send the request with fetch()
        fetch(request)
            .then(function (res) {
                // Handle response we get from the API.
                // Usually check the error codes to see what happened.
                if (res.status === 200) {
                    // If a location was added successfully, tell the user.
                    alert("Success: Added a location.");
                } else {
                    // If server couldn't add the location, tell the user..
                    alert("Error: Could not add location.");
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    addReview(id, username, rating, review){
        this.getLoc(id).reviews.push({
            username: username,
            rating: rating,
            imagePath: `/static/profile.png`,
            reviewId: this.reviewId,
            review: review
        })
        this.reviewId++;
        this.getLoc(id).avgRating = ((this.getLoc(id).numRatings === 0) ? rating :
            (this.getLoc(id).avgRating * this.getLoc(id).numRatings + rating ) / (this.getLoc(id).numRatings + 1));
        this.getLoc(id).numRatings = this.getLoc(id).numRatings + 1
    }

    removeReview(locationId, reviewId) {
        this.locations[locationId].reviews = this.locations[locationId].reviews.filter((review) => {return review.reviewId !== reviewId});
        return this;
    }

    updateTagVal(id, tagName, newVal) {
        const ind = this.getLoc(id).tags.findIndex((val) => {return val.name === tagName});
        if (ind !== -1) {
            this.getLoc(id).tags[ind].val = newVal;
        }
    }

    updateTags(id, tagValMaps) {
        for (let map of tagValMaps) {
            this.updateTagVal(id, map.name, map.val);
        }
    }

    getTags(id) {
        this.getLoc(id).tags.filter((tag) => {return tag.val !== 0});
    }

    getGeoLoc(id) {
        const target = this.getLoc(id);
        return {
            name: target.name,
            _id: id,
            rating: target.avgRating,
            lat: target.lat,
            lng: target.lng,
            tags: target.tags
        };
    }

    getGeoLocData() {
        return this.locations.map((loc) => {return this.getGeoLoc(loc._id)});
    }

    getLocationsWithQuery(query) {
        const targets = [];
        for (const loc of this.locations) {
            const locationNameLowercase = loc.name.toLowerCase();
            if (locationNameLowercase.includes(query.toLowerCase())) {
                targets.push(loc);
            }
        }
        return targets;
    }
}

export default LocationData;