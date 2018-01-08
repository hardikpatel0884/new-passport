const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose.js');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { Todo } = require('./models/todo.js');
const { User } = require('./models/user.js');

const app = express();

// use 3rd party for parse json from request body
app.use(bodyParser.json());

/**
 * add totod
 * POST /todos
 */
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    req.params

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

/**
 * get todo(s) detail
 * GET /todos
 */
app.get('/todos', (req, res) => {

    Todo.find().then((todos) => {
        res.status(200).send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

/**
 * get sinle detail
 * GET /todos/12345
 */
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (ObjectID.isValid(id)) {
        Todo.findById({ _id: id }).then((doc) => { res.send(doc) }, (e) => { res.send(e) });
    } else { res.status(400).send("Ghare ja"); }
});

/**
 * delete todo
 * DELETE /todos/12345
 */
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (ObjectID.isValid(id)) {
        Todo.findByIdAndRemove({ _id: id }).then((doc) => {
            doc ? res.send(doc) : res.send('Document Not Found');
        }, (e) => { res.send(e) });
    } else { res.status(400).send("Ghare ja"); }
});

/**
 * update todos
 * PATCH /todos
 */
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        res.status(400).send("Ghare ja");
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((result) => {
        if (!result) {
            res.status(400).send('not find');
        }
        res.status(200).send({ result })
    }, (e) => { res.status(400).send('opps', e) })
});

app.post('/user', (req, res) => {
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save().then((result) => { res.status(201).send(result) }, (e) => { res.status(400).send(e) });
});

app.listen(3000, () => {

});