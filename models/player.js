'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'UserId' });
      this.belongsTo(models.Game, { foreignKey: 'GameId' });
      this.hasMany(models.Ship, { foreignKey: 'PlayerId' })
    }
  }
  Player.init({
    host: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER,
    GameId: DataTypes.INTEGER,
    ShipsPlaced: DataTypes.BOOLEAN,
    Active: DataTypes.BOOLEAN,
    Defeated: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};