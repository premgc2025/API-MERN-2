const jwt = require('jsonwebtoken')


// Middleware Verify Token

function verifyToken(req, res, next) {

    const headerData = req.headers.authorization;
    if (headerData !== undefined) {
        const token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, "myLogin", (err, result) => {
            if (!err) {
                next()

            }
            else {
                res.status(401).send({ Message: "Token is invalid, try again" })
            }

        })
    }
    else {
        res.status(404).send({ Message: "Pass the Token " })
    }


}

module.exports = verifyToken;