// version closure
module.exports = function() {

var models = require('../models/models.js');

    return {
        show: function(req, res) {
            models.Quiz.find(req.params.quizId).then(function(quiz) {
            	res.render('quizes/show', {quiz: quiz});
            });
        },
        answer: function(req, res) {
        	models.Quiz.find(req.params.quizId).then(function(quiz) {
        		if ( req.query.respuesta === quiz.respuesta )
            		res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto :-)'});
            	else
            		res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto :-('});
        	});
        }
        index: function(req, res) {
        	models.Quiz.findAll().then(function (quizes){
        		res.render('quizes/index.ejs', {quizes: quizes});
        	});
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