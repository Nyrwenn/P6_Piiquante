require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const app = express();
const path = require('path');
const userRoutes = require('./routes/userRoute');
const sauceRoutes = require('./routes/sauceRoute');


mongoose.connect(process.env.MONGO,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());


const port = 3000

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));
app.disable('x-powered-by');
app.use(
    mongoSanitize({
        allowDots: true,
        replaceWith: '_',
    }),
);
app.use(
    mongoSanitize({
        onSanitize: ({ req, key }) => {
            console.warn(`This request[${key}] is sanitized`, req);
        },
    }),
);

const apiRequestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 200
})

app.use(apiRequestLimiter);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



