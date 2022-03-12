const Sauce = require('../models/modelsSauce');
const jwt = require('jsonwebtoken');


exports.sauceLike = (req, res, next) => {
    const idSauce = req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.PassJWT);
    const userId = decodedToken.userId;
    const like = req.body.like;

    if (like === 1) {
        Sauce.findOne({ _id: idSauce })
            .then((sauce) => {
                const arrayOfLikes = sauce.usersLiked;
                if (!arrayOfLikes.includes(userId) && !sauce.usersDisliked.includes(userId)) {
                    arrayOfLikes.push(userId);
                    sauce.likes++;

                    return sauce.save()
                        .then(() => res.status(201).json({ message: "Liked !" }))
                        .catch((error) => res.status(500).json({ error }));
                }
                if (arrayOfLikes.includes(userId)) {
                    arrayOfLikes.splice(arrayOfLikes.indexOf(userId), 1);
                    sauce.likes--;
                    sauce.usersLiked = arrayOfLikes;

                    return sauce.save()
                        .then(() => res.status(201).json({ message: "Like delete !" }))
                        .catch((error) => res.status(900).json({ error }));
                }
                if (sauce.usersDisliked.includes(userId)) {
                    return res.status(403).json({ message: "unauthorized " });
                }
            })
            .catch((error) => {
                res.status(500).json({ error })
            });
    }

    else if (like === -1) {
        Sauce.findOne({ _id: idSauce })
            .then((sauce) => {
                const arrayOfDislikes = sauce.usersDisliked;

                if (!arrayOfDislikes.includes(userId) && !sauce.usersLiked.includes(userId)) {
                    arrayOfDislikes.push(userId);
                    sauce.dislikes++;
                    sauce.usersDisliked = arrayOfDislikes;

                    return sauce.save()
                        .then(() => res.status(201).json({ message: "Disliked!" }))
                        .catch((error) => res.status(500).json({ error }));
                }
                if (arrayOfDislikes.includes(userId)) {
                    arrayOfDislikes.splice(arrayOfDislikes.indexOf(userId), 1);
                    sauce.dislikes--;

                    return sauce.save()
                        .then(() => res.status(201).json({ message: "Dislike delete !" }))
                        .catch((error) => res.status(900).json({ error }));
                }
                if (sauce.usersLiked.includes(userId)) {
                    return res.status(403).json({ message: "unauthorized" });
                }
            })
            .catch((error) => {
                res.status(500).json({ error })
            });
    }

    else if (like === 0) {
        Sauce.findOne({ _id: idSauce })
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) {
                    sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                    sauce.likes--;

                    return sauce.save()
                        .then(() => res.status(201).json({ message: "Like delete !" }))
                        .catch((error) => res.status(500).json({ error }));
                }
                if (sauce.usersDisliked.includes(userId)) {
                    sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                    sauce.dislikes--;

                    return sauce.save()
                        .then(() => res.status(200).json({ message: "Dislike delete ! " }))
                        .catch((error) => res.status(500).json({ error }));
                } else {
                    res.status(400).json({ error });
                }
            })
            .catch((error) => {
                res.status(500).json({ error })
            });
    } else {
        res.status(400).json({ message: 'Unexpected number of likes' });
    }


}
