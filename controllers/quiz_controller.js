// version closure
module.exports = function() {

var models = require('../models/models.js');

    return {
    	index: function(req, res) {	// GET /quizes
    		if (!req.query.search) {
        		models.Quiz.findAll().then(function (quizes){
        			res.render('quizes/index.ejs', {quizes: quizes});
        		}).catch( function(error){ next(error); });
        	}
        	else {
        		var search = "%" + req.query.search.replace(/\s/g, "%") + "%";
        		models.Quiz.findAll({where: ["pregunta like ?", search]})
        		.then(function (quizes){
        			res.render('quizes/index.ejs', {quizes: quizes});
        		}).catch( function(error){ next(error); });
        		console.log("search: " + search);
        	}
        },
        load: function(req, res, next, quizId) {	// Autoload - factoriza el código si incluye ruta :quizId
        	models.Quiz.find(req.params.quizId).then( function(quiz) {
        		if (quiz){
        			req.quiz = quiz;
        			next();
        		} else {
        			next(new Error('No existe quizId=' + quizId));
        		}
        	});
        },
        show: function(req, res) {	// GET /quizes/:id
            res.render('quizes/show', {quiz: req.quiz});
        },
        answer: function(req, res) {	// GET /quizes/:id/answer
        	var resultado = 'Incorrecto :-(';
        	if ( req.query.respuesta === req.quiz.respuesta ) resultado = 'Correcto :-)';
            res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
        },
        new: function(req, res) {  // GET /quizes/new
            //var quiz = models.Quiz.build({pregunta: "Pregunta", respuesta: "Respuesta"});
            var quiz = {pregunta: "", respuesta: ""};
            res.render('quizes/new', {quiz: quiz, errors: {}});
        },
        create: function(req, res) {  // POST /quizes/create
            // version en forma´directa creacion objeto quiz
            var qz = {pregunta: req.body.pregunta, respuesta: req.body.respuesta, tema: req.body.tema};
            var quiz = models.Quiz.build(qz); 

            // version MiriadaX no funciona en mi version de sequelize
            // inserta el objeto quiz, guarda en BBDD los campos pregunta y respuesta
            /*quiz.validate().then( function(err) {
                if(err){
                    res.render('quizes/new', {quiz: quiz, errors: err.errors});
                } else {
                    quiz.save({ fields: ["pregunta","respuesta"]}).then( function(){
                        res.redirect('/quizes');
                    });  
                }
            });*/

            quiz.save({ fields: ["pregunta","respuesta","tema"]}).then( 
                function() {
                    res.redirect('/quizes');
                }, 
                function(err) {
                    var errors = {};
                    for (var i=0; i< err.errors.length; i++)
                        errors[err.errors[i].path] = err.errors[i].message;   // Array a Object
                    //console.log(Object.getOwnPropertyNames(err.errors));
                    console.log(Object.getOwnPropertyNames(errors));
                    res.render('quizes/new', {quiz: quiz, errors: errors});
                }
            );
        },
        edit: function(req, res) {  // GET /quizes/:id/edit, objeto quiz de la BBD cargado en autoload
            var quiz = req.quiz;
            res.render('quizes/edit', {quiz: quiz, errors: {}});
        },
        update: function(req, res) {  // PUT /quizes/:id
            req.quiz.pregunta = req.body.pregunta;
            req.quiz.respuesta = req.body.respuesta;
            req.quiz.tema = req.body.tema;

            req.quiz.save({ fields: ["pregunta","respuesta","tema"]}).then( 
                function() {
                    res.redirect('/quizes');
                }, 
                function(err) {
                    var errors = {};
                    for (var i=0; i< err.errors.length; i++)
                        errors[err.errors[i].path] = err.errors[i].message;   // Array a Object
                    console.log(Object.getOwnPropertyNames(errors));
                    res.render('quizes/edit', {quiz: req.quiz, errors: errors});
                }
            );
        },
        destroy: function(req, res) {   // DELETE /quizes/:id
            req.quiz.destroy().then( 
                function() {
                    res.redirect('/quizes');
                },
                function(err) {
                    next(err);
                }
            );
        }
    }
};

/*
exports.question = function(req, res) {
            res.render('quizes/question', {pregunta: 'Capital de Italia'});
        };

exports.answer = function(req, res) {
        	if ( req.query.respuesta === 'Roma' )
            	res.render('quizes/answer', {	respuesta: 'Correcto :-)'});
            else
            	res.render('quizes/answer', {	respuesta: 'Incorrecto :-('});
        };
*/