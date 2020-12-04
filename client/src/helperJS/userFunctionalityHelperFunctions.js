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
              console.log(json);
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

export const showDeleteUserButton = (currentUser, username, deleteUser) => {
  if (currentUser === "admin" && username !== "admin" ) {
    return (<img className="deleteUserButton" alt="deleteUserButton" src={`/static/trash.png`} onClick={() => {deleteUser(username)}} title="Delete User"/>);
  }
  return;
};