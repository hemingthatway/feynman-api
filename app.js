/**
 * Created by nopony on 28.03.16.
 */
var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017');
var db = mongoose.connection;
db.on('open', function(){
    console.log('DB connection established');
});
var userSchema = mongoose.Schema({
    email: String,
    password: String,
    name: String
});
var user = mongoose.model('user', userSchema);


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api', function(req, res) {

    if(req.query.req_type == undefined) {
        res.send('no req_type');
        console.log('no req_type');
        return;
    }
    switch (req.query.req_type){

        case 'auth':
            user.find({ email: req.query.email }, function(err, match) {
                if(err) {
                    console.log(err);
                    res.send(err);
                    return;
                }
                if(match == null) {
                    res.send('No such acc with email ' + req.query.email);
                    console.log('No such acc with email ' + req.query.email)    ;
                    return;
                }
                if(match[0].password == req.query.password) {
                    res.send('success');
                    console.log('auth of user' + req.query.email + 'successful');
                }
                else {
                    res.send('failure');
                    console.log('auth of user' + req.query.email + 'failed');
                }
            });
            break;

        default:
            res.send('invalid api call invalid req_type:' + req.query.req_type);
            console.log('invalid api call invalid req_type:' + req.query.req_type);
            break;
    }
});

app.post('/api', function(req,res) {

    switch (undefined) {
        case req.body.name:
            console.log('no name provided');
            res.send('no name provided');
            break;
        case req.body.email:
            console.log('no email provided');
            res.send('no email provided');
            break;
        case req.body.password:
            console.log('no password provided');
            res.send('no password provided');
            break;
        default:
            break;
    }

    user.find({email: req.body.email}, function callback(err, users) {
        if(users != undefined) {
            res.send('email' + req.body.email + 'taken');
            console.log('email taken');
        }
    });

    var newUser = new user({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    newUser.save(function (err, newuser) {
        if(err) {
            console.log(err);
            res.send('Registration failed');
        }
        console.log(newuser);
        res.send('User ' + req.body.email + ' registered');
    });

});

app.listen(3000, function callback(){
    console.log('Api running and listening @ localhost:3000');
});
user.find({}, function callback(err, result) {
    result.forEach(function callback(el) {
        console.log(el);
    })
});
