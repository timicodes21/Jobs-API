const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: [3, "username can't be less than 3 characters"],
        maxlength: [50, "Username can't be more than 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email"
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide your password"],
        minlength: [6, "Password can't be less than 6 characters"]
    },
}, { timestamps: true })

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.getToken = function() {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

userSchema.methods.comparePassword = async function(password) {
    const isMatch = await bcrypt.compare(password, this.password)
    return isMatch;
}

const User = mongoose.model('User', userSchema)

module.exports = User;

