require('babel/register');

const app = require('./lib/app');

app.listen(80, function() {
  console.log('Server started');
});