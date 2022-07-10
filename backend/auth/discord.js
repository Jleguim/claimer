const requests = require('superagent')

module.exports.clientId = process.env.CLIENT_ID
module.exports.clientSecret = process.env.CLIENT_SECRET
module.exports.scopes = ['identify']
// should probably change this to a config file or something
module.exports.redirectUrl = encodeURI(`http://localhost:1337/auth/callback`)
module.exports.authUrl = `https://discord.com/oauth2/authorize?response_type=code&prompt=consent&client_id=${this.clientId}&scope=${this.scopes}&redirect_uri=${this.redirectUrl}`

module.exports.getUser = (access_token) => {
    return new Promise((resolve, reject) => {
        requests.get('https://discord.com/api/v9/users/@me')
            .set('Authorization', 'Bearer ' + access_token)
            .then(res => resolve(res.body))
            .catch(reject)
    })
}

module.exports.requestToken = (code) => {
    return new Promise((resolve, reject) => {
        requests.post('https://discord.com/api/oauth2/token')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uri: this.redirectUrl,
                grant_type: 'authorization_code',
                code: code
            })
            .then(res => resolve(res.body))
            .catch(reject)
    })
}