var request = require('request');

exports.attach = function(app) {
  var BASE_URL = 'https://coinbase.com/api/v1/',
      EXCHANGE_RATE_ENDPOINT = BASE_URL + 'currencies/exchange_rates';

  app.locals.exchange_rate_map = {};

  app.get('/api/exchange_rate', function(req, res) {
    if (req.query.force) {
      request(EXCHANGE_RATE_ENDPOINT, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          app.locals.exchange_rate_map = JSON.parse(body);
          res.send({
            usd: app.locals.exchange_rate_map['btc_to_usd']
          });
        }
        else {
          res.send({
            error: error
         });
        }
      })
    }
    else {
      res.send(app.locals.exchange_rate_map);
    }
  });
};
