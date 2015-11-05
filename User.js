var Sequelize = require('sequelize');
var db = new Sequelize('sequelize', 'root', null, {
    host: 'localhost',
    dialect: 'mysql'
});

var User = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    imageweb:{
        type: Sequelize.STRING,
        validate:{
            isUrl: true
        }
    },
    imagegraph:{
        type: Sequelize.STRING,
        validate:{
            isUrl: true
        }
    },
    imageaudio:{
        type: Sequelize.STRING,
        validate:{
            isUrl: true
        }
    },
    portrait:{
        type: Sequelize.STRING,
        validate:{
            isUrl: true
        }
    }
});

module.exports = User;