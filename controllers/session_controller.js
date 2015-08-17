// version closure
module.exports = function() {

//var models = require('../models/models.js');

    return {
        loginRequired: function(req, res, next) {  // MW de autorización de zona HTTP restringida
            if (req.session.user) {
                next();
            } else {
                res.redirect('/login');
            }
        },
        new: function(req, res) {  // GET /login
            var errors = req.session.errors || null;
            req.session.errors = null;

            res.render('sessions/new', {errors: errors});
        },
        create: function(req, res) {  // POST /login
            var login = req.body.login;
            var password = req.body.password;
            
            var userController = require('./user_controller')();    // check this works 

            userController.autenticar(login, password, function(error, user){
                if (error){
                    req.session.errors = error; 
                    //[{ "message": error.message, "login": error.login, "password": error.password }];
                    //console.log(Object.getOwnPropertyNames(error));
                    res.redirect("/login");
                    return;
                }
                // Creamos objeto para guardar la sesion
                req.session.user = {id: user.id, username: user.username};

                res.redirect(req.session.redir.toString());
            });
        },
        destroy: function(req, res) {   // GET /logout (DELET /logout)
            delete req.session.user;
            res.redirect(req.session.redir.toString());
        }
    }
};
