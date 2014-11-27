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


| Route                | HTTP Verb | Description                      |
|:---------------------|:----------|:---------------------------------|
| api/register_user    | PUT       | Register a new user              |
| api/create_game      | PUT       | Create a new game                |
| api/reset_game       | PUT       | Reset an already created game    |
| api/join_game        | PUT       | Join an already created game     |
| api/get_current_game | PUT       | Get the board for a current game |
| api/make_move        | PUT       | Make a move                      |

## api/register_user
Register a user, a user must be registered and given a ```userId``` to use any of the other api calls.

Method: **PUT**

### Example input

```json
{
  "userName": "John",
  "userPass": "bad_pass"
}
```

### Example output
```json
{
  "success": true,
  "userId": 5,
}
or
{
  "success":  false,
  "error": 10
}
```

## api/create_game

Create a new game on the server.
The ``gameBoard`` and ```gameBoardState``` at this stage are often corrupt on game creation.

Method: **PUT**

### Example input

```json
{
  "userId": 5,
  "userPass": "bad_pass",
  "private": false,
  "gameName": "a fun game",
  "gamePass": "passicle"
}
```

### Example output
```json
{
  "success": true,
  "game": {
    "gameId": 1,
    "gameBoard": [
      -1,
      -1,
      -1
    ],
    "gameName": "a fun game",
    "private": false,
    "gameBoardState": [
      -1
    ],
    "lastWinner": null,
    "gamePass": null,
    "p1Score": 0,
    "p2Score": 0,
    "p1Id": 2,
    "p2Id": null,
    "moves": 0,
    "p1Turn": "FALSE"
  }
}
```

## api/reset_game

Reset a game in progress on the server

**Method: PUT**

### Example input

```json
{
  "userId": 5,
  "gameId": 5,
  "userPass": "cheesicle"
}
```

### Example output
```json

```

## api/join_game

Join a game somebody else has created.

**Method: PUT**

### Example input

```json
{
  "userId": 5,
  "gameId": 5,
  "gamePass": "passicle",
  "userPass": "cheesicle"
}
```

### Example output
```json

```

## api/make_move

Send a potential move to the server.

Method: **PUT**

### Example input

```json
{
  "userId": 5,
  "gameId": 5,
  "userPass": "cheesicle"
  "move": {
    "LOL NOT SURE YET":"HA!"
  }
}
```

### Example output
```json

```

## api/get_current_game

Retrieve the game in progress.

Method: **PUT**

### Example input

```json
{
  "userId": 5,
  "gameId": 5,
  "userPass": "cheesicle"
}
```

### Example output
```json

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
