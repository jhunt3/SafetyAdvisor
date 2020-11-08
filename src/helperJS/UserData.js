
class UserData {
    constructor() {
        this.reviewId = 0;
        this.users = [];
    }

    addUser(username, password) {
        this.users.push({
            uid: this.users.length,
            username: username,
            password: password,
            imagePath: `${process.env.PUBLIC_URL}/assets/images/profile.png`,
            reviews: [],
        });
    };

    addReview(location_id, user_id, rating, review){
        this.users[user_id].reviews.push({
            username: this.users[user_id].username,
            rating: rating,
            review: review,
            reviewId: this.reviewId,
            location_id: location_id
        })
        this.reviewId++;
    }

    getUser(username) {
        for (let i = 0; i < this.users.length; i++){
            if (this.users[i].username === username){
                return this.users[i];
            }

        }

    }

    removeReview(uid, reviewId) {
        this.users[uid].reviews = this.users[uid].reviews.filter((review) => {return review.reviewId !== reviewId});
        return this;
    }
}

export default UserData;
