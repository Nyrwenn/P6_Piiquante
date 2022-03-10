const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            let isValid = regexMail.test(req.body.email);
            if (isValid) {

                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'User created ! ' }))
                    .catch(error => res.status(500).json({ error }))
            } else {
                res.status(500).json({ message: 'invalid email ! ' })
            }

        })
        .catch(error => res.status(500).json({ error }));

};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'User not found ! ' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Incorrect password ! ' })
                    }
                    return res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.PassJWT,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

}