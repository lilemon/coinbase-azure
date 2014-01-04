var request = require('request'),
    BASE_URL = 'https://coinbase.com/api/v1/',
    EXCHANGE_RATE_ENDPOINT = BASE_URL + 'currencies/exchange_rates';

function refreshExchangeRateCache(app, req, res) {
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
  });
}

function getExchangeRate(app, from, to, value) {
  var exchangeRateObj = {},
      exchangeRateString = '',
      exchangeRate = 1,
      exchangeKey = from + '_to_' + to;

  from = from.toLowerCase();
  to = to.toLowerCase();
  value = parseFloat(value);

  exchangeRateString = app.locals.exchange_rate_map[exchangeKey];
  if (!exchangeRateString) {
    return {
      error: 'Internal Server Error'
    };
  }
  console.log(exchangeRateString);
  exchangeRate = parseFloat(exchangeRateString);
  if (!exchangeRate) {
    return {
      error: 'Internal Service Error: ' + exchangeKey
    };
  }

  exchangeRateObj[to] = value;
  exchangeRateObj[from] = exchangeRate * value;
  return exchangeRateObj;
}

exports.attach = function(app) {
  app.locals.exchange_rate_map = {};

  app.get('/api/exchange_rate', function(req, res) {
    var fromExchangeRate = req.query.from,
        toExchangeRate = req.query.to || 'btc',
        valueExchangeRate = req.query.value || 1,
        isForced = req.query.force;

    if (isForced) {
      refreshExchangeRateCache(app, req, res);
    }
    else if (fromExchangeRate) { 
      res.send(getExchangeRate(app, fromExchangeRate, toExchangeRate, valueExchangeRate));
    }
    else {
      res.send(getExchangeRate(app, 'btc', 'usd', '1'));
    }
  });
};
