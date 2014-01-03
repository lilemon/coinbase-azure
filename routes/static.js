exports.attach = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {
      usd: app.locals.exchange_rate_map['btc_to_usd']
    });
  });
};
