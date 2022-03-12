const Sauce = require('../models/modelsSauce');
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.createSauce = (req, res, next) => {

    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });

    sauce.save()
        .then(() => {
            res.status(201).json({ message: 'Sauce created ! ' });
        }
        ).catch((error) => {
            res.status(400).json({ error });
        })
};


exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.PassJWT);
            const userId = decodedToken.userId;
            if (userId === sauce.userId) {
                if (sauce.imageUrl !== sauceObject) {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.updateOne({ _id: req.params.id }, {
                            ...sauceObject,
                            likes: sauce.likes,
                            dislikes: sauce.dislikes,
                            usersLiked: sauce.usersLiked,
                            usersDisliked: sauce.usersDisliked,
                        })
                            .then(() => res.status(200).json({ message: "Modified sauce ! " }))
                            .catch((error) => {
                                res.status(400).json({ error });
                            });
                    })
                }
            } else {
                res.status(403).json({ message: "unauthorized" })
            }
        })
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.PassJWT);
            const userId = decodedToken.userId;
            if (userId === sauce.userId) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: 'Sauce removed' });
                        }).catch((error) => {
                            res.status(400).json({ error })
                        });
                });
            } else {
                res.status(403).json({ message: "unauthorized" })
            }
        })
        .catch(error =>
            res.status(400).json({ error }));
};



exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces => res.status(200).json(sauces)))
        .catch((error) => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce => res.status(200).json(sauce)))
        .catch((error) => res.status(400).json({ error }));

};