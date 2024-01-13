const { model, Schema } = require('mongoose');
const jointocreate = require('./join2createSchema');

let jointocreatechannels = new Schema({
    Guild: String,
    User: String,
    Channel: String
})

module.exports = model('jointocreatechannels', jointocreatechannels);