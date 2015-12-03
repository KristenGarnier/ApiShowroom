// FTP
var ftp = require('ftp');

// FTP INIT

module.exports = {
    upload : function(path, newPath, file){
        var uploadFtp = new ftp();
        uploadFtp.on('ready', function () {
            uploadFtp.put(newPath, path + "/" + file.name, function (err) {
                console.log(err);
                if (err) throw err;
                uploadFtp.end();
            });
        });

        uploadFtp.connect({
            host: "ftp.kristengarnier.com",
            user: "kristeng",
            password: "zb9r8Wfw"
        });
    }
};

