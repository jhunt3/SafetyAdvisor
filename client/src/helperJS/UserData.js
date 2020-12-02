
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
            imagePath: `/static/profile.png`,
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

    removeUser(username, locationData) {
        const user = this.getUser(username);

        for (let i=0; i < user.reviews.length; i++) {
            locationData.removeReview(user.reviews[i].location_id, user.reviews[i].reviewId);
        }

        this.users = this.users.filter((user) => {return user.username !== username});

        let i = 0;
        this.users.forEach((user) => {
            user.uid = i;
            i++;
        })
        return this;
    }

    removeReview(uid, reviewId) {
        this.users[uid].reviews = this.users[uid].reviews.filter((review) => {return review.reviewId !== reviewId});
        return this;
    }
}

export default UserData;