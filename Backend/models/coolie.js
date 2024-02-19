const mongoose = require('mongoose');

const coolieSchema = new mongoose.Schema({
    data: mongoose.Schema.Types.Mixed
});

const Coolie = mongoose.model('Coolie', coolieSchema);

module.exports = Coolie;
