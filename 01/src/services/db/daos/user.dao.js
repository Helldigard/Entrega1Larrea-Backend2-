import userModel from "../models/user.model.js";

export default class UserDAO {
async getByEmail(email) {
    return await userModel.findOne({ email });
    }

async getById(id) {
    return await userModel.findById(id);
    }

async create(userData) {
    return await userModel.create(userData);
    }

async updatePassword(id, newPassword) {
    return await userModel.findByIdAndUpdate(id, { password: newPassword });
    }

async getAll() {
    return await userModel.find();
    }
}
