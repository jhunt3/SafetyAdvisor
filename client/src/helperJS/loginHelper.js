// Functions to help with user actions. These functions are
// from https://github.com/csc309-fall-2020/react-express-authentication/blob/master/client/src/actions/user.js

// Send a request to check if a user is logged in through the session cookie
export const checkSession = (app) => {
    const url = "/users/check-session";

    fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }
        })
        .then(json => {
            if (json && json.currentUser) {
                app.setState({ currentUser: json.currentUser });
            }
        })
        .catch(error => {
            console.log(error);
        });
};

// A function to send a GET request to logout the current user
export const logout = (app) => {
    if (window.confirm("Are you sure you want to log out?")) {
        const url = "/users/logout";

        fetch(url)
            .then(res => {
                app.setState({
                    currentUser: null,
                    message: { type: "", body: "" }
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
};