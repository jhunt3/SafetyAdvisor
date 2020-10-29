
class UserData {
    constructor() {
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
            location_id: location_id,
        })
    }

    getUser(username) {
        for (let i = 0; i < this.users.length; i++){
            if (this.users[i].username === username){
                return this.users[i];
            }

        }

    }


}

export default UserData;
