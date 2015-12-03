// FTP
var ftp = require('ftp');

// FTP INIT

module.exports = {
    upload : function(){
        var uploadFtp = new ftp();
        uploadFtp.on('ready', function () {
            console.log('www/' + files.avatar.name);
            uploadFtp.put(newPath, 'www/' + files.avatar.name, function (err) {
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

