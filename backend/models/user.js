const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

var userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    points: { type: Number, required: true, default: 100 }
})

userSchema.method('toJSON', function () {
    var data = {
        username: this.username,
        discordId: this.discordId,
        points: this.points
    }

    return data
})

userSchema.method('jwtPrepare', function () {
    var data = {
        username: this.username,
        discordId: this.discordId,
        points: this.points
    }

    return data
})

userSchema.static('hash', function (password) {
    var hashed = bcrypt.hashSync(password, 10)
    return hashed
})

userSchema.method('checkPassword', function (plainPass) {
    var hashedPass = this.hashedPassword
    return bcrypt.compareSync(plainPass, hashedPass)
})

module.exports = mongoose.model('User', userSchema)