const mongoose = require('mongoose');

// Định nghĩa Address Schema
const AddressSchema = new mongoose.Schema({
    fullName: String,
    streetAddress: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
});

// Định nghĩa và export Address Model
const Address = mongoose.model('Address', AddressSchema);
module.exports = Address;
