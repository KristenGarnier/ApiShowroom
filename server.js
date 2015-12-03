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
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var imageUpload = require('./imageUpload');
var ftp = require('./ftp');

app.use('/uploads', express.static(__dirname + '/uploads'));

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

apiRouter.route('/')
    .get(function (req, res) {
        res.sendfile('index.html');
    });

apiRouter.route('/users')
    .get(function (req, res) {
        var fiveLast = users.items.reverse().filter(function (item, index) {
            if (index < 5) {
                return item;
            }
        });
        res.send(fiveLast);
    })
    .post(multipartMiddleware, function (req, res, next) {
        var user, newPath, file;
        if (users.where({username: req.body.username}).items.length > 0) {
            res.status(409).send({
                error: true,
                message: "The user already exists"
            });
        } else {
            user = users.insert(
                {
                    username: req.body.username,
                    imageweb: null,
                    imagegraph: null,
                    imageaudio: null,
                    portrait: null
                }
            );

            if (req.files) {
                imageUpload.upload(req.files.avatar, user, function(file, user){
                    users.update(user, {portrait: file});
                });
            }

            res.status(200).send({
                error: false,
                message: ""
            });
        }
    });

apiRouter.route('/users/:id')
    .get(function (req, res) {
        res.send(users.get(parseInt(req.params.id)));
    })
    .patch(function (req, res) {
        var id = parseInt(req.params.id);
        users.update(id, req.body.change);
        res.send(users.get(id));
    })
    .post(function (req, res) {
        var id = parseInt(req.params.id),
            type = req.body.type, user;

        user = users.get(id);
        res.send({
            user: user,
            id: id,
            type: req.body.type
        });
        imageUpload.upload(req.files, user, users, function(user, file, newpath, fileObj) {
            switch(type){
                case 'audiovisuel':
                    users.update(user, {"imageaudio": file});
                    ftp.upload('audiovisuel',newpath, fileObj);
                    break;
                case 'infographie':
                    users.update(user, {"imagegraph": file});
                    ftp.upload('infographie',newpath, fileObj);
                    break;
                case 'web':
                    users.update(user, {"imageweb": file});
                    ftp.upload('web',newpath, fileObj);
                    break;
                default:
                    throw 'Impossible de tirer le type de l\'image';
                    break;
            }
        });
    });

app.use('/', apiRouter);


// START THE SERVER
// =================================
app.listen(port);
console.log('Magic happens on port ' + port);
