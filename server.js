const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const paginate = require('express-paginate');

const config = require('./server/libs/config-loader');

const database = require('./server/libs/db');
const dbSeeder = require('./server/libs/db-seeder');

const pageParamMiddleware = require('./server/middlewares/page-param.middleware');
// const authMiddleware = require('./server/middlewares/jwt-auth.middleware');

const AuthError = require('./server/libs/errors/auth.error');

const app = express();

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';

class Server {

  constructor() {
    this.initAppSettings();
    this.initViewEngine();
    this.initExpressMiddleWare();
    this.initCustomMiddleware();
    this.initDb();
    this.initRoutes();
    this.start();
  }

  initAppSettings() {
    // set the secret key variable for jwt
    app.set('jwt-secret', config.jwt.secret);
  }

  initViewEngine() {
    // view engine setup
    app.set('views', path.join(__dirname, 'server/views'));
    app.set('view engine', 'hbs');
  }

  initExpressMiddleWare() {
    // uncomment after placing your favicon in /public
    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

    // Point static path to dist
    app.use(express.static(path.join(__dirname, 'dist')));

    app.use(logger('dev'));
    app.use(cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    // express-paginate
    app.use(paginate.middleware(10, 100));
  }

  initCustomMiddleware() {
    console.log('initCustomMiddleware...');

    // pagination param middleware
    app.use(pageParamMiddleware());

    if (process.platform === 'win32') {
      require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      }).on('SIGINT', () => {
        console.log('SIGINT: Closing MongoDB connection');
        database.close();
      });
    }

    process.on('SIGINT', () => {
      console.log('SIGINT: Closing MongoDB connection');
      database.close();
    });

  }

  initDb() {
    database.open(() => {
      dbSeeder.init();
    });
  }

  initRoutes() {

    // app.use('/user', authMiddleware)

    // routes
    app.use('/', require('./server/routes'));

    // 404 는 일단 띄우지 않음. 무조건 / 로만 접근하도록 함
    // catch 404 and forward to error handler
    // app.use(function(req, res, next) {
    //   const err = new Error('Not Found');
    //   err.status = 404;
    //   next(err);
    // });
    app.use(function (req, res, next) {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });

    // error handler
    app.use((err, req, res, next) => {
      // // set locals, only providing error in development
      // res.locals.message = err.message;
      // res.locals.error = req.app.get('env') === 'development' ? err : {};
      //
      // // render the error page
      // res.status(err.status || 500);
      // res.render('error');
      let isProd = req.app.get('env') === 'prod';


      const acceptHeader = req.headers.accept;
      const contentTypeHeader = req.headers['content-type'];

      let isJsonRequest = req.xhr || (acceptHeader && acceptHeader.indexOf('json') > -1)
        || (contentTypeHeader && contentTypeHeader.indexOf('json') > -1);


      if (isJsonRequest) {
        // if (err.name === 'UnauthorizedError') {
        if (err instanceof AuthError) {
          res.status(err.status)
            .json({
              error: err.name,
              message: err.message,
            });
          return;
        } else {
          if (!isProd) {
            res.status(500)
              .json({
                error: err.name,
                message: err.message,
              });
          } else {
            res.json({
              error: err.name,
            });
          }
          return;
        }
      } else {
        // TODO production 일때 처리?
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
      }
    });
  }

  start() {
    app.listen(port, (err) => {
      console.log('[%s] Listening on http://localhost:%d', process.env.NODE_ENV, port);
    });
    // app.on('error', onError);
    // app.on('listening', onListening);
  }

}
//
// /**
//  * Event listener for HTTP server "error" event.
//  */
//
// function onError(error) {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }
//
//   var bind = typeof port === 'string'
//     ? 'Pipe ' + port
//     : 'Port ' + port;
//
//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       console.error(bind + ' requires elevated privileges');
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       console.error(bind + ' is already in use');
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// }
//
// /**
//  * Event listener for HTTP server "listening" event.
//  */
//
// function onListening() {
//   var addr = server.address();
//   var bind = typeof addr === 'string'
//     ? 'pipe ' + addr
//     : 'port ' + addr.port;
//   debug('Listening on ' + bind);
// }
//

// /**
//  * Normalize a port into a number, string, or false.
//  */
//
// function normalizePort(val) {
//   var port = parseInt(val, 10);
//
//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }
//
//   if (port >= 0) {
//     // port number
//     return port;
//   }
//
//   return false;
// }


var server = new Server();
