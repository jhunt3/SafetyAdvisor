# SafetyAdvisor: COVID-19 Venue Rating App

## Getting Started

To run our application, please execute the following commands in terminal:

    git clone https://github.com/csc309-fall-2020/team28.git
    cd team28
    npm install
    npm start

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
- logout (by clicking "Logout" on the upper right handside)

## Third Party Packages Used

- google-maps-react
- react-star-ratings
- react-star-rating-component
