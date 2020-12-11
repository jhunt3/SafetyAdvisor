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
const { Image } = require("./models/image");

// to validate object IDs
const { ObjectID } = require("mongodb");

// For static assets
app.use('/static', express.static('client/public/assets/images'))

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// express-session for managing user sessions
const session = require("express-session");

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'csc309team28',
    api_key: '955476213153433',
    api_secret: '8oo_dXyCeKmw7UAfFD7H8VCtGbw'
});

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

/*** Session handling **************************************/
// Create a session and session cookie
app.use(
    session({
        secret: "our hardcoded secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
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
            req.session.isAdmin = user.isAdmin;
            res.send({
                currentUser: user.username,
                isAdmin: user.isAdmin
             });
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
        res.send({
            currentUser: req.session.username,
            isAdmin: req.session.isAdmin
         });
    } else {
        res.status(401).send();
    }
});

app.get('/api/isAdmin/:id', mongoChecker, async (req, res) => {
    // Remove the session
    try {
        const userData = await User.findOne({username: req.params.id});
        if (userData && userData.isAdmin) {
            res.send({ isAdmin: true });
        } else {
            res.send({ isAdmin: false });
        }
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
    }
});


app.patch('/api/makeAdmin/:id', mongoChecker, async (req, res) => {
	try {
		const user = await User.findOneAndUpdate({username: req.params.id}, {$set: {isAdmin: req.body.bool}}, {new: true, useFindAndModify: false});
		if (!user) {
			res.status(404).send('Resource not found');
		} else {
			res.send(user)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request
		}
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
            password: req.body.pass,
            isAdmin: false
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

// A route to delete a user
app.delete("/api/deleteUser/:id", mongoChecker, async (req, res) => {
    try {
        const deleteUser = await User.deleteOne({ username: req.params.id });
        res.send(deleteUser);
    } catch(error) {
        log(error)
        res.status(500).send("Internal Server Error")
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

// A route get all location data
app.get("/api/loc/:id", mongoChecker, async (req, res) => {
    const id = req.params.id

    // validate id immediately
	if (!ObjectID.isValid(id)) {
		res.status(404).send('Invalid ID')  // if invalid, definitely can't find resource, so return 404
		return;  // don't run the rest of the handler
	}

    // check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	// if id is valid, get restaurant by id
	try {
		const location = await Location.findById(id)
		if (!location) {
			res.status(404).send('Resource not found')  // could not find the restaurant
		} else {
            console.log(location)
			res.send(location)
		}
	} catch(error) {
		log(error)
		res.status(500).send('Internal server error')
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
        tags: req.body.tags,
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

// A route to delete all reviews by a user
app.delete("/api/deleteAllReviews/:id", mongoChecker, async (req, res) => {
    try {
        const deleteReviews = await Review.deleteMany({ username: req.params.id });
        res.send(deleteReviews);
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

// a POST route to *create* an image
app.post("/images", multipartMiddleware, (req, res) => {
    log(req.body);
    // Use uploader.upload API to upload image to cloudinary server.
    cloudinary.uploader.upload(
        req.files.image.path,
        function (result) {
            // Replace the one from before if found, otherwise just insert normally
            Image.findOneAndUpdate(
                { "reference_id" :  req.body.referenceId },
                { $set: { "image_id" : result.public_id, "image_url": result.url, "reference_id": req.body.referenceId, "created_at": new Date()}},
                { upsert: true }
             ).then(
                saveRes => {
                    res.send({ url: result.url });
                },
                error => {
                    res.status(400).send(error);
                }
            );
        });
});

app.get("/images/:refId", (req, res) => {
    const refId = req.params.refId;
    Image.findOne({ reference_id: refId }).then(
        image => {
            res.send({ image }); // can wrap in object if want to add more properties
        },
        error => {
            res.status(500).send(error); // server error
        }
    );
});

app.patch('/api/reviews/:type/:id', mongoChecker, async (req, res) => {
	try {
    let reviews;
    if (req.params.type === 'usr') {
		    reviews = await Review.updateMany({username: req.params.id}, {usrImagePath: req.body.imagePath});
    } else {
        reviews = await Review.updateMany({locId: req.params.id}, {locImagePath: req.body.imagePath});
    }
		if (!reviews) {
			res.status(404).send('Resource not found');
		} else {
			res.send(reviews)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request
		}
	}
});

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
