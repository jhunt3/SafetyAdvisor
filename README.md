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

- search by venue name by clicking "Search" on the upper right handside
- understand the average rating of venues that have been reviewed from the color of each marker
- see a summary of the amenities offered at each venue by hovering over each marker
- click on venue markers to see all reviews for that location
- click on usernames to see all reviews for that user

Login by clicking "Register/Login" on the upper right handside, "Login", and enter the following credentials:

    Username: user
    Password: user

When logged in, users can:

- delete their past reviews (on the venue page or on their own user page)
- submit new reviews (click "+Review" on venue pages)
- logout (by clicking "Logout" on the upper right handside)

## Administrator Features

Login by clicking "Register/Login" on the upper right handside, "Login", and enter the following credentials:

    Username: admin
    Password: admin

When logged in, administrators can:

- delete the past reviews of any user on the site
- delete any user (except for "admin") by clicking the trashcan on the bottom left handside of each user page
- logout (by clicking "Logout" on the upper right handside)

## API Routes

POST /api/users
- used for signing users up for an account
- expects object {"user": "example", "pass": "1234"}
- returns object
{    
    "currentUser": "example"
}

DELETE /api/deleteUser/:id
- deletes a user based on their userID
- expects object {"id": "userID"}
- if succesful return request object

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
- deletes a location object from the locations collection by ID
- expects object {"id": "example-location-id"}

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

DELETE /api/deleteReview/:id

DELETE /api/delete/AllReviews/:id

DELETE /api/deleteLocReviews/:id

GET /api/usr/:id/reviewData

POST /images

GET /images/:refId

PATCH /api/reviews/:type/:id

## Third Party Packages Used

- google-maps-react
- react-star-ratings
- react-star-rating-component
