const userSchema = require('../models/schemas/user');

class UserManagerController {
    static async getAllUsers(req, res) {
        try {
            const allUsers = await userSchema.find();
            res.status(200).json(allUsers);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    static async deleteUser(req, res) {
        try {
            const user = await userSchema.findById(req.params.id);
            if (!user) {
                res.status(404).json("User is not exist");
            } else {
                await userSchema.deleteOne(user._id);
                res.status(200).json("Delete successfully");
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }
}

module.exports = UserManagerController;