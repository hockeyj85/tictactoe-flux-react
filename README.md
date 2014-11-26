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
