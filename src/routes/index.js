// Modular routes

exports.attach = function(app) {
  var staticPages = require('./static');
  staticPages.attach(app);
};
