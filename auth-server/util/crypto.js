const crypto = require('crypto')


module.exports.generateSalt = function() {
    const rounds = 12
    return crypto.randomBytes(Math.ceil(rounds / 2)).toString('hex').slice(0, rounds)
}

module.exports.hasher = hasher
function hasher(password, salt) {
    var hash = crypto.createHmac('sha512', salt)
    hash.update(password)
    var value = hash.digest('hex')
    return {
        salt: salt,
        hashedPassword: value
    }
}

module.exports.compare = function(password, hash) {
    var passwordData = hasher(password, hash.salt)
    if (passwordData.hashedPassword === hash.hashedPassword) {
        return true
    }
    return false
}
