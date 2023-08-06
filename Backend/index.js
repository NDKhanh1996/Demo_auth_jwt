const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose').default;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./src/router/auth.router');
const userManagerRouter = require('./src/router/userManager.router');

const app = express();

dotenv.config();

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Connect success to mongoDB')
    }).catch(err => {
        console.log(err)
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/admin', userManagerRouter)

app.listen(process.env.PORT || 8080, () => {
    console.log("server is running at http://localhost:8080")
});