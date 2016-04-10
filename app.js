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

var path = require('path');

var app = express();
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/templates'));
app.use(express.static(__dirname + '/static'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/auth', function(req, res) {
    console.log("Received POST @ /auth : " + req.body);
    if(req.body == undefined){
        console.log('no query data provided');
        return;
    }
    if(req.body.email == undefined){
        console.log('no email data provided');
        return;
    }
    if(req.body.password == undefined){
        console.log('no password data provided');
        return;
    }
    user.find({ email: req.body.email }, function(err, match) {
        console.log(match);
        if(err) {
            console.log(err);
            res.send(err);
            return;
        }
        if(match == undefined) {
            res.send('No such acc with email ' + req.body.email);
            console.log('No such acc with email ' + req.body.email);
            return;
        }
        if(match[0] == undefined) {
            res.send('No such acc with email ' + req.body.email);
            console.log('No such acc with email ' + req.body.email);
            return;
        }
        if(match[0].password == req.body.password) {
            res.sendFile(__dirname + '/templates/after.html');
            console.log('auth of user ' + req.body.email + ' successful');
        }
        else {
            res.send('failure');
            console.log('auth of user ' + req.body.email + ' failed');
        }
    });

});

app.post('/api', function(req, res) {
    console.log(req.body);
    switch (undefined) {
        case req.body.name:
            console.log('no name provided');
            res.send('no name provided');
            return;
        case req.body.email:
            console.log('no email provided');
            res.send('no email provided');
            return;
        case req.body.password:
            console.log('no password provided');
            res.send('no password provided');
            return;
        default:
            break;
    }

    var newUser = new user({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    user.find({email: req.body.email}, function callback(err, users) {
        if(users[0] == undefined || users == [] || users == undefined || users == null || users == ' ') {
            newUser.save(function (err, newuser) {
                if(err) {
                    console.log(err);
                    res.send('Registration failed');
                    return;
                }
                console.log(newuser);
                console.log('User ' + req.body.email + ' registered');
                res.sendFile(__dirname + '/templates/after.html');
            });
        }
        else {
            console.log('users:' + users);
            res.send('email ' + req.body.email + ' taken');
            console.log('email taken');
        }
    });




});

app.listen(80, function callback(){
    console.log('Server running and listening @ localhost:80');
});

user.find({}, function callback(err, result) {
    result.forEach(function callback(el, index) {
        console.log(index + ': ' + el.name);
    })
});
