// Bring in the cached mongoose instance
const mongoose = require('mongoose');

/*
    Create a mongoose schema for user's favourite shops.

    This schema defines a document structure with two properties:
    1) email - contains data of type String
    2) shopIds - contains elements of ids of type String in an Array
*/
const UserFavShopsSchema = mongoose.Schema({
    email: String,
    shopIds: [String],
});

// Create a mongoose model out of the schema you created above.
const userFavShopsModel = mongoose.model('userFavShopsModel', UserFavShopsSchema);

/*
    These are the APIs you expose to outside world to interact only with this particular model.
    Strive to have your models containing only database queries, keeping out any data transformations.

    More info: https://www.terlici.com/2014/08/25/best-practices-express-structure.html#models
*/
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
