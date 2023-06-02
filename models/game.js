'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Player, { foreignKey: 'GameId' })

      // this.belongsToMany(models.User, { through: 'Player', foreignKey: 'GameId' });
    }
  }
  Game.init({
    // id: DataTypes.INTEGER,
    Open: DataTypes.BOOLEAN,
    Started: DataTypes.BOOLEAN,
    Over: DataTypes.BOOLEAN,
    Change: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};