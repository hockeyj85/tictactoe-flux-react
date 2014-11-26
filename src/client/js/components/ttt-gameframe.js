/** @jsx React.DOM */

// ttt-gameframe.js


// REQUIRED MODULES
// =============================================================================

var React = require('react');
var Board = require('./ttt-board.js');
var AppStore = require('../stores/ttt-store.js');
var AppActions = require('../actions/ttt-actions.js');
var ScoreBoard = require('./ttt-scoreboard.js');
var MessageBox = require('./ttt-messagebox.js');


// HELPER FUNCTIONS
// =============================================================================

function _getBoard() {
  return AppStore.getBoard();
};

function _getScore() {
  return AppStore.getScore();
}

function _getGameEnabled() {
  return !AppStore.getGameFinished().state;
}

function _getGameFinishedMessage() {
  return AppStore.getGameFinished().message;
}


// REACT COMPONENT
// =============================================================================

module.exports = React.createClass ({
  getInitialState: function() {
    return {
      gameBoard: _getBoard(),
      boardSize: 400,
      gameEnabled: _getGameEnabled()
    }
  },
  componentWillMount: function() {
    AppStore.addChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState({
      gameBoard: _getBoard(),
      gameEnabled: _getGameEnabled(),
      score : _getScore()
    });
  },
  handleReset: function() {
    AppActions.resetGame();
  },
  render: function() {
    var boardSize = this.state.boardSize;
    var buttonStyle = {marginTop: "20px", textAlign: "center", width: boardSize};
    var boardStyle= { width: (boardSize + 130) + "px", marginLeft: "auto", marginRight: "auto", textAlign: "left"};
    var message = _getGameFinishedMessage();


    return (
      <div className="jumbotron" style={boardStyle} >
        <Board
          key={(new Date).getTime()}
          data={this.state.gameBoard}
          boardSize={boardSize}
          boardBorderWidth={10}
          enabled={this.state.gameEnabled} />

        <br />
        <p><MessageBox message={message} hidden={this.state.gameEnabled}/></p>

        <ScoreBoard score={this.state.score} width={this.state.boardSize} />

        <form>
          <input
            value="reset"
            style={buttonStyle}
            onClick={this.handleReset}
            className="btn btn-danger text-center"/>
        </form>
      </div>
    );
  }
});
