module.exports.getTokenFromResponse = (res) => {
    var cookie = res.header['set-cookie'][0]
    var jwt = cookie.split('; ')[0].split('=')[1]
    return jwt
}