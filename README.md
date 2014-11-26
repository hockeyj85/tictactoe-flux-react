tictactoe-flux-react
====================

A simple implementation of tic-tac-toe (without any ai) using react and flux.

To set up
=========
*assuming debian-based linux*

* [npm](https://www.npmjs.org/) must be installed.
```sh
sudo apt-get install npm
```
* [sqlite](http://www.sqlite.org/) must be installed.
```sh
sudo apt-get install sqlite
```
* Clone this repo.
* npm can automatically install local project dependencies, but gulp must be installed globally to build the project. The commands to make this happen(from the project directory) are:
```sh
npm install
sudo npm install gulp -g
```
* Once dependencies are installed, build by running:
```sh
gulp
```
* To see the game, open
```sh
dist/client/index.html
```
* Profit.

Server API
==========

*** This is an optimistic update. This is not yet implemented ***


| Route                 | HTTP Verb | Description                      |
|:----------------------|:----------|:---------------------------------|
| api/create_game       | PUT       | Create a new game                |
| api/reset_game        | PUT       | Reset an already created game    |
| api/join_game         | PUT       | Join an already created game     |
| api/get_current_board | GET       | Get the board for a current game |
| api/make_move         | PUT       | Make a move                      |

## api/create_game

Create a new game on the server

Method: **PUT**

### Example input

```json
{
  user: "John",
  private: true,
  password: null
}
```

### Example output
```json
{
  success: true,
  gameId: 5,
  message: null
}
```

## api/reset_game

Reset a game in progress on the server

**Method: PUT**

### Example input

```json
{
  user: "John",
  gameId: 5,
  password: null
}
```

### Example output
```json
{
  success: true,
  gameId: 5,
  message: null
}
```

## api/join_game

Join a game somebody else has created.

**Method: PUT**

### Example input

```json
{
  user: "John",
  gameId: 5,
  password: null
}
```

### Example output
```json
{
  success: true,
  gameId: 5,
  message: null
}
```

## api/make_move

Send a potential move to the server.

Method: **PUT**

### Example input

```json
{
  user: "John",
  gameId: 5,
  move : {
    index: 3
  },
  password: null
}
```

### Example output
```json
{
  success: true,
  message: null
}
```

## api/get_current_game_state

Retrieve the game in progress.

Method: **GET**

### Example input

```json
{
  user: "John",
  gameId: 5,
  password: null
}
```

### Example output
```json
{
  success: true,
  message: null
  gameState: {
    gameId: 5,
    gameBoard: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    gameBoardState: [ 0, 0, 0, 0, 0, 0, 0, 0],
    gameFinished: false,
    lastWinner: null,
    score : {
      naughts: 0,
      crosses: 0
    },
    moves: 0,
    p1Turn: true,
    p1: "John",
    p2: "Gertrude"
    password: null
  }
}
```

Dependencies
============

The below dependencies will be automatically installed in the local project directory by npm.

| Dependency             | Reason                                                             |
|:-----------------------|:-------------------------------------------------------------------|
| flux                   | Required for dispatcher.                                           |
| react                  | Required to make react components.                                 |
| gulp                   | Handles build process.                                             |
| gulp-browserify        | Used by gulp, compiles node.js style modules as a single file.     |
| reactify               | Used by browserify (which is used by gulp). JSX to js transformer. |
| gulp-concat            | Used by gulp, concatenates files passed in.                        |
| gulp-uglify (optional) | Minifies code.                                                     |
| del                    | Used for clean process                                             |
| sqlite3                | Used for saving game state on server                               |
| express                | Used for running a http server                                     |
| body-parser            | Used to parse json to/from server                                  |
