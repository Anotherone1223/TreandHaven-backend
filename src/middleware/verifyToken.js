const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET_KEY

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token
        // const token = req.headers["authorization"].split(" ")[1]
console.log(token);

        if (!token) {
            return res.status(401).send({ message: "inavlid Token" })

        }
        const decoded = jwt.verify(token, JWT_SECRET)
console.log(decoded);

        if (!decoded) {
            return res.status(401).send({ message: "inavlid token or not valid" })
        }
        req.userId = decoded.userId
        req.role = decoded.role
        next();
    } catch (error) {
        console.error('Error while verifying token', error)
        res.status(401).send({ message: 'server error' })

    }

}

module.exports = verifyToken;