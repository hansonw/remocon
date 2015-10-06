require('./style.css');
require('font-awesome-webpack');

const React = require('react');
const Controller = require('./components/Controller');
const PlayerActions = require('./PlayerActions');

PlayerActions.loadState();
document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
document.addEventListener('touchstart', function() {}, false);

window.onload = () => {
  React.render(
    <Controller />,
    document.getElementById('root'),
  );
};
