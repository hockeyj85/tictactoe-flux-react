/** @jsx React.DOM */
var React = require('react');
var Board = require('./ttt-board.js');
var AppStore = require('../stores/ttt-store.js');
var AppActions = require('../actions/ttt-actions.js');

var boardSize = 400;

function _getBoard() {
  return AppStore.getBoard();
};

module.exports = React.createClass ({
  getInitialState: function() {
    return {gameBoard: _getBoard()}
  },
  componentWillMount: function() {
    AppStore.addChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState({gameBoard: _getBoard()});
  },
  handleReset: function() {
    AppActions.resetGame();
  },
  render: function() {
    var buttonStyle = {marginTop: "20px", textAlign: "center", width: boardSize};
    var boardStyle= { width: (boardSize + 130) + "px", marginLeft: "auto", marginRight: "auto", textAlign: "left"};
    return (
      <div className="jumbotron" style={boardStyle} >
      <Board
        key={(new Date).getTime()}
        data={this.state.gameBoard}
        boardSize={boardSize}
        boardBorderWidth={10} />
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
