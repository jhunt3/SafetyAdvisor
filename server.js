/* server.js for react-express-authentication */
"use strict";
const log = console.log;

const express = require("express");
// starting the express server
const app = express();
const path = require('path')

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set('useFindAndModify', false); // for some deprecation issues

// import the mongoose models
const { Location } = require("./models/location");
const { User } = require("./models/user");
const { Review } = require("./models/review");

// to validate object IDs
const { ObjectID } = require("mongodb");

// For static assets
app.use('/static', express.static('client/public/assets/images'))

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// express-session for managing user sessions
const session = require("express-session");
const e = require("express");
app.use(bodyParser.urlencoded({ extended: true }));

function isMongoError(error) { // checks for first error returned by promise rejection if Mongo database suddently disconnects
    return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
}

// middleware for mongo connection error for routes that need it
const mongoChecker = (req, res, next) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log('Issue with mongoose connection')
        res.status(500).send('Internal server error')
        return;
    } else {
        next()
    }
}

// Middleware for authentication of resources
const authenticate = (req, res, next) => {
    if (req.session.user) {
        User.findById(req.session.user).then((user) => {
            if (!user) {
                return Promise.reject()
            } else {
                req.user = user
                next()
            }
        }).catch((error) => {
            res.status(401).send("Unauthorized")
        })
    } else {
        res.status(401).send("Unauthorized")
    }
}


/*** Session handling **************************************/
// Create a session and session cookie
app.use(
    session({
        secret: "our hardcoded secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60000,
            httpOnly: true
        }
    })
);

// A route to login and create a session
app.post("/users/login", (req, res) => {
    const username = req.body.user;
    const password = req.body.pass;

    // log(email, password);
    // Use the static method on the User model to find a user
    // by their email and password
    User.findByUsernamePassword(username, password)
        .then(user => {
            // Add the user's id to the session.
            // We can check later if this exists to ensure we are logged in.
            req.session.user = user._id;
            req.session.username = user.username;
            res.send({ currentUser: user.username });
        })
        .catch((error) => {
            res.status(400).send(error)
        });
});

// A route to logout a user
app.get("/users/logout", (req, res) => {
    // Remove the session
    req.session.destroy(error => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send()
        }
    });
});

// A route to check if a user is logged in on the session
app.get("/users/check-session", (req, res) => {
    if (req.session.user) {
        res.send({ currentUser: req.session.username });
    } else {
        res.status(401).send();
    }
});

/*********************************************************/

/*** API Routes below ************************************/
// User API Route
app.post('/api/users', mongoChecker, async (req, res) => {
    const query = await Location.findOne({username: req.body.user});
    if (query) {
        res.status(400).send('User Exists');
    } else {
        log(req.body)
        // Create a new user
        const user = new User({
            username: req.body.user,
            password: req.body.pass
        })

        try {
            // Save the user
            const newUser = await user.save();
            res.send({ currentUser: req.body.user });
        } catch (error) {
            if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
                res.status(500).send('Internal server error');
            } else {
                log(error)
                res.status(400).send('Bad Request') // bad request for changing the student.
            }
        }
    }
})


// A route get all location data
app.get("/api/locationData", mongoChecker, async (req, res) => {
    // Get the locationData
    try {
        const locationData = await Location.find()
        res.send(locationData)
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }

})

// A route to create a location
app.post('/api/locations', mongoChecker, async (req, res) => {
    log(req.body)

    // Create a new location
    const loc = new Location({
        name: req.body.name,
        venueType: req.body.venueType,
        lat: req.body.lat,
        lng: req.body.lng,
        avgRating: req.body.avgRating,
        numRatings: req.body.numRatings,
        tags: req.body.tags,
        imagePath:`/static/placeholder.jpg`
    })

    try {
        // Save the location
        const newLoc = await loc.save()
        res.send(newLoc)
    } catch (error) {
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            log(error)
            res.status(400).send('Bad Request') // bad request for changing the student.
        }
    }
})

// A route get review data for a location
app.get("/api/loc/:id/reviewData", mongoChecker, async (req, res) => {
    // Get the locationData
    try {
        const reviewData = await Review.find({ locId: req.params.id });
        res.send(reviewData);
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// A route to add a review for a location
app.post("/api/loc/:id/addReview", mongoChecker, async (req, res) => {
    log(req.body)

    // Create a new location
    const review = new Review({
        username: req.body.currentUser,
    	locId: req.params.id,
    	rating: req.body.rating,
        locImagePath: req.body.locImagePath,
        usrImagePath: req.body.usrImagePath,
    	review: req.body.review
    })

    console.log(review);

    try {
        const newReview = await review.save()
        res.send(newReview)
    } catch (error) {
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            log(error)
            res.status(400).send('Bad Request') // bad request for changing the student.
        }
    }

})

// A route to delete a review
app.delete("/api/deleteReview/:id", mongoChecker, async (req, res) => {
    try {
        const deleteReview = await Review.deleteOne({ _id: req.params.id });
        res.send(deleteReview);
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
})

// A route get review data for a user
app.get("/api/usr/:id/reviewData", mongoChecker, async (req, res) => {
    // Get the locationData
    try {
        const reviewData = await Review.find({ username: req.params.id });
        res.send(reviewData);
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }

})

/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(path.join(__dirname, "/client/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
    // check for page routes that we expect in the frontend to provide correct status code.
    const goodPageRoutes = ["/", "/login", "/dashboard"];
    if (!goodPageRoutes.includes(req.url)) {
        // if url not in expected page routes, set status to 404.
        res.status(404);
    }

    // send index.html
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000;
app.listen(port, () => {
    log(`Listening on port ${port}...`);
});
