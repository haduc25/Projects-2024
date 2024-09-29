const mongoose = require('mongoose');

// Định nghĩa Events Schema
const EventsSchema = new mongoose.Schema({
    image: String,
    startedAt: String,
    endsAt: String,
    name: String,
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
    location: String,
});

// Định nghĩa và export Events Model
const Events = mongoose.model('Events', EventsSchema);
module.exports = Events;
