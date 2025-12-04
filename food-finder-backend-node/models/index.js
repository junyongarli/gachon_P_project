// models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const sequelize = require('../config/database'); // DB 연결 설정 불러오기
const db = {};

// models 폴더 안에 있는 모든 모델 파일을 자동으로 읽어와서 db 객체에 추가
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 모델 간의 관계 설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// User와 Favorite의 관계 설정: 1명의 User는 여러 개의 Favorite을 가질 수 있다. (1:N)
db.User.hasMany(db.Favorite, { foreignKey: 'userId', as: 'favorites' });
db.Favorite.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.Notice = require('./notice')(sequelize, Sequelize);
db.Inquiry = require('./inquiry')(sequelize, Sequelize);

db.User.hasMany(db.Inquiry, { foreignKey: 'userId', as: 'inquiries' });
db.Inquiry.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.ChatLog = require('./chatLog')(sequelize, Sequelize);

db.User.hasMany(db.ChatLog, { foreignKey: 'userId', as: 'chatLogs' });
db.ChatLog.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db