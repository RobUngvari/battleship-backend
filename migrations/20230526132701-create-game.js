'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Open: {
        type: Sequelize.BOOLEAN,
        defaultValue: true, 
      },
      Started: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, 
      },
      Over: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, 
      },
      Change: {
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
    await queryInterface.dropTable('Games');
  }
};