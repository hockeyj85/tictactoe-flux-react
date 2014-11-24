/** @jsx React.DOM */

var React = require('react');

function _getBrowserWidth() {
  var w = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;
  return w;
}

function _getBrowserHeight() {
  var h = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;
  return h;
}
var MessageBox = React.createClass ({
  getDefaultProps: function() {
    return {
      message: "Hi there!",
      hidden: false
    }
  },
  render: function() {
    var vis = this.props.hidden ? "hidden" : "visible";
    var width = 300;
    var w = _getBrowserWidth();
    var h = _getBrowserHeight();
    var left = w / 2 - width / 2;
    var top = h / 2 - 200;

    var messageStyle = {
      border: "1px solid gray",
      borderRadius: "5px",
      position: "fixed",
      left: "40%",
      top: "30%",
      right: "40%",
      visibility: vis,
      backgroundColor: "white",
      padding: "20px",
      textAlign: "center"
    };


    return (
      <div style={messageStyle} >
        <h1>{this.props.message}</h1>
      </div>
    )
  }
});

module.exports = MessageBox;
