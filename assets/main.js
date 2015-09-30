require('./style.css');
require('font-awesome-webpack');

const React = require('react');
const Controller = require('./components/Controller');
const PlayerActions = require('./PlayerActions');

document.addEventListener('touchstart', function() {}, false);

window.onload = () => {
  PlayerActions.loadState();
  React.render(
    <Controller />,
    document.getElementById('root'),
  );
};
