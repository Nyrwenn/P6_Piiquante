const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();


const Joi = require('joi');

const schema = Joi.object({
    email: Joi.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
})

exports.signup = (req, res, next) => {
    schema.validateAsync({
        email: req.body.email,
        password: req.body.password
    })
        .then((data) => {
            console.log(data);
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const user = new User({
                        email: req.body.email,
                        password: hash,
                    });
                    user.save()
                        .then(() => res.status(201).json({ message: 'User created ! ' }))
                        .catch(error => res.status(500).json({ error }))
                })
                .catch(error => res.status(500).json({ error }));
        }).catch((error) => res.status(400).json({ error }));
}

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