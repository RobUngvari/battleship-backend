'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Player, { foreignKey: 'PlayerId' });
    }
  }
  Ship.init({
    type: DataTypes.INTEGER,
    x1: DataTypes.INTEGER,
    y1: DataTypes.INTEGER,
    h1: DataTypes.BOOLEAN,
    x2: DataTypes.INTEGER,
    y2: DataTypes.INTEGER,
    h2: DataTypes.BOOLEAN,
    x3: DataTypes.INTEGER,
    y3: DataTypes.INTEGER,
    h3: DataTypes.BOOLEAN,
    x4: DataTypes.INTEGER,
    y4: DataTypes.INTEGER,
    h4: DataTypes.BOOLEAN,
    x5: DataTypes.INTEGER,
    y5: DataTypes.INTEGER,
    h5: DataTypes.BOOLEAN,
    PlayerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ship',
  });
  return Ship;
};