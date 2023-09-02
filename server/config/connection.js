const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://markciubal:ptKfsx._EGZ4Squ@cluster0.iv41rrc.mongodb.net/pinpoint?retryWrites=true&w=majority');

module.exports = mongoose.connection;
