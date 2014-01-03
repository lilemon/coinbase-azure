// Modular routes
// TODO: Automate this

exports.attach = function(app) {
  var staticRoute = require('./static'),
      apiRoute = require('./api');
  apiRoute.attach(app);
  staticRoute.attach(app);
};
