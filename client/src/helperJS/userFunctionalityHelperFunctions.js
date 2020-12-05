export const showDeleteButton = (app, isAdmin, currentUser, username, locId ,reviewId) => {
  if (isAdmin || currentUser === username) {
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

export const showDeleteUserButton = (app, isAdmin, username) => {
  if (isAdmin && username !== "admin" ) {
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

const toggleAdmin = (app, makeAdmin, currentUser, username) => {
  const requestMakeAdmin = new Request(`/api/makeAdmin/${username}`, {
    method: "PATCH",
    body: JSON.stringify({
      bool: makeAdmin
    }),
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
    }
  });
  // Send the request with fetch()
  fetch(requestMakeAdmin)
      .then((res) => {
          if (res.status === 200) {
              return res.json();
          }
      })
      .then((json) => {
        if (json.isAdmin) {
          alert(`${username} is now an administrator.`);
          app.props.history.push(`/`);
          app.props.history.push(`/usr/${username}`);
          return;
        } 
        if (currentUser === username) {
          alert(`You are no longer an administrator. You will be logged out for changes to take affect.`);
          const url = "/users/logout";

          fetch(url)
              .then(res => {
                  app.setState({
                      currentUser: null,
                      message: { type: "", body: "" }
                  });
                  app.props.history.push('/');
              })
              .catch(error => {
                  console.log(error);
              });
        } else {
          alert(`${username} is no longer an administrator.`);
        }
        app.props.history.push(`/`);
        app.props.history.push(`/usr/${username}`);
      })
      .catch((error) => {
          alert(`Could not make ${username} an administrator. Reason: Error.`);
          console.log(error);
      });
};

export const showAdminButton = (app, isAdmin, currentUser, username) => {
  if (isAdmin && username !== "admin") {
    return (<img className="makeAdminButton" alt="makeAdminButton" src={`/static/admin.png`} onClick={() => {
      fetch(`/api/isAdmin/${username}`)
          .then((res) => {
              if (res.status === 200) {
                  return res.json();
              }
          })
          .then((json) => {
              if (!json.isAdmin) {
                if (window.confirm(`Are you sure you want to make ${username} an administrator?`)) {
                  toggleAdmin(app, true, currentUser, username);
                }
              } else {
                if (window.confirm(`${username} is already an administrator. Do you want to make them a regular user?`)) {
                  toggleAdmin(app, false, currentUser, username);
                }
              }
          })
          .catch((error) => {
              alert(`Could not make ${username} an administrator.\n Reason: Error.`);
              console.log(error);
          });
    }} title="Delete User"/>);
  }
  return;
};