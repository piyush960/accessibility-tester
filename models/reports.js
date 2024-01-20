const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    result:{
        type: Object,
        required: true,
    },
    name:{
        type:String,
        required: true,
    }
}, { timestamps: true });

const Report = mongoose.model('report', reportSchema)

module.exports = Report;