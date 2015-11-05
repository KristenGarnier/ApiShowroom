
// BASE SETUP
// ===============================

var User       = require('./User');

// CALL THE PACKAGES -------------
var express    = require('express'); // call express
var app 	   = express(); // define our app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan     = require('morgan'); // used to see request
var port       = process.env.PORT || 8080; // set the port for our app

var superSecret = "mahnameiskristenandifuckingrocks"; // variable secrète pour les tokens

// APP CONFIGURATION -------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// configure out app to handle CORS Request

app.use(function(req, res, next){
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
    .get(function(req, res) {
        User.findAll({
            order: 'id DESC',
            limit: 5
        })
            .then(function(users){
                res.send(users);
            })
    })
    .post(function(req, res){
        User.create({
            username: req.body.username
        }).then(function (user) {
            res.send('Utilisateur ' + user.username + ' a été enregistré', 200);
        });
    });

apiRouter.route('/users/:id')
    .get(function(req, res){
        User.findById(req.params.id)
            .then(function(user){
                res.send(user);
            })
    });

app.use('/', apiRouter);



// START THE SERVER
// =================================
app.listen(port);
console.log('Magic happens on port ' + port);
