var fs = require('fs');
var imageOptim = require('imageoptim');

module.exports = {
    upload: function (filebag, user, cb) {
        var newPath, file,fileContent;

        if(!filebag.path){
            fileContent  = filebag.upload;
        }else {
            fileContent = filebag;
        }
        fs.readFile(fileContent.path, function (err, data) {
            file = "/uploads/" + user + fileContent.name;
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
                            cb(file, user, newPath, filebag);
                        });
                }
            });
        });
    }
};
