export const showDeleteButton = (currentUser, username, locId, reviewId, deleteReview) => {
  if (currentUser === "admin" || currentUser === username) {
    return (<img className="deleteButton" alt="deleteButton" src={`${process.env.PUBLIC_URL}/assets/images/trash.png`} onClick={() => {deleteReview(username, locId, reviewId)}} title="Delete Review"/>);
  }
  return;
};