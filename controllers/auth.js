const User = require('../models/user')
const { StatusCodes } = require('http-status-codes')
const { BadRequest, UnAuthorized } = require('../errors')

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.getToken();
    res.status(StatusCodes.CREATED).json({ user: {name: user.name}, token })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        throw new BadRequest("Please provide email and password")
    } 

    const user = await User.findOne({ email })
    if(!user){
        throw new UnAuthorized("Invalid Credentials")
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new UnAuthorized("Invalid password")
    }

    const token = user.getToken();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
    
}

module.exports ={
    register,
    login
}