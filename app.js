var express = require('express');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// partials layout
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015')); // semilla para cifrar cookie
app.use(session());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

// MW auto-logout
/* Si hay un método POST, PUT, DELETE, la transaccion se debe abortar */
app.use(function(req, res, next){

    if (req.session.user) { // si hay session
        var now = (new Date()).getTime();
        var diff = now - (req.session.backupTime || now);
        if (!req.session.expired) req.session.expired = false;

        if (diff > 120000) {                        // 2 minutos = 120000 milisegundos  
            delete req.session.user;                // borra sesion anterior
            delete req.session.backupTime;

            req.session.expired = true;
                    
            if (req.method !== "GET"){               // Abortar
                res.redirect("/");
                return;
            }
        } else {
            req.session.backupTime = now;
        }
        // Log times
        //console.log("Transaction time: " + now);
        //console.log("Diferencia: " + diff);   
        //console.log("req.method: " + req.method); 
    } 
    
    next();
});

// Helpers dinámicos
app.use(function(req, res, next){
    // guardar path en session.redir para volver después de login
    if (!req.path.match(/\/login|\/logout/))
        req.session.redir = req.path;

    // hacer visible la req.session en las vistas
    res.locals.session = req.session;

    next();
});


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
