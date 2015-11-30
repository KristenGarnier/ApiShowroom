// BASE SETUP
// ===============================

var db = require('locallydb');
var db = new db('./data');
var users = db.collection('users');

// CALL THE PACKAGES -------------
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan = require('morgan'); // used to see request
var port = process.env.PORT || 8080; // set the port for our app

var superSecret = "mahnameiskristenandifuckingrocks"; // variable secrète pour les tokens

// APP CONFIGURATION -------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var done = false; // To send res only when upload is done

// configure out app to handle CORS Request

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

// log all request to the console
app.use(morgan('dev'));

var apiRouter = express.Router();

// ROUTES FOR OUR API
// ================================

// basic route for the home page

apiRouter.route('/users')
    .get(function (req, res) {
        var fiveLast = users.items.reverse().map(function(item, index){
            if(index < 5){
                return item;
            }
        });
        res.send(fiveLast);
    })
    .post(function (req, res) {

        if(users.where({username : req.body.username}).items.length > 0 ){
            res.status(409).send({
                error : true,
                message : "The user already exists"
            });
        }

        users.insert(
            {
                username: req.body.username,
                imageweb: null,
                imagegraph: null,
                imageaudio: null,
                portrait: null
            }
        );

        res.status(200).send({
            error: false,
            message: ""
        });
    });

apiRouter.route('/users/:id')
    .get(function (req, res) {
        User.findById(req.params.id)
            .then(function (user) {
                res.send(user);
            })
    });

app.use('/', apiRouter);


// START THE SERVER
// =================================
app.listen(port);
console.log('Magic happens on port ' + port);
