/**
 * server.js
 * purpose: passport authentication demo main file
 * createdAt: 06/01/2017 7:52 PM
 * Author: Hardik Patel
 */

/**
 * inject require package's
 */

const express = require('express'),
    passport = require('passport'),
    { config } = require('./../config/config'),
    auth = require('./passportConfig/googleOauth'),
    app = express();

app.use(passport.initialize());
app.use(passport.session());

app.get('/hello', (req, res) => {
    res.send(`hello user ${config.port}`);
})

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/profile', failurRedirect: '/' }));
app.get('/profile', (req, res) => {
    res.send('thay gyu');
})
app.get('/', (req, res) => {
    res.send('raigyu bhai');
})

app.listen(config.port, () => { console.log(`server listen on port ${config.port}`) });