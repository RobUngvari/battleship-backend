'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Player, { foreignKey: 'UserId' })

      // this.belongsToMany(models.Game, { through: 'Player', foreignKey: 'UserId' });
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    numberOfWins: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};