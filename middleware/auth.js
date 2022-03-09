const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'DONT_SHOW_ME');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User Id not valid ! ';
        } else {
            next()
        }
    }

    catch (error) {
        res.status(401).json({ error: error | 'unauthenticated request ! ' });
    }
};
