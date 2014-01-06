var request = require('request'),
    BASE_URL = 'https://coinbase.com/api/v1/',
    EXCHANGE_RATE_ENDPOINT = BASE_URL + 'currencies/exchange_rates';

var getExchangeRate = exports.getExchangeRate = function(params, callback) {
  var app = params.app,
      force = params.force || false,
      from = params.from,
      to = params.to || 'btc',
      value = params.value || '1.0';

  getExchangeRateCache = function(cacheCallback) {
    if (force || Object.keys(app.locals.exchange_rate_map).length === 0) {
      request(EXCHANGE_RATE_ENDPOINT, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          app.locals.exchange_rate_map = JSON.parse(body);
        }
        else {
          console.error('Refreshing coinbase service error', error);
        }
        cacheCallback(app.locals.exchange_rate_map);
      });
    }
    else {
      cacheCallback(app.locals.exchange_rate_map);
    }
  },

  readExchangeRate = function(exchangeRateMap, fromArg, toArg, valueArg) {
    var exchangeRateString = '',
        exchangeRate = 1,
        exchangeKey;

    fromArg = fromArg.toLowerCase();
    toArg = toArg.toLowerCase();
    valueArg = parseFloat(valueArg);
    exchangeKey = fromArg + '_to_' + toArg;

    exchangeRateString = exchangeRateMap[exchangeKey];
    if (!exchangeRateString) {
      return {
        error: 'Internal Server Error'
      };
    }

    exchangeRate = parseFloat(exchangeRateString);
    if (!exchangeRate) {
      return {
        error: 'Internal Service Error: ' + exchangeKey
      };
    }

    return {
      from: {
        currency: fromArg,
        value: valueArg
      },
      to: {
        currency: toArg,
        value: exchangeRate * valueArg
      } 
    };
  };

  getExchangeRateCache(function(exchangeRateMap) {
    var rate;
    if (from) { 
      rate = readExchangeRate(exchangeRateMap, from, to, value);
    }
    else {
      rate = readExchangeRate(exchangeRateMap, 'btc', 'usd', value);
    }
    callback(rate);
  });
}

exports.attach = function(app) {
  app.locals.exchange_rate_map = {};
  app.get('/api/exchange_rate', function(req, res) {
    req.query.app = app;
    getExchangeRate(req.query, function(rateObj) {
      res.jsonp(rateObj, req, res);
    });
  });
}