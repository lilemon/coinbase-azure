var api = require('./api');

exports.attach = function(app) {
  app.get('/', function(req, res) {
    req.query.app = app;
    req.query.from = req.query.from || 'btc';
    req.query.to = req.query.to || 'usd';
    api.getExchangeRate(req.query, function(obj) {
      res.render('index', obj);
    });
  });
};
