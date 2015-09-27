require('./style.css');
require('font-awesome-webpack');

const React = require('react');
const Controller = require('./controller');

document.addEventListener('touchstart', function() {}, false);

window.onload = () => {
  React.render(
    <Controller />,
    document.getElementById('root'),
  );
};
