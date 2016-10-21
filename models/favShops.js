const mongoose = require('mongoose');

const UserFavShopsSchema = mongoose.Schema({
    email: String,
    shopIds: [String],
});

const userFavShopsModel = mongoose.model('userFavShopsModel', UserFavShopsSchema);

exports.favThisShop = function (shopId) {
    // Update without returning from database
    return userFavShopsModel.update(
        { email: 'user@gmail.com' }, // condition to query for specfic doc
        { $push: { shopIds: shopId } }, // $push insert new value into the 'ids' array
        { upsert: true }) //  if a record with the given email address doesn’t exist, it will be created. If a record does exist, it will be updated.
        .exec()
        .catch((err) => {
            console.log('Error adding your favourite shop.');
        });
};
