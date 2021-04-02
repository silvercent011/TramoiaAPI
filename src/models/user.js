const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    bio: {type: String, default: null},
    plan_type: {type: String, default: null},
    avatar_url: {type: String, default: null},
    email: {type: String, required: true, unique: true},
    language: {type: String, required: true},
    first_login: {type: Date, default: null},
    last_login: {type: Date, default: null},
})

module.exports = mongoose.model('User', UserSchema, 'users');