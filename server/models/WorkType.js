var mongoose = require('mongoose');

var WorkTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
})

var WorkType = mongoose.model('WorkType', WorkTypeSchema);

module.exports = WorkType;