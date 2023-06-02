const auth = require("./auth");
const db = require("../models");
const { Sequelize, sequelize } = db;
const { ValidationError, DatabaseError, Op } = Sequelize;
const { User, Player, Game, Ship } = db;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { is } = require("superstruct");
const secret = process.env.JWT_SECRET || 'secret';

const validateShips = (jsonInput) => {
  // let benchmark = {2:2,3:2,4:1,5:1}
  let benchmark = {2:2} // TODO switch to above

  for (let index in jsonInput){
    let item = parsedInput[index];
    for (let key in item){
      if (['type', 'id', 'PlayerId'].includes(key)){
        continue
      }
      let data = item[key];
      if (data < 0 || data > 9){
        return false;
      }
    }
  }

  let occurences = jsonInput
    .map(x=>x.type)
    .reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});

  // check number of ships
  for (let key in occurences) {
      let value1 = occurences[key];
      let value2 = benchmark[key];
      if (value2 === 'undefined' || 
          value1 !== value2 ){

        return false;
      }
  }

  return true;
}

module.exports = {
    Query: {
        who: auth(async (_parent, _params, context) => await context.user.email),
        users: async () => await User.findAll(),

        games: async () => await Game.findAll(),
        game: async (_, { id }) => await Game.findByPk(id),

        players: auth(async (_,__,context) => await Player.findAll()),

        player: auth( async (_, _params, context) => {
          const loggedInUser = await context.user.id;          
          try{
            const player = await Player.findOne({ where: { UserId: loggedInUser } })
            return player
          }
          catch (err) {
            throw new Error('User doesn\'t have player.');
          }
          
        }),

        ships: auth( async (_, { input }, context) => {
          const loggedInUser = await context.user.id;          
          const player = await Player.findOne({ where: { UserId: loggedInUser } })
          const ships = await player.getShips()
          
          return ships
        }),

        isStarted: auth(async (_, _params, context) => {
          const loggedInUser = (await context.user).id;          
          const player = await Player.findOne({ where: { UserId: loggedInUser } })
          const game = await player.getGame()
          return (await game.Started)
        }),

        gameState: auth(async (_, _params, context) => {
          const loggedInUser = (await context.user).id;          
          const player = await Player.findOne({ where: { UserId: loggedInUser } })
          const game = await player.getGame()
          const gamePlayers = await game.getPlayers()
          const [rival] = gamePlayers.filter(z => z.id != player.id)

          return {
            gameOver: await game.Over,
            playerWon: !(await player.Defeated) && (await rival.Defeated),
          }
        })
    },

    Game: {
        players: async (game) => await game.getPlayers(),
      },
    Mutation: {

        changeHello: async (_, { message }, { pubsub }) => { // subs
          await pubsub.publish({ topic: 'HELLO', payload: { newHello: message } });
          return message;
        },

        login: async (_, { input }) => {
            const { email, password } = input;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new Error('User not found.');
            }

            const passwordIsValid = await bcrypt.compare(password, user.password);
            if (!passwordIsValid) {
                throw new Error('Invalid password.');
            }
            
            const token = jwt.sign(user.toJSON(), 'secret');
            return { token };
        },
        registration: async (_, { input }) => {
          const { email, password } = input;
  
          // Check for existing user
          const existingUser = await User.findOne({ where: { email } });
          if (existingUser) {
              throw new Error('Email already in use.');
          }
  
          // Hash password
          // const hashedPassword = await bcrypt.hash(password, 10);
  
          // Create user
          const user = await User.create({
              email,
              password: password,
              numberOfWins: 0
          });
  
          // Create and return jwt token
          const token = jwt.sign(user.toJSON(), 'secret');
          return { token };
        },
        attack: auth( async (_, { x, y }, context) => {
          const loggedInUser = await context.user.id;          
          const player = await Player.findOne({ where: { UserId: loggedInUser } })
          const game = await player.getGame()
          const gamePlayers = await game.getPlayers()
          const [rival] = gamePlayers.filter(z => z.id != player.id)

          if (!(await game.Started))
            throw new Error('Game not started yet.');
          if (await game.Over)
            throw new Error('Game is already over.');
          if (!(await player.Active))
            throw new Error('You are not the active player.');
          if (await player.Defeated)
            throw new Error('You already lost.');
          if (await rival.Defeated)
            throw new Error('You already won.');

          const rivalShips = await rival.getShips();

          let hit = false;
          let defeated = true;
          let shipWrecked = true;
          for (let shipIndex in rivalShips){
            let ship = rivalShips[shipIndex]
            let shipType = await ship.type;

            // check if hit
            shipWrecked = true;
            for (let i = 1; i <= shipType; i++) {
              if (ship[`x${i}`] == x && ship[`y${i}`] == y){
                hit = true;
                ship[`h${i}`] = true;
                await ship.save();
              }
              
              // check if ship wrecked
              shipWrecked &= ship[`h${i}`]
            }
            
            // check if all ships are wrecked
            defeated &= shipWrecked;
          }

          // set player defeated if lost
          if (defeated){
            rival.Defeated = defeated;
            game.Over = true;
            player.numberOfWins++;
            await rival.save();
            await game.save();
            await player.save();
          } 

          // change active player 
          player.Active = false;
          rival.Active = true;
          await player.save();
          await rival.save();
          

          return {
            hit: hit,
            defeated: defeated
          }

        }),
        placeShips: auth( async (_, { input }, context) => {
            parsedInput = JSON.parse(input);

            const loggedInUser = await context.user.id;          
            const player = await Player.findOne({ where: { UserId: loggedInUser } })
  
            if (!player) {
              throw new Error('Player not found.');
            }

            const isJsonValid = validateShips(parsedInput);
            if (!isJsonValid) {
              throw new Error('JSON invalid.');
            }

            let shipsAlreadyPlaced = await player.ShipsPlaced
            if (shipsAlreadyPlaced){
              throw new Error('Ships already placed, unable to mutate.');
            }

            let ship = null;
            const ships = []
            for (let index in parsedInput){
              let item = parsedInput[index];
              
              ship = await Ship.create(item);

              for (let i = 1; i <= item.type; i++) {
                ship[`h${i}`] = false;
              }
            
              await ship.save();
              ships.push(ship)
            }

            await player.setShips(ships);
            player.ShipsPlaced = true;
            await player.save();

            const game = await player.getGame()
            const gamePlayers = await game.getPlayers()
            const [rival] = gamePlayers.filter(z => z.id != player.id)
            const rivalShipPlaced = await rival.ShipsPlaced;

            if (rivalShipPlaced){
              game.Started = true;
              rival.Active = true;
              await game.save();
              await rival.save();
            }

            return {
              player : player,
              gameStarted : await game.Started,
            }

          }),
          createPlayer: auth( async (_, { host }, context) => {
            const loggedInUser = await context.user.id;

            try {
                const newPlayer = await Player.create({
                    host,
                });

                await newPlayer.setUser(loggedInUser)
                
                return newPlayer;
              } catch (err) {
                console.error(err);
                throw new Error('Failed to create player.');
              }
          }),
          createGame: auth( async (_, _params, context) => {
            const loggedInUser = await context.user.id;
            let playerCheck = await Player.findOne({ where: { UserId: loggedInUser } });

            if (!playerCheck){
              throw new Error('User already in a game.');
            }

            try {
                // init game
                const newGame = await Game.create({Open:true});

                // create host player
                const hostPlayer = await Player.create({host:true});
                await hostPlayer.setUser(loggedInUser)
                await hostPlayer.setGame(newGame.id)
                
                // return the new GamePayload
                return {
                  game: newGame,
                  player: hostPlayer
                };
              } catch (err) {
                throw new Error('Failed to create game.');
              }
          }),
          joinGame: auth( async (_, {id}, context) => {
            const loggedInUser = await context.user.id;
            let playerCheck = await Player.findOne({ where: { UserId: loggedInUser } });
            if (!playerCheck){
              throw new Error('User already in a game.');
            }

            const game = await Game.findByPk(id);
            
            let numberOfPlayers = await game.countPlayers();
            let isOpen = await game.Open;
            
            const [rival] = await game.getPlayers()
            if (rival.UserId === loggedInUser){
              throw new Error('Host of the game is the same user.');
            }

            try {
                
                if (isOpen && numberOfPlayers < 2){
                  const secondPlayer = await Player.create({host:false});
                  await secondPlayer.setUser(loggedInUser);
                  await secondPlayer.setGame(game.id);
                  game.Open = false;
                  await game.save();

                  return {
                    game: game,
                    player: secondPlayer
                  };
                } 
                return null;

              } catch (err) {
                throw new Error('Failed to join game.');
              }
          }),
          closeGame: auth( async (_, __, context) => {
            const loggedInUser = await context.user.id;          
            const player = await Player.findOne({ where: { UserId: loggedInUser } })
            const game = await player.getGame()
            const gamePlayers = await game.getPlayers()

            for (let playerIndex in gamePlayers){
              let playerSelected = gamePlayers[playerIndex];
              let playerShips = await playerSelected.getShips();
              for (let shipIndex in playerShips){
                let shipSelected = playerShips[shipIndex];
                shipSelected.destroy();
              }
              playerSelected.destroy();
            }
            const gameID = await game.id;
            game.destroy();
            return gameID
          }), 
          clearPlayer: auth( async (_, __, context) => {
            const loggedInUser = await context.user.id;          
            const player = await Player.findOne({ where: { UserId: loggedInUser } })
            const game = await player.getGame()
            if (game){
              throw new Error('Unable to delete player, first delete game.');
            }
            const playerId = await player.id;
            player.destroy();
            return playerId;
          })
          
    },
    Subscription: {
      newHello: {
        subscribe: (root, args, { pubsub }) => pubsub.subscribe('HELLO'),
      },
      listenRival: {
        subscribe: (root, args, { pubsub }) => pubsub.subscribe('ECHO'),
      },
    },
    
};
