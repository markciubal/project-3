const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://markciubal:ptKfsx._EGZ4Squ@cluster0.iv41rrc.mongodb.net/pinpoint?retryWrites=true&w=majority" || 'mongodb://127.0.0.1:27017/pinpoint', {
    socketTimeoutMS: 60000
});

module.exports = mongoose.connection;
