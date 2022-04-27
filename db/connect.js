const mongoose = require('mongoose');

const connectDB = (url) => {
    return mongoose.connect(url, { useNewURLParser: true, useUnifiedTopology: true })
}

module.exports = connectDB;