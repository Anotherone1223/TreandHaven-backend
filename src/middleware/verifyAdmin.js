const verifyAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.status(403).send({ success: false, message: "You are not Authorized to perform this Action" })
    }
    next();

}

module.exports = verifyAdmin