# battleship-backend
 Battleship Game with Graphql Backend

TODO test és route mappával kezdeni valamit

npm init -y

npm i sequelize

npm install --save-dev sequelize-cli

npm install -g sequelize-cli

npm install --save graphql

npm i fastify

npm i mercurius

npm i sqlite3

npm i bcrypt

npm i rimraf

npm i @faker-js/faker

sequelize init

"db": "npx rimraf database/database.sqlite && npx sequelize db:migrate --debug && npx sequelize db:seed:all --debug",



https://github.com/szerveroldali/2021-22-2/blob/main/restapi_zh_maj11.md

download rest starting pack

npm i
-- npm i rimraf -- ez csak akkor ha nincs benne a kezdőcsomagban
-- de amúgyis a kezdőcsomagot használd, ne buziskodj

npx sequelize model:generate --name User --attributes email:string
-- seederbe beírni, hogy milyen adatoakt akarunk seedelni

npm run db
npx sequelize seed:generate  --name DataBaseSeeder

npx sequelize model:generate --name Playlist --attributes title:string,private:boolean,UserId:integer
-- seederbe beírni, hogy milyen adatoakt akarunk seedelni
-- modelsben beírni a relációkat pl this.hasMany(models.Playlist)
-- help: https://github.com/szerveroldali/2021-22-1/blob/main/SequelizeAssociations.md

npx sequelize model:generate --name Track --attributes title:string,length:integer,author:string,genres:string,album:string,url:string
-- seederbe beírni, hogy milyen adatoakt akarunk seedelni
-- modelsben beírni a relációkat pl this.hasMany(models.Playlist)
-- help: https://github.com/szerveroldali/2021-22-1/blob/main/SequelizeAssociations.md

-- a relációk a node konzolos cuccban így tesztelhetőek
-- node
-- let u = await User.findByPk(2)
-- await u.getPlaylists()
-- .exit

-- many to many kapcsolathoz
npx sequelize migration:generate --name create-playlist-track
-- abba a migrációba berakod az előre megírt szart és átnevezgeted jól
-- seederbe megcsinálni a relációkat


npx sequelize model:generate --name User --attributes email:string,numberOfWins:integer
npx sequelize model:generate --name Game --attributes private:boolean
npx sequelize model:generate --name Player --attributes role:integer,UserId:integer,GameId:integer
// playerbe kellenek az attribok

npx sequelize model:generate --name Ship --attributes type:integer,x1:integer,y1:integer,h1:boolean,x2:integer,y2:integer,h2:boolean,x3:integer,y3:integer,h3:boolean,x4:integer,y4:integer,h4:boolean,x5:integer,y5:integer,h5:boolean,PlayerId:integer

npm run db
npx sequelize seed:generate --name DataBaseSeeder

User:
User.associate = (models) => {
  User.belongsToMany(models.Game, { through: 'Player', foreignKey: 'UserId' });
};

Game:

Game.associate = (models) => {
  Game.belongsToMany(models.User, { through: 'Player', foreignKey: 'GameId' });
};


Player:

Player.associate = (models) => {
  Player.belongsTo(models.User, { foreignKey: 'UserId' });
  Player.belongsTo(models.Game, { foreignKey: 'GameId' });
};



query{
  games {
    id,
		players{id, host},    

  }
}

query{
  game(id:1) {
    id,
    players{id, host}
  } 
}

query{
  players {
    id,
		UserId,    
    GameId,    

  }
}


mutation {
  login(input: {email: "Arvid_Heathcote@gmail.com"}) {
    token
  }
}

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJBcnZpZF9IZWF0aGNvdGVAZ21haWwuY29tIiwibnVtYmVyT2ZXaW5zIjoyLCJjcmVhdGVkQXQiOiIyMDIzLTA1LTI2VDIxOjE4OjU1Ljc5MVoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA1LTI2VDIxOjE4OjU1Ljc5MVoiLCJpYXQiOjE2ODUxOTUxMTh9.v9XGDowTayW9eazD5eAXaTNzz8QGgRdzP9ejdIFS7oo

Header:
{
  "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBmdWxsc3RhY2suaHUiLCJwYXNzd29yZCI6IiQyYiQxMCRRYUhPWmJzYjJzbnRrdTQuRWFDOHV1TElNVEZrWDMxSWdlUEN1alFXdE5qYXdPdkRsMWs2ZSIsIm51bWJlck9mV2lucyI6MSwiY3JlYXRlZEF0IjoiMjAyMy0wNS0yN1QxODo1OToxNy40MjBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNS0yN1QxODo1OToxNy40MjBaIiwiaWF0IjoxNjg1MjE0MDIxfQ.cr5fxIgywAEvYWhNuBe4R-f04QNkcScMQ97CpMEbnxE"
}

mutation {
  login(input: {email: "admin@fullstack.hu", password: "labbo"}) {
    token
  }
}

query {
  who
}

query{
  ships {
    id
  	PlayerId
  	type
  
  	x1
  	y1
    x2
    y2
    x3
    y3
    x4
    y4
    x5
    y5

    h1
    h2
    h3
    h4
    h5
  }
}

mutation {
  createPlayer(host:true){
    id
  }
}





mutation {
  register(input: {
    email: "user@example.com", 
    password: "securePassword", 
  }) {
    token
  }
}

Admin1 then Admin2

{
  "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbjFAYmF0dGxlc2hpcC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRwS0tCU0RrQnJkY01GRUp2bTB0WlRlelNQTGNlbVBwZVJaSmczU2VER3FTQUxZMlZaRkw4eSIsIm51bWJlck9mV2lucyI6MiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0wMVQyMjowMToxOS4xMDBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0wMVQyMjowMToxOS4xMDBaIiwiaWF0IjoxNjg1NjU2OTY3fQ.Lr4PdT523bR1E9WyCBcocX6jKyNRoHkcCjMrj_GDNuw"
}

mutation {
  createGame {
    game {
      id
    }
    player {
      id
      host
    }
  }
}

{
  "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhZG1pbjJAYmF0dGxlc2hpcC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCROWWVZUlFTaXpyMVU3UzVhemF3REF1a3d6akJ5UVQ1WlVRNjRKbTJ4Ynhob3FjVUlpTTF5cSIsIm51bWJlck9mV2lucyI6MiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0wMVQyMjowMToxOS4xNzJaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0wMVQyMjowMToxOS4xNzJaIiwiaWF0IjoxNjg1NjU2OTk0fQ.hg991J1_hsiUlR0Nchdh3wR3iI5uZ3bGTuJpc5_rtdM"
}

mutation {
  joinGame(id:2) {
    game {
      id
    }
    player {
      id
      host
    }
  }
}

mutation {
  placeShips(
    input: "[{\"type\": 2, \"x1\": 1, \"y1\": 2, \"x2\": 2, \"y2\": 2}, {\"type\": 2, \"x1\": 8, \"y1\": 8, \"x2\": 6, \"y2\": 6}]"
  ) {
    player {
      id
    }
    gameStarted 
  }
}

query {
  isStarted
}

createGame[M][A] -> joinGame[M][B] -> placeShips[M][A+B] -> isStarted[Q] [TBD] -> attack[M][A+B] -> isOver[Q] [TBD] 

query {
  player {
    id
    ShipsPlaced
    Active
    Defeated
  }
}

mutation {
  attack(x:1, y:2){
    hit
    defeated
  }
}

query {
  gameState{
    gameOver,
    playerWon
  }
}