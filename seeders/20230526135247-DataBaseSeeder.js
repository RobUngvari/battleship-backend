'use strict';
const { faker } = require('@faker-js/faker')
const { User, Player, Game, Ship } = require('../models')
const bcrypt = require('bcrypt');
// const { User, Player, Game, Ship } = require('./models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    let users = []
    let email_address = ''
    for (let i = 0; i < 10; i++){
      if (i == 0){
        email_address = 'admin1@battleship.com'
      } else if (i == 1){
        email_address = 'admin2@battleship.com'
      } else {
        email_address = faker.internet.email()
      }
      
      users.push(await User.create({
        email: email_address,
        password: await bcrypt.hash('labbo', 10),
        numberOfWins: faker.datatype.number({ min: 0, max: 3 })
      }))
    }

    let game1 = await Game.create({open : true})
    let player1 = await Player.create({host : true})
    let player2 = await Player.create({host : false})

    await player1.setUser(users[5].id)
    await player2.setUser(users[6].id)

    await player1.setGame(game1.id)
    await player2.setGame(game1.id)

    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
