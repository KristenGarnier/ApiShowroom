var apiEndPoint = require('./requestApi');
var ftp = require('./ftp');

module.exports = function(obj, fn) {
    var update = {};
    update['imageCat'] = obj.imageCat;
    obj.users.update(obj.users.get(obj.id).cid, update);
    ftp.upload(obj.cat, obj.newpath, obj.fileObj, obj.user);
    apiEndPoint(obj.catId, obj.users.get(obj.id).username, obj.date.format('DD-MM-YYYY'), obj.fileObj.upload.name, fn);
};
