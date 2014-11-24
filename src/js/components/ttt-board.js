/** @jsx React.DOM */
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
    backgroundColor: "black"
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
        boardSize={boardSize}
        boardBorderWidth = {boardBorderWidth}
        key={index} />
      )
    })
    return (
      <div className="board" style={_generateBoardStyle(this.props.boardSize)} enabled="true">
      {boardNodes}
      </div>
    )
  }
});

module.exports = Board;
