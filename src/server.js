var express = require('express')
  , app = exports.app = express()
  , http = require('http')
  , path = require('path')
  , routes = require('./routes'); 


app.configure(function() {
  app.set("trust proxy", true); // Azure runs behind a proxy
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: process.env.SECRET || 'booyah' }));

  app.use(function (req, res, next) {
    res.locals.user = req.user;
    res.locals.env = process.env.NODE_ENV || 'development';
    next();
  });

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


app.configure('development', function() {
  app.use(express.errorHandler());
  app.locals.pretty = true;
});


routes.attach(app);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Node server listening on port " + app.get('port'));
});
