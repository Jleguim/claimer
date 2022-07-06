const jwt = require('./functions.js')

module.exports.isAuthorized = (req, res, next) => {
    var token = req.cookies.jwt
    if (!token) return res.status(403).send({ message: 'Forbidden' })

    jwt.verify(token)
        .then(data => {
            // res.cookie('jwt', token)
            req.jwtData = data

            next()
        })
        .catch((err) => {
            if (err.message == 'jwt expired') {
                return res.status(403).send({ message: 'Forbidden' })
            }

            res.status(500).send({ message: 'Internal server error' })
        })
}