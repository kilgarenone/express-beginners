const mongoose = require('mongoose');
const logger = require('../lib/logger.js');

const userSchema = mongoose.Schema({
    authId: String,
    name: String,
    email: String,
    role: String,
    created: Date,
});

const UserModel = mongoose.model('User', userSchema);

exports.createUserModel = function createUserModel(schema) {
    return new UserModel(schema);
};

exports.getUserById = function getUserById(id) {
    return UserModel.findById(id).exec()
                .then(user => user)
                .catch((err) => {
                    logger.error(`Error in getting User: ${err}`);
                });
};

exports.getOneUser = function getOneUser(conditionObj) {
    return UserModel.findOne(conditionObj).exec()
        .then(user => user)
        .catch((err) => {
            logger.error(`Error in getting User: ${err}`);
        });
};

exports.saveNewUser = function saveNewUser() {
    return this.save()
        .catch((err) => {
            logger.error(`Error in saving new User: ${err}`);
        });
};

