const Sauce = require('../models/modelsSauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {

    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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
            imageURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Modified sauce ! " }))
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            console.log(sauce)
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => {
                        res.status(200).json({ message: 'Sauce removed' });
                    }).catch((error) => {
                        res.status(400).json({ message: error })
                    });
            });

        })
        .catch(error =>
            res.status(500).json({ essage: error }));
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