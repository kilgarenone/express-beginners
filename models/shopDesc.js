const mongoose = require('mongoose');

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
const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
