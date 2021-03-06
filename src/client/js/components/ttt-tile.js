/** @jsx React.DOM */

// ttt-tile.js


// REQUIRED MODULES
// =============================================================================

var React = require('react');
var AppActions = require('../actions/ttt-actions.js');
var AppConstants = require('../constants/ttt-constants.js');

var EMPTY = AppConstants.EMPTY;
var NAUGHT = AppConstants.NAUGHT;
var CROSS = AppConstants.CROSS;
// HELPER FUNCTIONS
// =============================================================================

function _generateTileGraphic(type) {
  switch(type) {
    case NAUGHT: return (
      <h1>0</h1>
    );
    case CROSS: return (
      <h1>X</h1>
    );
    default: return (
      <div>
      </div>
    );
  }
};

function _generateSymbolStyle(boardSize) {
  return {
    position: "absolute",
    top: boardSize / 6 - 50,
    left: boardSize / 6 - 15
  }
}

function _generateTileWidth(boardWidth, borderWidth) {
  return Math.floor( (boardWidth-(4*borderWidth)) / 3 );
}

function _generateTileStyle(x, y, boardWidth, borderWidth)
{
  var b = borderWidth;
  var left = Math.floor( b + ( x * (boardWidth - (4*b)) / 3) + x * b);
  var top = Math.floor( b + ( y * (boardWidth - (4*b)) / 3) + y * b);
  var size = _generateTileWidth(boardWidth, borderWidth)
  return {
    position: "absolute",
    marginLeft: left,
    marginTop: top,
    width: size+"px",
    height: size+"px",
    //borderRadius: "5px",
    //backgroundColor: "rgb(255,255,255)",
  }
}


// REACT COMPONENT
// =============================================================================

var Tile = React.createClass( {
  handleTileClick: function(arg) {
    var move = {index: this.props.index};
    AppActions.makeMove(move);
  },

  render: function() {
    var x = this.props.x;
    var y = this.props.y;
    var tileType = this.props.tileType;
    var tileStyle = _generateTileStyle(x, y, this.props.boardSize, this.props.boardBorderWidth);
    var symbolStyle = _generateSymbolStyle(this.props.boardSize);

    return (
      <div className="btn btn-default"
      onClick={this.handleTileClick}
      style={tileStyle} >
      {_generateTileGraphic(tileType)}
      </div>
    );
  }
});

module.exports = Tile;
