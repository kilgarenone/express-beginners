const mongoose = require('mongoose');

const shopsFollowedByUserSchema = mongoose.Schema({
    email: String,
    shopIds: [String],
});

const shopsFollowedByUserModel = mongoose.model('shopsFollowedByUserModel', shopsFollowedByUserSchema);

module.exports = shopsFollowedByUserModel;
