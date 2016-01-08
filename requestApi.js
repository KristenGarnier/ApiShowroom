var request = require('superagent');

// RequestApi :: Number -> String -> String -> String -> Function
module.exports = function(catId, username, date, name, fn){
    request
        .post("http://showroom.mmi-lepuy.fr/API/ajouterRealisation.php?titre=upload%20from%20server&catid="+ catId +"&auteur=" + username + "&dateP=" + date + "&url=" + name)
        .end(fn);
};
