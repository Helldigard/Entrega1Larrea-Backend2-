import UserDAO from '../services/dao/user.dao.js';

export default class UserRepository {
    constructor() {
        this.userDAO = new UserDAO();
    }

    async getById(id) {
        return await this.userDAO.getById(id);
    }

    async getByEmail(email) {
        return await this.userDAO.getByEmail(email);
    }

    async createUser(data) {
        return await this.userDAO.createUser(data);
    }

    async updateUser(id, updates) {
        return await this.userDAO.updateUser(id, updates);
    }

    async deleteUser(id) {
        return await this.userDAO.deleteUser(id);
    }
}
