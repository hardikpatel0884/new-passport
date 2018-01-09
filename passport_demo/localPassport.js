const express = require('express'),
    passport = require('passport'),
    { config } = require('./../config/config'),
    { User } = require('./../models/user'),
    { findMyUser } = require('./passportConfig/a'),
    LocalStrategy = require('passport-local').Strategy,
    bodyParser = require('body-parser'),
    app = express();

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

app.use(bodyParser.json());

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new LocalStrategy((username, password, done) => {
    console.log('do');
    console.log(`username: ${username}, password: ${password}`);
    /*User.findOne({ 'email': username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (user.password !== password) { return done(null, false); }
        return done(null, user);
    });*/
    //return done(null, { 'email': username, 'passwprd': password })
    process.nextTick(() => {
        console.log('dfa');
        User.findOne({ 'email': username }).then((user) => {
            console.log(user)
        }, (err) => { console.log(err) })
    });
    /*User.findOne({ 'email': username }).then((user) => {
        console.log(user)
    }, (err) => { console.log(err) })*/
}));

app.post('/auth/login', passport.authenticate('local', {
    successRedirect: '/done',
    faiurRedirect: '/fail',
}));

app.get('/done', (req, res) => {
    res.status(200).send("success").end();
});

app.get('/fail', (req, res) => {
    res.status(401).send('something wrong').end();
});


app.get('/users', (req, res) => {

    User.find().then((todos) => {
        res.status(200).send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/at/:email', (req, res) => {
    findMyUser(req.params.email, (err, user) => {
        if (err) { res.send(err).end() }
        res.send(user);
    });
})

app.listen(config.port, () => { console.log(`app reun on port ${config.port}`) })