'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.INTEGER
      },
      x1: {
        type: Sequelize.INTEGER
      },
      y1: {
        type: Sequelize.INTEGER
      },
      h1: {
        type: Sequelize.BOOLEAN,
      },
      x2: {
        type: Sequelize.INTEGER
      },
      y2: {
        type: Sequelize.INTEGER
      },
      h2: {
        type: Sequelize.BOOLEAN,
      },
      x3: {
        type: Sequelize.INTEGER
      },
      y3: {
        type: Sequelize.INTEGER
      },
      h3: {
        type: Sequelize.BOOLEAN,
      },
      x4: {
        type: Sequelize.INTEGER
      },
      y4: {
        type: Sequelize.INTEGER
      },
      h4: {
        type: Sequelize.BOOLEAN,
      },
      x5: {
        type: Sequelize.INTEGER
      },
      y5: {
        type: Sequelize.INTEGER
      },
      h5: {
        type: Sequelize.BOOLEAN,
      },
      PlayerId: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Ships');
  }
};