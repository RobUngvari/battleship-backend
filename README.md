# battleship-backend
 Battleship Game with Graphql Backend

## Game steps in terms of endpoints

I.   player A calls createGame[M]<br />
II.  player B joins above mentioned game by joinGame[M][S]<br />
III. player A and B places their ships by placeShips[M][S]<br />
IV.  players can check if both party placed their ships isStarted[Q]<br />
V.   each play can attack in turn based way by attack[M][S]<br />
VI.  player can check if game is over by gameState[Q]<br />
VII. after game ended one player's client should clear the game instances by closeGame[M]<br />

M - mutation<br />
Q - query<br />
S - subsription for that event available<br />

Also subscriptions present and described later on. A and B players's clients in the turn based manner can wait for the other player and subscribe to published informations from server.

# Authentication
## Registration

This query string returns bcrypt token, which will be used for authentication.

```
mutation {
  register(input: {
    email: "user@example.com", 
    password: "securePassword", 
  }) {
    token
  }
}
```

## Login

```
mutation {
  login(input: {email: "admin@fullstack.hu", password: "labbo"}) {
    token
  }
}
```
After login token should be send in header examples below:

Admin1 token
```
{
  "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbjFAYmF0dGxlc2hpcC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRwS0tCU0RrQnJkY01GRUp2bTB0WlRlelNQTGNlbVBwZVJaSmczU2VER3FTQUxZMlZaRkw4eSIsIm51bWJlck9mV2lucyI6MiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0wMVQyMjowMToxOS4xMDBaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0wMVQyMjowMToxOS4xMDBaIiwiaWF0IjoxNjg1NjU2OTY3fQ.Lr4PdT523bR1E9WyCBcocX6jKyNRoHkcCjMrj_GDNuw"
}
```

Admin2 token
```
{
  "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhZG1pbjJAYmF0dGxlc2hpcC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCROWWVZUlFTaXpyMVU3UzVhemF3REF1a3d6akJ5UVQ1WlVRNjRKbTJ4Ynhob3FjVUlpTTF5cSIsIm51bWJlck9mV2lucyI6MiwiY3JlYXRlZEF0IjoiMjAyMy0wNi0wMVQyMjowMToxOS4xNzJaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0wMVQyMjowMToxOS4xNzJaIiwiaWF0IjoxNjg1NjU2OTk0fQ.hg991J1_hsiUlR0Nchdh3wR3iI5uZ3bGTuJpc5_rtdM"
}
```

# Game

## General queries
### Checking list of open games

```
query{
  games {
    id,
		players{id, host},    

  }
}
```

## Checking game by known id

```
query{
  game(id:1) {
    id,
    players{id, host}
  } 
}
```

## Checking players auth needed

```
query{
  players {
    id,
		UserId,    
    GameId,    

  }
}
```
## Checking currently logged in user.

```
query {
  who
}
```

## Create player (not used).
```
mutation {
  createPlayer(host:true){
    id
  }
}
```

## In game player wants to check it's own ships:

```
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
```

This query results in a response like this:

```
{
  "data": {
    "ships": [
      {
        "id": "31",
        "PlayerId": 24,
        "type": 2,
        "x1": 1,
        "y1": 2,
        "x2": 2,
        "y2": 2,
        "x3": null,
        "y3": null,
        "x4": null,
        "y4": null,
        "x5": null,
        "y5": null,
        "h1": true,
        "h2": false,
        "h3": null,
        "h4": null,
        "h5": null
      },
      {
        "id": "32",
        "PlayerId": 24,
        "type": 2,
        "x1": 8,
        "y1": 8,
        "x2": 6,
        "y2": 6,
        "x3": null,
        "y3": null,
        "x4": null,
        "y4": null,
        "x5": null,
        "y5": null,
        "h1": false,
        "h2": false,
        "h3": null,
        "h4": null,
        "h5": null
      }
    ]
  }
}
```

## Game logic related queries

### 1a. User creates game 
Also gets a player instance and a game instance. Game instance is in Open = true and Started = false and Over = false. Game responds its ID which will be unique to this game and basis of all communication.

```
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
```

After player created game it can start a subscription and listen for other users to join. Game id should be provided as string between quotes.

```
subscription {
  listenJoin(gameId: "2") {
    message
  }
}
```

If another player joined the server send a message to client who subsribed:

```
{
  "data": {
    "listenJoin": {
      "message": "Another player joined."
    }
  }
}
```

### 1b. User joins game by a known game ID.
From list page or directly by the id - should be provided as integer in mutation query as below:

```
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
```

### 2. Both player now should upload their ship coord.
Below are the required. Please not that example has fewer ships then required.

2 - 2 pcs <br />
3 - 2 pcs<br />
4 - 1 pc<br />
5 - 1 pc<br />

```
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
```

After player uploaded it should get the following response:

```
{
  "data": {
    "placeShips": {
      "player": {
        "id": "2"
      },
      "gameStarted": false
    }
  }
}
```
gameStarted value is false until both players ships are set. When it is set the ship position are not anymore mutable, and the second part of the game, the attacking starts.

Also if first player is placed ships and got gameStarted = false, then it is advised to subscribe to the event of the other player's ship upload:

```
subscription {
  listenStart(gameId: "2"){
    message
  }
}
```

When the other player is done placing it triggers this response:

```
{
  "data": {
    "listenStart": {
      "message": "Other player's ships are placed."
    }
  }
}
```

With the following query players can check if game is in started state or not:

```
query {
  isStarted
}
```

example response:
```
{
  "data": {
    "isStarted": false
  }
}
```
### 3. Main part of game.
Turn based part of gaming starts. Each player can check their status:

```
query {
  player {
    id
    ShipsPlaced
    Active
    Defeated
  }
}
```

It retrives a json like below. If Active is true then it is the current player's turn to attack. ShipsPlaced should be true since it is done in previous step. Defeated mean this player lost all of it's ships.

```
{
  "data": {
    "player": {
      "id": "23",
      "ShipsPlaced": true,
      "Active": true,
      "Defeated": false
    }
  }
}
```
Active player able to attack in the following format below. x and y are coordinates from 1 to 10.

```
mutation {
  attack(x:1, y:2){
    hit
    defeated
  }
}
```

Attack response:

```
{
  "data": {
    "attack": {
      "hit": true,
      "defeated": false
    }
  }
}
```
Here hit true means player hit one part of the rival player's ship. Defeated means that rivals all ships are destroyed.

Attacking automatically makes the current player inactive and the other player active. Here again the inactive player can subscribe to event to wait for the other player's attack.

```
subscription {
  listenRival(gameId: "2"){
    message
  }
}
```

This subscription results in the below json if the other player attacked:

```
{
  "data": {
    "listenRival": {
      "message": "Rival attacked."
    }
  }
}
```
After every attack befor the player initialize another attack the client should query the game status.

```
query {
  gameState{
    gameOver,
    playerWon
  }
}
```

It results a response like below:
```
{
  "data": {
    "gameState": {
      "gameOver": false,
      "playerWon": false
    }
  }
}
```
Only valid if gameOver is true, then playerWon field means player win in case of true, loss in case of false. gameOver flag means that all of the ships of one player is destroyed.

### 4. Closing game

After the game is ended the game instance and corresponding players and ships should be removed from database. Users and players are different entites. So only the player wrapping of user is destroyed which is associated with the game object. The below mutation does the trick:

```
mutation {
  closeGame
}
```
In case of game is closed but for some reason Player instance of user still exsits - block user to join another game - then we can call:


```
mutation {
  clearPlayer
}
```










