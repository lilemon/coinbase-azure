// Modular routes
// TODO: Automate this

exports.attach = function(app) {
  var staticRoute = require('./static'),
      apiRoute = require('./api');
  staticRoute.attach(app);
  apiRoute.attach(app);
};
