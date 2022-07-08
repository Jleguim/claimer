const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

var userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
})

userSchema.method('hashPassword', function (password) {
    var hashed = bcrypt.hashSync(password, 10)
    this.password = hashed
    return this
})

userSchema.method('checkPassword', function (plainPass) {
    var hashedPass = this.password
    return bcrypt.compareSync(plainPass, hashedPass)
})

module.exports = mongoose.model('User', userSchema)