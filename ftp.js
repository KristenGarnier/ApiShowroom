// FTP
var ftp = require('ftp'),
    config = require('./config');

// FTP INIT

module.exports = {
    // upload :: String -> String -> Object -> Number
    // Uploading a file in a specific path on the remote server
    upload : function(path, newPath, file, user){
        var uploadFtp = new ftp(), fileContent;
        if(!file.path){
            fileContent  = file.upload;
            fileContent = path + '/' + fileContent.name;
        }else {
            fileContent = file;
            fileContent = path + '/'+ user + fileContent.name;
        }

        // Creating a ftp connection
        uploadFtp.on('ready', function () {
            uploadFtp.put(newPath, fileContent, function (err) {
                if (err) throw err;
                uploadFtp.end();
            });
        });

        //FTP identifier
        uploadFtp.connect({
            host: config.host,
            user: config.user,
            password: config.password
        });
    }
};

