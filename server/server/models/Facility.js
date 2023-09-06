var mongoose = require('mongoose');

var FacilitySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});

var Facility = mongoose.model('Facility', FacilitySchema);

module.exports = Facility;