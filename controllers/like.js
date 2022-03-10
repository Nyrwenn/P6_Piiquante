const Sauce = require('../models/modelsSauce');
const { getAllSauces } = require('./sauceController');

exports.sauceLike = (req, res, next) => {
    const idSauce = req.params.id;
    const userId = req.body.userId;
    const like = req.body.like;
    console.log(req.params);
    console.log(req.body);

    console.log(userId);
    if (like === 1) {
        Sauce.findOne({ _id: idSauce })
            .then((sauce) => {
                if (!sauce.usersLiked.includes(userId)) {
                    sauce.usersLiked.push(userId);
                    sauce.likes++;

                    sauce.save()
                        .then(() => res.status(201).json({ message: "Liked !" }))
                        .catch((error) => res.status(500).json({ error }));
                } else {
                    sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                    sauce.likes--;

                    sauce.save()
                        .then(() => res.status(201).json({ message: "Like delete !" }))
                        .catch((error) => res.status(500).json({ error }));
                }
            })
            .catch((error) => {
                res.status(500).json({ error })
            });
    }

    if (like === -1) {
        console.log(`it's a dislike`);
        Sauce.findOne({ _id: idSauce })
            .then((sauce) => {
                if (!sauce.usersDisliked.includes(userId)) {
                    sauce.usersDisliked.push(userId);
                    sauce.dislikes++;

                    sauce.save()
                        .then(() => res.status(201).json({ message: "Disliked!" }))
                        .catch((error) => res.status(500).json({ error }));
                } else {
                    sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                    sauce.dislikes--;

                    sauce.save()
                        .then(() => res.status(201).json({ message: "Dislike delete !" }))
                        .catch((error) => res.status(500).json({ error }));
                }
            })
            .catch((error) => {
                res.status(500).json({ error })
            });
    }

    if (like === 0) {
        Sauce.findOne({ _id: idSauce })
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) {
                    sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                    sauce.likes--;

                    sauce.save()
                        .then(() => res.status(201).json({ message: "Like delete !" }))
                        .catch((error) => res.status(500).json({ error }));
                } else {
                    sauce.usersDisliked.includes(userId);
                    sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                    sauce.dislikes--;
                    sauce.save()
                        .then(() => res.status(200).json({ message: "Dislike delete ! " }))
                        .catch((error) => res.status(500).json({ error }));
                }
            })
            .catch((error) => {
                res.status(500).json({ error })
            });
    }


}
