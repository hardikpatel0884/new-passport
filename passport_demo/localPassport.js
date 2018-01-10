/**
 * localPassport.js
 * use to authenticate user locally
 * */
const express = require('express'), /* express */
    passport = require('passport'), /* passport */
    mongoose = require('mongoose'), /* mongoose */
    LocalStrategy=require('passport-local').Strategy, /* passport-local */
    { config } = require('./../config/config'), /* local configuration's */
    bodyParser=require('body-parser'), /* body-parser to parse request body */
    {User}=require('./../models/user'), /* user model */
    app = express();

/* mongoose connection */
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// serialize user object
passport.serializeUser((user, done) => {
    done(null, user);
});

// deserialize user object
passport.deserializeUser((user, done) => {
    done(null, user);
});

// add body parser
app.use(bodyParser.json());

// configure authentication
passport.use(new LocalStrategy((username, password, done) => {
    // find user base on their email(username)
    User.findOne({ 'email': username }, (err, user) => {

        // check for any error
        if (err) {return done(err); /*returning error*/ }

        // check for not error and no user
        if (!user) { console.log('no user found'); return done(null, false); }

        // check for valid user
        if (user.password !== password) { console.log('password do not match', ); return done(null, false); }

        // finally return valid user
        return done(null, user);
    });
}));

/** start authentication login
 * POST /auth/login
 * @param {String} username email address of user
 * @param {String} password password of user
 * */
app.post('/auth/login', passport.authenticate('local', {
    successRedirect: '/done', /* redirect when user successfully authenticated */
    faiurRedirect: '/fail', /* redirect when fail to authenticate */
}));

/**
 * when user authentication success
 * GET /done
 * */
app.get('/done', (req, res) => {
    res.status(200).send("success").end();
});

/**
 * when user authentication fail
 * GET /fail
 * */
app.get('/fail', (req, res) => {
    res.status(401).send('something wrong').end();
});

/**
 * check available user list in database
 * GET /users
 * @return {Collection} users collection
 * */
app.get('/users', (req, res) => {

    User.find().then((todos) => {
        res.status(200).send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

/**
 * check user base on their email
 * GET /at/{email}
 * @param {String} email email of user
 * @return {Object} user object
 * */
app.get('/at/:email', (req, res) => {
    findMyUser(req.params.email, (err, user) => {
        if (err) { res.send(err).end() }
        res.send(user);
    });
})

/** start server on specific port */
app.listen(config.port, () => { console.log(`app reun on port ${config.port}`) })
