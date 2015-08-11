// version closure
module.exports = function() {

var models = require('../models/models.js');

    return {
    	index: function(req, res) {	// GET /quizes
        	models.Quiz.findAll().then(function (quizes){
        		res.render('quizes/index.ejs', {quizes: quizes});
        	}).catch( function(error){ next(error); });
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