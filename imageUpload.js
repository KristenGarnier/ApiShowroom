var fs = require('fs');
var imageOptim = require('imageoptim');

module.exports = {
    upload: function (file, user, cb) {
        var newPath, file;
        fs.readFile(file.path, function (err, data) {
            file = "/uploads/" + user + file.name;
            newPath = __dirname + file;
            fs.writeFile(newPath, data, function (err) {
                if (err) {
                    res.status(409).send({
                        error: true,
                        message: err.message
                    });
                } else {
                    imageOptim.optim([newPath], {reporters: ['flat']})
                        .then(function (res) {
                            console.log(res);
                        })
                        .done(function () {
                            cb(file, user);
                        });
                }
            });
        });
    }
};
