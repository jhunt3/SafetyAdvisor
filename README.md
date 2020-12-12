# SafetyAdvisor: COVID-19 Venue Rating App

## Getting Started

To run our application using the source code, please execute the following commands in terminal:

    git clone https://github.com/csc309-fall-2020/team28.git
    cd team28
    npm install
    cd client
    npm install
    npm run build
    cd ..
    npm start

Alternatively, visit our app online at https://safetyadvisor.herokuapp.com/.

## User Features

When first launching the app, users can:

- understand the average rating of venues that have been reviewed from the color of each marker
- see a summary of the amenities offered at each venue by hovering over each marker
- click on venue markers to see all reviews for that location
- click on usernames to see all reviews for that user
- search by venue name by clicking "Search" on the upper right handside (the markers corresponding to search results are displayed larger than the other marker on the map)
- sign up for an account by choosing a username and password

Login by clicking "Register/Login" on the upper right handside, "Login", and enter the following credentials:

    Username: user
    Password: user

(or login with account credentials of your own choosing)

When logged in, users can:

- submit new reviews (click "+Review" on venue page)
- delete their past reviews (on the venue page or on their own user page)
- change their profile picture (by navigating to their page and clicking "Change Photo")
- logout (by clicking "Logout" on the upper right handside)

## Administrator Features

Login by clicking "Register/Login" on the upper right handside, "Login", and enter the following credentials:

    Username: admin
    Password: admin

When logged in, administrators can:

- give normal users admin status (click the crown above the reviews on the user's page)
- take away admin status (click the crown again)
- submit new reviews (click "+Review" on venue page)
- add new locations (click "Add Location" on the bottom right, fill in the venue information, and click a point on the map to provide the location's coordinates)
- change the profile picture for any user
- change the picture for any location

- delete the past reviews of any user on the site
- delete any user (except for "admin") by navigating to their page and clicking the trashcan under the crown
- delete any location by clicking the trashcan next to the location name

- logout (by clicking "Logout" on the upper right)

## API Routes

POST /api/users
- used for signing users up for an account
- expects object
```javascript
{"user": "example", "pass": "1234"}
```
- returns object
```javascript
{    
    "currentUser": "example"
}
```


DELETE /api/deleteUser/:id
- used for deleting the user with the given username
- returns default DELETE response

GET /api/locationData
- gets all data required by the app for each location
- no request parameters
- returns list of objects each with a location's data, e.g.
[
{    "_id":"5fc96a89f64848aba8edb448",
    "name":"Sidney Smith",
    "venueType":"Lecture Hall",
    "lat":43.663098,
    "lng":-79.398568,
    "avgRating":2,
    "numRatings":3,
    "tags":[
        {"_id":"5fd3d12ee5b3efc774333045","tag":"Mask","val":1},
        {"_id":"5fd3d12fe5b3efc774333046","tag":"Gloves","val":1}
    ],
    "imagePath":"/static/venue_0.jpg",
    "__v":0
},...
]

GET /api/loc/:id
- finds location object by unique ID
- expects object {"id": "example"}
- returns location object as shown above

POST /api/locations
- posts a new location to the locations collections
- expects object {
                    "name": "example-name",
                    "venueType": "example-venueType",
                    "lat": example-lat,
                    "lng": example-lng,
                    "avgRating": example-avgRating,
                    "numRatings": example-numRatings,
                    "tags": "example-tags",
                    "imagePath": "example-imagePath"
                 }
- returns save object                 

DELETE /api/deleteLocation/:id
- used for deleting a location by id
- returns default DELETE response

GET /api/loc/:id/reviewData
- gets the review data of a location identified by ID
- expects object {"id": "example-location-id"}

POST /api/loc/:id/addReview
- posts review to a specified location by ID
- expects object {
                    "username": "example-username",
                    "locId": "example-locId",
                    "rating": example-rating,
                    "locImagePath": "example-locImagePath",
                    "usrImagePath": "example-usrImagePath",
                    "tags": "example-tags",
                    "review": "example-review"
                 }

PATCH /api/loc/:id
- used for updating average review
- expects object: {"avgRating": 1, "numRatings": 0,
"tags": [{"tag": "Curbside Pickup", "val": 1}, {"tag": "Hand Sanitizer", "val": 1}, {"tag": "Masks", "val": 1}, {"tag": "Gloves", "val": 1}, {"tag": "Checks Temperature", "val": 1}, {"tag": "Patio", "val": 1}]}
- note: it's important to pass the counts of 6 default tags
- returns default PATCH response

DELETE /api/deleteReview/:id
- used for deleting the review with the given id
- returns default DELETE response

DELETE /api/deleteAllReviews/:id
- used for deleting all reviews for the user with the given id
- returns default DELETE response

DELETE /api/deleteLocReviews/:id
- used for deleting all reviews associated with a specific location with the given id
- returns default DELETE response

GET /api/usr/:id/reviewData
- used for retrieving all user reviews given username in url (e.g., GET /api/usr/user/reviewData)
- returns array of Reviews

GET /images/:refId
- used for returning cloudinary image path given reference_id
- returns object: {
    "image": {
        "_id": "5fd400268b1cb1b7c1911c0e",
        "reference_id": "5fd3f344c54d2e486d7a35c4",
        "__v": 0,
        "created_at": "Fri Dec 11 2020 18:26:31 GMT-0500 (Eastern Standard Time)",
        "image_id": "p1mipkdcuyreezj3xfy3",
        "image_url": "http://res.cloudinary.com/csc309team28/image/upload/v1607729190/p1mipkdcuyreezj3xfy3.jpg"
    }
}


## Third Party Packages Used

- google-maps-react
- react-star-ratings
- react-star-rating-component
