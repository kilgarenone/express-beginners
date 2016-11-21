const mongoose = require('mongoose');
const logger = require('logger.js');

// Create mongoose schema with 'Properties Name: Data type' pairs
const shopSchema = mongoose.Schema({
    name: String,
    category: String,
    description: String,
    tags: [String],
    wifi: Boolean,
    openingHour: String,
});

// Add methods to the schema
shopSchema.methods.getOpeningHour = function () {
    return `${this.openingHour} am`;
};

// Create a model out of this schema
const ShopModel = mongoose.model('Shop', shopSchema);

exports.getShops = function (conditionObj) {
    return ShopModel.find(conditionObj).exec()
                .then(shopsArr => shopsArr)
                .catch((err) => {
                    logger.error(`Error in getting Shops: ${err}`);
                });
};
