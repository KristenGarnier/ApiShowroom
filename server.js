// BASE SETUP
// ===============================

var db = require('locallydb'),
    db = new db('./data'),
    users = db.collection('users');

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
var moment = require('moment');
var uploadTreatment = require('./uploadTreatment');
var objectAssign = require('object-assign');
var cors = require('cors');

app.use('/uploads', express.static(__dirname + '/uploads'));

var superSecret = "mahnameiskristenandifuckingrocks"; // variable secrète pour les tokens


// APP CONFIGURATION -------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

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
        //////! MUST CALL THE FILE UPLOAD "UPLOAD" ////
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
                imageUpload.upload(req.files.avatar, user, function (file, user, newPath, fileObj) {
                    users.update(user, {portrait: file});
                    ftp.upload('www', newPath, fileObj, user);
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
    .post(multipartMiddleware, function (req, res) {
        var id = parseInt(req.params.id),
            type = req.body.type, user, date = moment(), params;

        user = users.get(id);
        imageUpload.upload(req.files, user.cid, function (user, file, newpath, fileObj) {
            params = {
                id: id,
                user: user,
                newpath: newpath,
                fileObj: fileObj,
                date: date,
                users: users,
                cat: type
            };

            switch (type) {
                case 'audiovisuel':
                    uploadTreatment(objectAssign(params, {imageCat: 'imageaudio', catId: 4}), function (err, response) {
                        if (err) {
                            console.log("ERROR");
                        } else {
                            res.send(response);
                        }
                    });
                    break;
                case 'infographie':
                    uploadTreatment(objectAssign(params, {imageCat: 'imagegraph', catId: 3}), function (err, response) {
                        if (err) {
                            console.log("ERROR");
                        } else {
                            res.send(response);
                        }
                    });
                    break;
                case 'web':
                    uploadTreatment(objectAssign(params, {imageCat: 'imageweb', catId: 2}),  function (err, response) {
                        if (err) {
                            console.log("ERROR");
                        } else {
                            res.send(response);
                        }
                    });
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
