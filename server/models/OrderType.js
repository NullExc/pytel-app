var mongoose = require('mongoose');

var OrderTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
})

var OrderType = mongoose.model('OrderType', OrderTypeSchema);

module.exports = OrderType;