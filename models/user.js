const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const cryptojs = require('crypto-js');
const env = require("dotenv").config();
const password = process.env.AES_KEY;

const userSchema = mongoose.Schema({
    email: {type : String, required: true , unique : true},
    password: {type : String, required: true},   
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)