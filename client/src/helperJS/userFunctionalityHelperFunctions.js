export const showDeleteButton = (currentUser, username, locId, reviewId, deleteReview) => {
  if (currentUser === "admin" || currentUser === username) {
    return (<img className="deleteButton" alt="deleteButton" src={`/static/trash.png`} onClick={() => {deleteReview(username, locId, reviewId)}} title="Delete Review"/>);
  }
  return;
};

export const showDeleteUserButton = (currentUser, username, deleteUser) => {
  if (currentUser === "admin" && username !== "admin" ) {
    return (<img className="deleteUserButton" alt="deleteUserButton" src={`/static/trash.png`} onClick={() => {deleteUser(username)}} title="Delete User"/>);
  }
  return;
};