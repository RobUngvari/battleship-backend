'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      host: {
        type: Sequelize.BOOLEAN
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      GameId: {
        type: Sequelize.INTEGER
      },
      ShipsPlaced: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, 
      },
      Active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, 
      },
      Defeated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Players');
  }
};