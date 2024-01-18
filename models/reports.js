const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    result:{
        type: Object,
        required: true,
    }
}, { timestamps: true });

const Report = mongoose.model('report', reportSchema)

module.exports = Report;