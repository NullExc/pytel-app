var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({

});

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;