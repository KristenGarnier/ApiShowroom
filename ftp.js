// FTP
var ftp = require('ftp');

// FTP INIT

module.exports = {
    upload : function(path, newPath, file, user){
        var uploadFtp = new ftp(), fileContent;
        if(!file.path){
            fileContent  = file.upload;
            fileContent = path + '/' + fileContent.name;
        }else {
            fileContent = file;
            fileContent = path + '/'+ user + fileContent.name;
        }

        uploadFtp.on('ready', function () {
            uploadFtp.put(newPath, fileContent, function (err) {
                if (err) throw err;
                uploadFtp.end();
            });
        });

        uploadFtp.connect({
            host: "showroom.mmi-lepuy.fr",
            user: "joncourb_sr",
            password: "jon_sr"
        });
    }
};

