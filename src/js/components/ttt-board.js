/** @jsx React.DOM */

/**
  This is the board component.
  It sets up a board and renders tiles onto it.

  */

var React = require('react');
var Tile = require('./ttt-tile.js');

function _generateBoardStyle(boardSize) {
  return {
    marginRight: "auto",
    marginLeft: "auto",
    marginBottom: "auto",
    marginTop: "auto",
    width: boardSize+"px",
    height: boardSize+"px",
    padding: "0px",
    borderRadius: "10px",
    boxShadow: "10px 10px 5px #888888",
    border: "1px solid lightgray"
  };
}

var Board = React.createClass ({
  render: function() {
    var boardSize = this.props.boardSize;
    var boardBorderWidth = this.props.boardBorderWidth;
    var boardNodes = this.props.data.map(function (tileType, index) {
      return (
        <Tile
        x={index % 3}
        y={Math.floor(index / 3)}
        index={index}
        tileType={tileType}
        boardSize={boardSize - 1}
        boardBorderWidth = {boardBorderWidth}
        key={index} />
      )
    })
    return (
      <div
        className="board bg-primary"
        style={_generateBoardStyle(this.props.boardSize)}
        >
      {boardNodes}
      </div>
    )
  }
});

module.exports = Board;
