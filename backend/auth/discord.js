const requests = require('superagent')

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const SCOPES = ['identify']
const REDIRECT_URL = encodeURI(`http://localhost:1337/auth/callback`)

module.exports.authUrl = `https://discord.com/oauth2/authorize?response_type=code&prompt=consent&client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URL}`

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
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URL,
                grant_type: 'authorization_code',
                code: code
            })
            .then(res => resolve(res.body))
            .catch(reject)
    })
}