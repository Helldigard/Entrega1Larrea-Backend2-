import userModel from '../db/models/user.model.js';

class UserRepository {
    async findByEmail(email) {
        return await userModel.findOne({ email });
    }

    async create(userData) {
        const newUser = new userModel(userData);
        return await newUser.save();
    }

    async findById(id) {
        return await userModel.findById(id);
    }

    async updatePassword(id, newPassword) {
        return await userModel.findByIdAndUpdate(id, { password: newPassword });
    }
}

export default new UserRepository();

