// BASE SETUP
// ===============================
var db = require('locallydb'),
    db = new db('./data'),
    users = db.collection('users'),

// CALL THE PACKAGES -------------
    express = require('express'), // call express
    app = express(), // define our app using express
    bodyParser = require('body-parser'), // get body-parser
    morgan = require('morgan'), // used to see request
    port = process.env.PORT || 8080, // set the port for our app
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart(),
    imageUpload = require('./imageUpload'),
    ftp = require('./ftp'),
    moment = require('moment'),
    uploadTreatment = require('./uploadTreatment'),
    objectAssign = require('object-assign'),
    cors = require('cors');

app.use('/uploads', express.static(__dirname + '/uploads'));

var superSecret = "mahnameiskristenandifuckingrocks"; // variable secrète pour les tokens


// APP CONFIGURATION -------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// ENABLE CORS FOR ALL ORIGINS
app.use(cors());
// configure out app to handle CORS Request

/*app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
});*/

// log all request to the console
app.use(morgan('dev'));

var apiRouter = express.Router();

// ROUTES FOR OUR API
// ================================

// basic route for the home page
// Endpoint for testing purposes
apiRouter.route('/')
    .get(function (req, res) {
        res.sendfile('index.html');
    });

apiRouter.route('/users')
    // the 5 last users
    .get(function (req, res) {
        var fiveLast = users.items.reverse().filter(function (item, index) {
            if (index < 5) {
                return item;
            }
        });
        res.send(fiveLast);
    })
    // Register a user
    // Must includes params :
    // username : String -> name of the user
    // (optional) upload : photo of the user

    .post(multipartMiddleware, function (req, res, next) {
        //////! MUST CALL THE FILE UPLOAD "UPLOAD" ////
        var user, newPath, file;

        // Check if the user already exists
        if (users.where({username: req.body.username}).items.length > 0) {
            res.status(409).send({
                error: true,
                message: "The user already exists"
            });
        } else {
            // creating user object and push in db
            user = users.insert(
                {
                    username: req.body.username,
                    imageweb: null,
                    imagegraph: null,
                    imageaudio: null,
                    portrait: null
                }
            );

            // If file exist we handle upload
            if (req.files) {
                imageUpload.upload(req.files.avatar, user, function (file, user, newPath, fileObj) {
                    users.update(user, {portrait: file});
                    ftp.upload('www', newPath, fileObj, user);
                });
            }

            res.status(201).send({
                error: false,
                message: ""
            });
        }
    });

apiRouter.route('/users/:id')
    // get a specific user
    .get(function (req, res) {
        res.send(users.get(parseInt(req.params.id)));
    })

    // update a user if needed
    // send updated user
    // Must includes params :
    // change: Object -> Données à changer sur l'utilisateur
    .patch(function (req, res) {
        var id = parseInt(req.params.id);
        users.update(id, req.body.change);
        res.status(204).send(users.get(id));
    })
    // upload a user image
    // Must includes params :
    // type: String -> type of creation [possible values : ['audiovisuel', 'infographie', 'web'] ]
    // upload: Blob -> Creations image to save and send to the showroom ftp
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
                            res.status(204).send(response);
                        }
                    });
                    break;
                case 'infographie':
                    uploadTreatment(objectAssign(params, {imageCat: 'imagegraph', catId: 3}), function (err, response) {
                        if (err) {
                            console.log("ERROR");
                        } else {
                            res.status(204).send(response);
                        }
                    });
                    break;
                case 'web':
                    uploadTreatment(objectAssign(params, {imageCat: 'imageweb', catId: 2}), function (err, response) {
                        if (err) {
                            console.log("ERROR");
                        } else {
                            res.status(204).send(response);
                        }
                    });
                    break;
                default:
                    res.status(409).send({
                        error: true,
                        message: "Wrong type sent. Accepted ones : ['web', 'inforgraphie', 'audiovisuel']"
                    });
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
