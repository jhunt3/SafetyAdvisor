export const showDeleteButton = (app, currentUser, username, locId ,reviewId) => {
  if (currentUser === "admin" || currentUser === username) {
    return (<img className="deleteButton" alt="deleteButton" src={`/static/trash.png`} onClick={() => {
      // Send the request with fetch()
      if (window.confirm("Are you sure you want to delete this review?")) {
        const request = new Request(`/api/deleteReview/${reviewId}`, {
          method: "delete",
          headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
          }
        });
        fetch(request)
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                }
            })
            .then((json) => {
              if (json.ok) {
                alert("Review deleted.");
                app.props.history.push(`/`);
                app.props.history.push(`/loc/${locId}`);
              }
            })
            .catch((error) => {
                alert("Review deletion failed.");
                console.log(error);
            });
      }
    }} title="Delete Review"/>);
  }
  return;
};

export const showDeleteUserButton = (app, currentUser, username) => {
  if (currentUser === "admin" && username !== "admin" ) {
    return (<img className="deleteUserButton" alt="deleteUserButton" src={`/static/trash.png`} onClick={() => {
      if (window.confirm("Are you sure you want to delete this user?")) {
        // Send the request with fetch()
        const requestDeleteReviews = new Request(`/api/deleteAllReviews/${username}`, {
          method: "delete",
          headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
          }
        });
        fetch(requestDeleteReviews)
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                }
            })
            .then((json) => {
                if (json.ok) {
                  const requestDeleteUser = new Request(`/api/deleteUser/${username}`, {
                    method: "delete",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    }
                  });
                  // Send the request with fetch()
                  fetch(requestDeleteUser)
                      .then((res) => {
                          if (res.status === 200) {
                              return res.json();
                          }
                      })
                      .then((json) => {
                          if (json.ok) {
                            alert("User deleted.");
                            app.props.history.push(`/`);
                          }
                      })
                      .catch((error) => {
                          alert("User deletion Failed.");
                          console.log(error);
                      });
                }
            })
            .catch((error) => {
                alert("User deletion Failed.");
                console.log(error);
            });
      }
    }} title="Delete User"/>);
  }
  return;
};