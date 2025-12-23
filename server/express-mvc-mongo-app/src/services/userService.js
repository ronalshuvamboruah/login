class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async createUser(userData) {
        const user = new this.userModel(userData);
        return await user.save();
    }

    async getUser(userId) {
        return await this.userModel.findById(userId);
    }

    async deleteUser(userId) {
        return await this.userModel.findByIdAndDelete(userId);
    }

    async getAllUsers() {
        return await this.userModel.find();
    }
}

export default UserService;