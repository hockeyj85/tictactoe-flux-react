tictactoe-flux-react
====================

A simple implementation of tic-tac-toe (without any logic) using react and flux.

#To set up
1. [npm](https://www.npmjs.org/) must be installed.
* Clone this repo.
* To get all of the dependencies, run:
```sh
npm install
```
* Once dependencies are installed, build by running:
```sh
gulp
```
* Open
```sh
dist/index.html
```
* Profit.

# Dependencies
The below dependencies will be automatically installed in the local project directory by npm.
| Dependency             | Reason                                                             |
|:-----------------------|:-------------------------------------------------------------------|
| flux                   | Required for dispatcher.                                           |
| react                  | Required to make react components.                                 |
| gulp                   | Handles build process.                                             |
| gulp-browserify        | Used by gulp, compiles node.js style modules as a single file.     |
| reactify               | Used by browserify (which is used by gulp). JSX to js transformer. |
| gulp-concat            | Used by gulp, concatenates files passed in.                        |
| gulp-uglify (optional) | Minifies code                                                      |
