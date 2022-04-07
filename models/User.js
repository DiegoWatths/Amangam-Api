const mongoose = require('mongoose')
const {Schema, model} = require('mongoose')
const bcrypt = require('bcryptjs');

const UserSchema = new Schema(
    {
        name: {type: String,  required: true, trim: true},
        lastname: {type: String,  required: true, trim: true},
        username: {type: String,  required: true, unique: true},
        email: {type: String,  required: true, trim: true, unique: true},
        password: {type: String, required: true},
        profilePhoto: {type: String}
    }
)

UserSchema.methods.encryptPassword = async function (password){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
};

module.exports = model('User', UserSchema);